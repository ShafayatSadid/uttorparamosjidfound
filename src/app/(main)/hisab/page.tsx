"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPublic, fetchWithAuth } from "@/lib/api";

export default function PublicHisabPage() {
    const [persons, setPersons] = useState<any[]>([]);
    const [weeklies, setWeeklies] = useState<any[]>([]);
    const [miscs, setMiscs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");





    useEffect(() => {
        async function fetchMiscs() {
            try {
                const mdata = await fetchPublic("/api/misc-donations");
                setMiscs(mdata);

                const wdata = await fetchPublic("/api/weekly");
                setWeeklies(wdata);

                const pdata = await fetchPublic("/api/persons");
                setPersons(pdata);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchMiscs()
    }, []);

    const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";

    const filteredPersons = persons.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        মসজিদের হিসাব নিকাশ
                    </h1>
                    <p className="text-muted-foreground">
                        স্বচ্ছতা ও জবাবদিহিতার জন্য মসজিদের যাবতীয় আয়-ব্যয়ের হিসাব সবার জন্য উন্মুক্ত।
                    </p>
                </div>

                <Tabs defaultValue="persons" className="w-full">
                    <TabsList className="bg-white border border-primary/10 shadow-sm p-1 h-auto flex flex-wrap justify-center gap-1 rounded-lg w-full max-w-2xl mx-auto mb-8">
                        <TabsTrigger value="persons" className="rounded-md px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">ব্যক্তিভিত্তিক</TabsTrigger>
                        <TabsTrigger value="weekly" className="rounded-md px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">সাপ্তাহিক</TabsTrigger>
                        <TabsTrigger value="misc" className="rounded-md px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">বিবিধ দান</TabsTrigger>
                    </TabsList>

                    {/* ১. ব্যক্তিভিত্তিক */}

                    <TabsContent value="persons" className="space-y-4">
                        <Card className="border-primary/10 shadow-sm max-w-7xl mx-auto">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-secondary/50">
                                            <TableRow>
                                                {/* নতুন: ক্রমিক নম্বরের হেডার */}
                                                <TableHead className="font-bold text-primary w-[50px] text-center">ক্রম</TableHead>
                                                <TableHead className="font-bold text-primary w-[200px]">নাম</TableHead>
                                                <TableHead className="font-bold text-primary min-w-[300px]">ফান্ডের বিবরণ</TableHead>
                                                <TableHead className="font-bold text-primary text-right">মোট নির্ধারিত</TableHead>
                                                <TableHead className="font-bold text-primary text-right">মোট আদায়</TableHead>
                                                <TableHead className="font-bold text-primary text-right">মোট বাকি</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPersons.length === 0 ? (
                                                <TableRow>
                                                    {/* colSpan 5 থেকে 6 করা হলো */}
                                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">কোনো তথ্য পাওয়া যায়নি।</TableCell>
                                                </TableRow>
                                            ) : (
                                                // map এ index যুক্ত করা হলো
                                                filteredPersons.map((person, index) => {
                                                    const totalAssigned = person.totalAssigned || person.funds?.reduce((acc: number, f: any) => acc + f.assignedAmount, 0) || 0;
                                                    const totalPaid = person.totalPaid || person.contributions?.reduce((acc: number, c: any) => acc + c.amount, 0) || 0;
                                                    const totalDue = person.totalDue !== undefined ? person.totalDue : (totalAssigned - totalPaid);

                                                    return (
                                                        <TableRow key={person._id} className="hover:bg-slate-50/50">
                                                            {/* নতুন: ক্রমিক নম্বর */}
                                                            <TableCell className="text-center align-top pt-4 font-medium text-muted-foreground">
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell className="align-top pt-4">
                                                                <div className="font-semibold text-primary">{person.name}</div>
                                                            </TableCell>

                                                            <TableCell className="align-top pt-4">
                                                                <div className="space-y-2">
                                                                    {person.funds?.map((f: any) => {
                                                                        const fundName = person.fundTypeDetails?.find((ft: any) => ft._id === f.fundTypeId)?.name || "ফান্ড";
                                                                        const paidForFund = person.contributions?.filter((c: any) => c.fundTypeId === f.fundTypeId).reduce((sum: number, c: any) => sum + c.amount, 0) || 0;
                                                                        const dueForFund = f.assignedAmount - paidForFund;

                                                                        return (
                                                                            <div key={f._id} className="text-sm border-l-2 border-primary/30 pl-3 py-1.5 bg-slate-50 rounded-r-md">
                                                                                <span className="font-semibold text-primary block text-xs mb-0.5">{fundName}</span>
                                                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                                                                                    <span className="text-muted-foreground">নির্ধারিত: <strong className="text-slate-700">{formatTk(f.assignedAmount)}</strong></span>
                                                                                    <span className="text-green-600">আদায়: <strong>{formatTk(paidForFund)}</strong></span>
                                                                                    <span className="text-red-500">বাকি: <strong>{formatTk(dueForFund)}</strong></span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell className="text-right align-top pt-4 font-semibold text-primary">
                                                                {formatTk(totalAssigned)}
                                                            </TableCell>
                                                            <TableCell className="text-right align-top pt-4 font-semibold text-green-600">
                                                                {formatTk(totalPaid)}
                                                            </TableCell>
                                                            <TableCell className="text-right align-top pt-4 font-bold text-red-500">
                                                                {formatTk(totalDue)}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ২. সাপ্তাহিক */}
                    <TabsContent value="weekly">
                        <Card className="border-primary/10 shadow-sm max-w-7xl mx-auto">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-secondary/50">
                                        <TableRow className="px-4">
                                            <TableHead className="font-bold text-primary w-[50px] text-center">ক্রম</TableHead>
                                            <TableHead className="font-bold text-primary">তারিখ</TableHead>
                                            <TableHead className="font-bold text-primary text-right">পরিমাণ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {weeklies.map((w, index) => (
                                            <TableRow key={w._id}>
                                                <TableCell className="text-center align-top pt-4 font-medium text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{new Date(w.date).toLocaleDateString("bn-BD")}</TableCell>
                                                <TableCell className="text-right font-medium text-green-600">{formatTk(w.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ৩. বিবিধ দান */}
                    <TabsContent value="misc">
                        <Card className="border-primary/10 shadow-sm max-w-7xl mx-auto">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-secondary/50">
                                            <TableRow className="px-4">
                                                <TableHead className="font-bold text-primary w-[50px] text-center">ক্রম</TableHead>
                                                <TableHead className="font-bold text-primary">তারিখ</TableHead>
                                                <TableHead className="font-bold text-primary">দাতার নাম</TableHead>
                                                <TableHead className="font-bold text-primary">উদ্দেশ্য</TableHead>
                                                <TableHead className="font-bold text-primary text-right">পরিমাণ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {miscs.map((m,index) => (
                                                <TableRow key={m._id}>
                                                    <TableCell className="text-center align-top pt-4 font-medium text-muted-foreground">
                                                                {index + 1}
                                                            </TableCell>
                                                    <TableCell>{new Date(m.date).toLocaleDateString("bn-BD")}</TableCell>
                                                    <TableCell className="font-semibold">{m.donorName}</TableCell>
                                                    <TableCell>{m.purpose}</TableCell>
                                                    <TableCell className="text-right font-medium text-green-600">{formatTk(m.amount)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}