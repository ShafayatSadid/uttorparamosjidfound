"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Trash2, CalendarDays } from "lucide-react";

// Define the type for the weekly data
interface WeeklyData {
    _id: string;
    date: string;
    amount: number;
}

export default function AdminWeeklyPage() {
    const [weeklies, setWeeklies] = useState<WeeklyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ফর্ম স্টেট
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const timer = setTimeout(() => setDate(today), 0);
        return () => clearTimeout(timer); // ক্লিনআপ
    }, []);

    useEffect(() => {
        fetchWeeklies();
    }, []);

    async function fetchWeeklies() {
        try {
            const data = await fetchWithAuth("/api/weekly");
            setWeeklies(data as WeeklyData[]);
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
            await fetchWithAuth("/api/weekly", {
                method: "POST",
                body: JSON.stringify({ date, amount: Number(amount) }),
            });
            setIsDialogOpen(false);
            setAmount(""); // ফর্ম রিসেট
            fetchWeeklies();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "সেভ করতে সমস্যা হয়েছে";
            alert(message || "সেভ করতে সমস্যা হয়েছে");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("আপনি কি নিশ্চিতভাবে এই রেকর্ডটি ডিলিট করতে চান?")) return;
        try {
            await fetchWithAuth(`/api/weekly/${id}`, { method: "DELETE" });
            fetchWeeklies();
        } catch (error) {
            console.error(error);
        }
    };

    const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";

    // মোট আদা বের করা
    const totalWeekly = weeklies.reduce((sum, w) => sum + w.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">সাপ্তাহিক আদা</h1>
                    <p className="text-muted-foreground text-sm mt-1">প্রতি সপ্তাহের আদাকৃত টাকার হিসাব।</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger render={<Button className="bg-primary text-white" />}>
                        <Plus className="mr-2 h-4 w-4" /> নতুন আদা
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>সাপ্তাহিক আদা যোগ করুন</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>তারিখ</Label>
                                <Input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>পরিমাণ (৳)</Label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white mt-4">
                                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "সেভ করুন"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* মোট আদা সামারি কার্ড */}
            <Card className="bg-primary text-white border-none shadow-md max-w-sm">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-primary-foreground/80 text-sm font-medium mb-1">সর্বমোট সাপ্তাহিক আদা</p>
                        <h3 className="text-3xl font-bold text-accent">{formatTk(totalWeekly)}</h3>
                    </div>
                    <div className="p-3 bg-white/10 rounded-full">
                        <CalendarDays className="h-8 w-8 text-accent" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-secondary/50">
                                <TableRow>
                                    <TableHead>তারিখ</TableHead>
                                    <TableHead className="text-right">পরিমাণ</TableHead>
                                    <TableHead className="text-right">অ্যাকশন</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {weeklies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            এখনো কোনো সাপ্তাহিক আদা যোগ করা হনি।
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    weeklies.map((w) => (
                                        <TableRow key={w._id}>
                                            <TableCell className="font-medium text-primary">
                                                {new Date(w.date).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-green-600">
                                                {formatTk(w.amount)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(w._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}