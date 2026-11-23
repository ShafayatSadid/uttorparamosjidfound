"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Trash2, HeartHandshake, Phone } from "lucide-react";

// ✅ ১. ObjectId বাদ, _id এখন string
interface Misc {
    _id?: string;
    donorName?: string;
    phone?: string;
    purpose?: string;
    receivedBy?: string;
    amount?: number;
    date?: string; 
    createdAt?: string;
}

export default function AdminMiscPage() {
    const [miscs, setMiscs] = useState<Misc[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ফর্ম স্টেট
    const [donorName, setDonorName] = useState("");
    const [phone, setPhone] = useState("");
    const [purpose, setPurpose] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        fetchMiscs();
    }, []);

    async function fetchMiscs() {
        try {
            const data = await fetchWithAuth("/api/misc-donations");
            setMiscs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetchWithAuth("/api/misc-donations", {
                method: "POST",
                body: JSON.stringify({
                    donorName,
                    phone,
                    purpose,
                    receivedBy,
                    amount: Number(amount),
                    date,
                }),
            });
            setIsDialogOpen(false);
            
            // ফর্ম রিসেট
            setDonorName("");
            setPhone("");
            setPurpose("");
            setReceivedBy("");
            setAmount("");
            setDate(new Date().toISOString().split("T")[0]);

            fetchMiscs();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "সেভ করতে সমস্যা হয়েছে";
            alert(message || "সেভ করতে সমস্যা হয়েছে");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ handleDelete-এ string প্যারামিটার
    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("আপনি কি নিশ্চিতভাবে এই দানের রেকর্ডটি ডিলিট করতে চান?")) return;
        try {
            await fetchWithAuth(`/api/misc-donations/${id}`, { method: "DELETE" });
            fetchMiscs();
        } catch (error) {
            console.error(error);
        }
    };

    // ✅ ২. amount undefined হলেও হ্যান্ডেল করবে
    const formatTk = (amount?: number) => {
        return new Intl.NumberFormat("bn-BD").format(amount || 0) + " ৳";
    };

    // ✅ ৩. reduce-এ undefined এরর ফিক্স
    const totalMisc = miscs.reduce((sum, m) => sum + (m.amount || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">বিবিধ দান</h1>
                    <p className="text-muted-foreground text-sm mt-1">বিবিধ খাতের সকল দান ও অনুদানের হিসাব।</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    {/* ✅ ৪. DialogTrigger এর রেন্ডার প্রপ ফিক্স */}
                    <DialogTrigger 
                        render={
                            <Button className="bg-primary text-white">
                                <Plus className="mr-2 h-4 w-4" /> নতুন দান
                            </Button>
                        } 
                    />

                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>বিবিধ দান যোগ করুন</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>দাতার নাম</Label>
                                    <Input required placeholder="নাম" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>মোবাইল নাম্বার</Label>
                                    <Input required placeholder="০১৭XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>দানের উদ্দেশ্য</Label>
                                <Input required placeholder="যেমন: মসজিদের কার্পেট ক্রয়" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>কার কাছে জমা হল</Label>
                                <Input required placeholder="যেমন: কোষাধ্যক্ষ" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>পরিমাণ (৳)</Label>
                                    <Input type="number" required placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>তারিখ</Label>
                                    <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white mt-4">
                                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "সেভ করুন"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* মোট দান সামারি কার্ড */}
            <Card className="bg-primary text-white border-none shadow-md max-w-sm">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-primary-foreground/80 text-sm font-medium mb-1">সর্বমোট বিবিধ দান</p>
                        <h3 className="text-3xl font-bold text-accent">{formatTk(totalMisc)}</h3>
                    </div>
                    <div className="p-3 bg-white/10 rounded-full">
                        <HeartHandshake className="h-8 w-8 text-accent" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-secondary/50">
                                    <TableRow>
                                        <TableHead>তারিখ</TableHead>
                                        <TableHead>দাতা ও মোবাইল</TableHead>
                                        <TableHead>উদ্দেশ্য</TableHead>
                                        <TableHead>জমা নিয়েছেন</TableHead>
                                        <TableHead className="text-right">পরিমাণ</TableHead>
                                        <TableHead className="text-right">অ্যাকশন</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {miscs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                এখনো কোনো বিবিধ দান যোগ করা হয়নি।
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        // ✅ ৫. MiscItem বাদ দিয়ে সরাসরি Misc ব্যবহার
                                        miscs.map((m: Misc) => (
                                            <TableRow key={m._id}>
                                                <TableCell className="font-medium text-primary whitespace-nowrap">
                                                    {m.date ? new Date(m.date).toLocaleDateString("bn-BD") : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-primary">{m.donorName || "-"}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Phone className="h-3 w-3" /> {m.phone || "-"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{m.purpose || "-"}</TableCell>
                                                <TableCell>{m.receivedBy || "-"}</TableCell>
                                                <TableCell className="text-right font-semibold text-green-600">
                                                    {formatTk(m.amount)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(m._id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}