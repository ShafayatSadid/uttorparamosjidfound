"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, AlertCircle, TrendingUp, Loader2, Receipt } from "lucide-react";

interface DashboardSummary {
  totalPersons: number;
  totalAssigned: number;
  totalContributions: number;
  totalDue: number;
  totalWeekly: number;
  totalMisc: number;
  grandTotalCollection: number;
  totalExpenses: number;
  currentBalance: number;
}

export default function HisabOverviewPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const summary = await fetchWithAuth("/api/dashboard");
        setData(summary);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ফরম্যাট নাম্বার (যেমন: 10000 => ১০,০০০)
  const formatTk = (amount: number) => {
    return new Intl.NumberFormat('bn-BD').format(amount) + " ৳";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">ওভারভিউ ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground text-sm mt-1">মসজিদের সার্বিক হিসাবের এক নজরে চিত্র।</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card className="bg-white border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">মোট ব্যক্তি</span>
              <div className="p-2 bg-secondary rounded-md"><Users className="h-4 w-4 text-primary" /></div>
            </div>
            <div className="text-2xl font-bold text-primary">{data?.totalPersons || 0} জন</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">মোট আদায়</span>
              <div className="p-2 bg-green-100 rounded-md"><TrendingUp className="h-4 w-4 text-green-600" /></div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatTk(data?.grandTotalCollection || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">নির্ধারিত চাঁদা</span>
              <div className="p-2 bg-secondary rounded-md"><Wallet className="h-4 w-4 text-primary" /></div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatTk(data?.totalAssigned || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">মোট বাকি</span>
              <div className="p-2 bg-red-100 rounded-md"><AlertCircle className="h-4 w-4 text-red-600" /></div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatTk(data?.totalDue || 0)}</div>
          </CardContent>
        </Card>

      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-white border-primary/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">সাপ্তাহিক আদায়</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatTk(data?.totalWeekly || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-primary/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">বিবিধ দান</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatTk(data?.totalMisc || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary-foreground/80">ব্যক্তিভিত্তিক আদায়</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatTk(data?.totalContributions || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">মোট খরচ</span>
              <div className="p-2 bg-red-100 rounded-md"><Receipt className="h-4 w-4 text-red-600" /></div>
            </div>
            <div className="text-2xl font-bold text-red-600">{formatTk(data?.totalExpenses || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white border-none shadow-md">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-foreground/80">বর্তমান ব্যালেন্স</span>
              <div className="p-2 bg-white/10 rounded-md"><Wallet className="h-4 w-4 text-accent" /></div>
            </div>
            <div className="text-2xl font-bold text-accent">{formatTk(data?.currentBalance || 0)}</div>
          </CardContent>
        </Card>

    </div>
  );
}