"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Printer, Loader2, User, CalendarDays, Layers, Receipt } from "lucide-react";

interface Person { _id: string; name: string; phone: string; }
type ReportType = "weekly" | "monthly" | "yearly" | "total";

export default function AdminReportsPage() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [fundTypes, setFundTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ব্যক্তিগত রিপোর্ট স্টেট
    const [selectedPerson, setSelectedPerson] = useState<string>("");

    // সামগ্রিক রিপোর্ট স্টেট
    const [reportType, setReportType] = useState<ReportType>("monthly");
    const [month, setMonth] = useState<number>(1);
    const [year, setYear] = useState<number>(2026);

    useEffect(() => {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());

        async function fetchData() {
            try {
                const [personsData, fundTypesData] = await Promise.all([
                    fetchWithAuth("/api/persons"),
                    fetchWithAuth("/api/fund-types")
                ]);
                setPersons(personsData);
                setFundTypes(fundTypesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // ১. ব্যক্তিগত রিপোর্ট প্রিন্ট
    const handlePersonPrint = () => {
        if (!selectedPerson) return alert("দয়া করে একজন ব্যক্তি সিলেক্ট করুন");
        window.open(`/print/person/${selectedPerson}`, "_blank");
    };

    // ২. সামগ্রিক রিপোর্ট প্রিন্ট
    const handleCombinedPrint = () => {
        let url = `/print/combined?type=${reportType}`;
        if (reportType === "monthly") url += `&month=${month}&year=${year}`;
        else if (reportType === "yearly") url += `&year=${year}`;
        window.open(url, "_blank");
    };

    // ৩. ফান্ড ভিত্তিক রিপোর্ট (নির্মাণ ও বাৎসরিক)
    const handleFundPrint = (fundName: string) => {
        const fund = fundTypes.find(f => f.name.includes(fundName));
        if (fund) {
            window.open(`/print/fund/${fund._id}`, "_blank");
        } else {
            alert(`${fundName} ফান্ডটি ডাটাবেসে পাওয়া যায়নি।`);
        }
    };

    const handleExpensePrint = () => {
        window.open(`/print/expenses`, "_blank");
    };

    const months = [
        { value: 1, label: "জানুয়ারি" }, { value: 2, label: "ফেব্রুয়ারি" },
        { value: 3, label: "মার্চ" }, { value: 4, label: "এপ্রিল" },
        { value: 5, label: "মে" }, { value: 6, label: "জুন" },
        { value: 7, label: "জুলাই" }, { value: 8, label: "আগস্ট" },
        { value: 9, label: "সেপ্টেম্বর" }, { value: 10, label: "অক্টোবর" },
        { value: 11, label: "নভেম্বর" }, { value: 12, label: "ডিসেম্বর" },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">রিপোর্ট ও প্রিন্ট</h1>
                <p className="text-muted-foreground">সব ধরনের হিসাব ও রিপোর্ট পিডিএফ (PDF) আকারে ডাউনলোড করুন।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ১. ব্যক্তিগত রিপোর্ট কার্ড */}
                <Card className="border-primary/10 shadow-sm flex flex-col">
                    <CardHeader className="bg-secondary/30 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg"><User className="h-6 w-6 text-primary" /></div>
                            <div>
                                <CardTitle className="text-xl text-primary">ব্যক্তিগত রিপোর্ট</CardTitle>
                                <CardDescription>নির্দিষ্ট ব্যক্তির চাঁদা ও জমার হিসাব</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                            <Label>ব্যক্তি সিলেক্ট করুন</Label>
                            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                                <SelectTrigger>
                                    <SelectValue placeholder="নাম দিয়ে খুঁজুন..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem value="loading" disabled>লোড হচ্ছে...</SelectItem>
                                    ) : (
                                        persons.map((p) => (
                                            <SelectItem key={p._id} value={p._id}>{p.name} ({p.phone})</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handlePersonPrint} disabled={!selectedPerson} className="w-full bg-primary text-white h-12">
                            <Printer className="mr-2 h-5 w-5" /> রিপোর্ট জেনারেট করুন
                        </Button>
                    </CardContent>
                </Card>

                {/* ২. সামগ্রিক রিপোর্ট কার্ড */}
                <Card className="border-primary/10 shadow-sm flex flex-col">
                    <CardHeader className="bg-secondary/30 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/20 rounded-lg"><CalendarDays className="h-6 w-6 text-accent" /></div>
                            <div>
                                <CardTitle className="text-xl text-primary">সামগ্রিক রিপোর্ট</CardTitle>
                                <CardDescription>মাসিক, বাৎসরিক ও মোট আদায়ের হিসাব</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>রিপোর্টের ধরন</Label>
                                <Select value={reportType} onValueChange={(val: string) => setReportType(val as ReportType)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">মাসিক রিপোর্ট</SelectItem>
                                        <SelectItem value="yearly">বাৎসরিক রিপোর্ট</SelectItem>
                                        <SelectItem value="weekly">সাপ্তাহিক (গত ৭ দিন)</SelectItem>
                                        <SelectItem value="total">সর্বকালীন মোট রিপোর্ট</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {(reportType === "monthly") && (
                                    <div className="space-y-2">
                                        <Label>মাস</Label>
                                        <Select value={month.toString()} onValueChange={(val: string) => setMonth(Number(val))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {(reportType === "monthly" || reportType === "yearly") && (
                                    <div className="space-y-2">
                                        <Label>বছর</Label>
                                        <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} min={2020} max={2100} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button onClick={handleCombinedPrint} className="w-full bg-accent text-primary hover:bg-accent/90 font-bold h-12 mt-4">
                            <FileText className="mr-2 h-5 w-5" /> রিপোর্ট জেনারেট করুন
                        </Button>
                    </CardContent>
                </Card>

                {/* ৩. ফান্ড ভিত্তিক রিপোর্ট কার্ড (নতুন) */}
                <Card className="border-primary/10 shadow-sm flex flex-col md:col-span-2">
                    <CardHeader className="bg-secondary/30 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg"><Layers className="h-6 w-6 text-primary" /></div>
                            <div>
                                <CardTitle className="text-xl text-primary">ফান্ড ভিত্তিক রিপোর্ট</CardTitle>
                                <CardDescription>নির্দিষ্ট ফান্ডের (যেমন: নির্মাণ/বাৎসরিক) সবার হিসাব একসাথে প্রিন্ট করুন</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => handleFundPrint("নির্মাণ কাজ")}
                            className="flex-1 bg-primary text-white hover:bg-primary/90 h-12"
                        >
                            <Printer className="mr-2 h-5 w-5" /> নির্মাণ কাজের রিপোর্ট
                        </Button>
                        <Button
                            onClick={() => handleFundPrint("বাৎসরিক চাঁদা")}
                            className="flex-1 bg-primary text-white hover:bg-primary/90 h-12"
                        >
                            <Printer className="mr-2 h-5 w-5" /> বাৎসরিক চাঁদার রিপোর্ট
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-primary/10 shadow-sm flex flex-col md:col-span-2">
                    <CardHeader className="bg-secondary/30 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg"><Receipt className="h-6 w-6 text-red-600" /></div>
                            <div>
                                <CardTitle className="text-xl text-primary">খরচের রিপোর্ট</CardTitle>
                                <CardDescription>মসজিদের সকল খরচের বিস্তারিত তালিকা প্রিন্ট করুন</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Button onClick={handleExpensePrint} className="w-full bg-primary text-white hover:bg-primary/90 h-12">
                            <Printer className="mr-2 h-5 w-5" /> খরচের রিপোর্ট জেনারেট করুন
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}