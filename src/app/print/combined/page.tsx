"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

function CombinedReportContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "total";
  const month = searchParams.get("month") || "";
  const year = searchParams.get("year") || "";

  const [weeklies, setWeeklies] = useState<any[]>([]);
  const [miscs, setMiscs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [wData, mData] = await Promise.all([
          fetchWithAuth("/api/weekly"),
          fetchWithAuth("/api/misc-donations"),
        ]);

        // ফ্রন্টএন্ডে ডেট ফিল্টারিং (মাস/বছর অনুযায়ী)
        let filteredWeeklies = wData;
        let filteredMiscs = mData;

        if (type === "monthly" && month && year) {
          filteredWeeklies = wData.filter((w: any) => {
            const d = new Date(w.date);
            return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
          });
          filteredMiscs = mData.filter((m: any) => {
            const d = new Date(m.date);
            return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
          });
        } else if (type === "yearly" && year) {
          filteredWeeklies = wData.filter((w: any) => new Date(w.date).getFullYear() === Number(year));
          filteredMiscs = mData.filter((m: any) => new Date(m.date).getFullYear() === Number(year));
        } else if (type === "weekly") {
          // গত ৭ দিনের ডেটা
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          filteredWeeklies = wData.filter((w: any) => new Date(w.date) >= lastWeek);
          filteredMiscs = mData.filter((m: any) => new Date(m.date) >= lastWeek);
        }

        setWeeklies(filteredWeeklies);
        setMiscs(filteredMiscs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type, month, year]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";
  const totalWeekly = weeklies.reduce((sum, w) => sum + w.amount, 0);
  const totalMisc = miscs.reduce((sum, m) => sum + m.amount, 0);
  const grandTotal = totalWeekly + totalMisc;

  // রিপোর্টের টাইটেল
  let reportTitle = "সর্বকালীন সামগ্রিক রিপোর্ট";
  if (type === "monthly") reportTitle = `মাসিক রিপোর্ট (${month}/${year})`;
  if (type === "yearly") reportTitle = `বাৎসরিক রিপোর্ট (${year})`;
  if (type === "weekly") reportTitle = "সাপ্তাহিক রিপোর্ট (গত ৭ দিন)";

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      {/* প্রিন্ট কন্ট্রোল বার */}
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center px-4 print:hidden">
        <p className="text-sm text-gray-500">প্রিন্ট প্রিভিউ</p>
        <Button onClick={() => window.print()} className="bg-primary text-white">
          <Printer className="mr-2 h-4 w-4" /> প্রিন্ট / সেভ পিডিএফ
        </Button>
      </div>

      {/* A4 কাগজ */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-10 shadow-lg print:shadow-none print:p-8 print:m-0">
        
        {/* হেডার */}
        <div className="text-center border-b-2 border-primary pb-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">ভায়াবহ উত্তরপাড়া জামে মসজিদ</h1>
          <p className="text-gray-600">ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।</p>
          <h2 className="text-xl font-semibold text-accent mt-4 inline-block px-4 py-1 bg-primary/5 rounded-full">
            {reportTitle}
          </h2>
        </div>

        <div className="text-right mb-6">
          <p className="text-sm text-gray-600"><strong>প্রিন্টের তারিখ:</strong> {new Date().toLocaleDateString("bn-BD")}</p>
        </div>

        {/* সাপ্তাহিক আদায় টেবিল */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-primary mb-3 border-b pb-2">সাপ্তাহিক আদায়</h3>
          {weeklies.length === 0 ? (
            <p className="text-gray-500 italic text-sm">এই সময়ে কোনো সাপ্তাহিক আদায় নেই।</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border border-gray-300 p-2 text-left">ক্রমিক</th>
                  <th className="border border-gray-300 p-2 text-left">তারিখ</th>
                  <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                {weeklies.map((w, index) => (
                  <tr key={w._id}>
                    <td className="p-2 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{new Date(w.date).toLocaleDateString("bn-BD")}</td>
                    <td className="p-2 border border-gray-300 text-right">{formatTk(w.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={2} className="p-2 border border-gray-300 text-right">সাপ্তাহিক মোট:</td>
                  <td className="p-2 border border-gray-300 text-right text-green-700">{formatTk(totalWeekly)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* বিবিধ দান টেবিল */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-primary mb-3 border-b pb-2">বিবিধ দান</h3>
          {miscs.length === 0 ? (
            <p className="text-gray-500 italic text-sm">এই সময়ে কোনো বিবিধ দান নেই।</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border border-gray-300 p-2 text-left">ক্রমিক</th>
                  <th className="border border-gray-300 p-2 text-left">তারিখ</th>
                  <th className="border border-gray-300 p-2 text-left">দাতা</th>
                  <th className="border border-gray-300 p-2 text-left">উদ্দেশ্য</th>
                  <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                {miscs.map((m, index) => (
                  <tr key={m._id}>
                    <td className="p-2 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{new Date(m.date).toLocaleDateString("bn-BD")}</td>
                    <td className="p-2 border border-gray-300 font-medium">{m.donorName}</td>
                    <td className="p-2 border border-gray-300">{m.purpose}</td>
                    <td className="p-2 border border-gray-300 text-right">{formatTk(m.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={4} className="p-2 border border-gray-300 text-right">বিবিধ দান মোট:</td>
                  <td className="p-2 border border-gray-300 text-right text-green-700">{formatTk(totalMisc)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* সর্বমোট */}
        <div className="border-t-2 border-primary pt-4 mt-8 flex justify-end">
          <div className="text-xl font-bold text-primary">
            সর্বমোট আদায়: <span className="text-green-700">{formatTk(grandTotal)}</span>
          </div>
        </div>

        {/* ফুটার */}
        <div className="mt-24 flex justify-between px-10">
          <div className="text-center">
            <div className="border-t border-gray-400 w-40 mb-1"></div>
            <p className="text-sm font-medium text-gray-600">কোষাধ্যক্ষের স্বাক্ষর</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 w-40 mb-1"></div>
            <p className="text-sm font-medium text-gray-600">সভাপতির স্বাক্ষর</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Next.js-এ useSearchParams ব্যবহারের সময় Suspense লাগে
export default function PrintCombinedReportPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CombinedReportContent />
    </Suspense>
  );
}