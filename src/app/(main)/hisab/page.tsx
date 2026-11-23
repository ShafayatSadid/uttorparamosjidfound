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

export default function PublicHisabPage() {
    const [persons, setPersons] = useState<any[]>([]);
    const [weeklies, setWeeklies] = useState<any[]>([]);
    const [miscs, setMiscs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchPublicData() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                // টোকেন ছাড়া সাধারণ ফেচ
                const [personsRes, weeklyRes, miscRes] = await Promise.all([
                    fetch(`${API_URL}/api/persons`),
                    fetch(`${API_URL}/api/weekly`),
                    fetch(`${API_URL}/api/misc-donations`),
                ]);

                const [personsData, weeklyData, miscData] = await Promise.all([
                    personsRes.json(),
                    weeklyRes.json(),
                    miscRes.json(),
                ]);

                setPersons(personsData);
                setWeeklies(weeklyData);
                setMiscs(miscData);
            } catch (error) {
                console.error("Failed to fetch public data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPublicData();
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
                        <div className="relative w-full max-w-md mx-auto mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="নাম দিয়ে খুঁজুন..."
                                className="pl-9 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Card className="border-primary/10 shadow-sm max-w-7xl mx-auto">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-secondary/50">
                                            <TableRow className=" px-4">
                                                <TableHead className="font-bold text-primary">নাম</TableHead>
                                                <TableHead className="font-bold text-primary text-right">নির্ধারিত চাঁদা</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPersons.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">কোনো তথ্য পাওয়া যায়নি।</TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredPersons.map((person) => {
                                                    const assigned = person.funds?.reduce((acc: number, f: any) => acc + f.assignedAmount, 0) || 0;
                                                    return (
                                                        <TableRow key={person._id}>
                                                            <TableCell>
                                                                <div className="font-semibold text-primary">{person.name}</div>
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">{formatTk(assigned)}</TableCell>
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
                                            <TableHead className="font-bold text-primary">তারিখ</TableHead>
                                            <TableHead className="font-bold text-primary text-right">পরিমাণ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {weeklies.map((w) => (
                                            <TableRow key={w._id}>
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
                                                <TableHead className="font-bold text-primary">তারিখ</TableHead>
                                                <TableHead className="font-bold text-primary">দাতার নাম</TableHead>
                                                <TableHead className="font-bold text-primary">উদ্দেশ্য</TableHead>
                                                <TableHead className="font-bold text-primary text-right">পরিমাণ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {miscs.map((m) => (
                                                <TableRow key={m._id}>
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