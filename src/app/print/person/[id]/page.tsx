"use client";

import { useEffect, useState, use, Suspense } from "react"; // Suspense যুক্ত করা হলো
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

// মেইন কন্টেন্ট আলাদা কম্পোনেন্টে নেওয়া হলো
function PrintPersonContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const personId = resolvedParams.id;

  const [person, setPerson] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const personData = await fetchWithAuth(`/api/persons/${personId}`);
        setPerson(personData);

        const contribData = await fetchWithAuth(`/api/contributions/person/${personId}`);
        setContributions(contribData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [personId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!person) return <div className="text-center p-10">ব্যক্তি পাওয়া যায়নি।</div>;

  const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";
  
  const totalAssigned = person.funds?.reduce((acc: number, f: any) => acc + f.assignedAmount, 0) || 0;
  const totalPaid = contributions.reduce((acc: number, c: any) => acc + c.amount, 0);
  const totalDue = totalAssigned - totalPaid;

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center px-4 print:hidden">
        <p className="text-sm text-gray-500">প্রিন্ট প্রিভিউ</p>
        <Button onClick={() => window.print()} className="bg-primary text-white">
          <Printer className="mr-2 h-4 w-4" /> প্রিন্ট / সেভ পিডিএফ
        </Button>
      </div>

      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-10 shadow-lg print:shadow-none print:p-8 print:m-0">
        <div className="text-center border-b-2 border-primary pb-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">ভায়াবহ উত্তরপাড়া জামে মসজিদ</h1>
          <p className="text-gray-600">ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।</p>
          <h2 className="text-xl font-semibold text-accent mt-4 inline-block px-4 py-1 bg-primary/5 rounded-full">
            ব্যক্তিগত হিসাব বিবরণী
          </h2>
        </div>

        <div className="flex justify-between items-start mb-8 text-gray-800">
          <div>
            <p className="text-lg"><strong>নাম:</strong> {person.name}</p>
            <p><strong>মোবাইল:</strong> {person.phone}</p>
          </div>
          <div className="text-right">
            <p><strong>প্রিন্টের তারিখ:</strong> {new Date().toLocaleDateString("bn-BD")}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-8 text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border border-gray-300 p-3 text-left">ফান্ডের নাম</th>
              <th className="border border-gray-300 p-3 text-right">নির্ধারিত (৳)</th>
              <th className="border border-gray-300 p-3 text-right">আদায়কৃত (৳)</th>
              <th className="border border-gray-300 p-3 text-right">বাকি (৳)</th>
            </tr>
          </thead>
          <tbody>
            {person.funds?.map((fund: any) => {
              const fundPaid = contributions
                .filter((c) => c.fundTypeId === fund.fundTypeId)
                .reduce((sum, c) => sum + c.amount, 0);
              const fundDue = fund.assignedAmount - fundPaid;

              return (
                <tr key={fund._id} className="border-b border-gray-200">
                  <td className="p-3 border border-gray-300 font-medium">{fund.fundType?.name || "ফান্ড"}</td>
                  <td className="p-3 border border-gray-300 text-right">{formatTk(fund.assignedAmount)}</td>
                  <td className="p-3 border border-gray-300 text-right text-green-600">{formatTk(fundPaid)}</td>
                  <td className="p-3 border border-gray-300 text-right text-red-600 font-bold">{formatTk(fundDue)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="p-3 border border-gray-300 text-right">সর্বমোট:</td>
              <td className="p-3 border border-gray-300 text-right">{formatTk(totalAssigned)}</td>
              <td className="p-3 border border-gray-300 text-right text-green-700">{formatTk(totalPaid)}</td>
              <td className="p-3 border border-gray-300 text-right text-red-700">{formatTk(totalDue)}</td>
            </tr>
          </tfoot>
        </table>

        <div>
          <h3 className="text-lg font-bold text-primary mb-3 border-b pb-2">আদায়ের বিস্তারিত ইতিহাস</h3>
          {contributions.length === 0 ? (
            <p className="text-gray-500 italic text-sm">এখনো কোনো টাকা জমা হয়নি।</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">ক্রমিক</th>
                  <th className="border border-gray-300 p-2 text-left">তারিখ</th>
                  <th className="border border-gray-300 p-2 text-left">রসিদ নং</th>
                  <th className="border border-gray-300 p-2 text-left">খাত</th>
                  <th className="border border-gray-300 p-2 text-right">পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, index) => (
                  <tr key={c._id} className="border-b border-gray-200">
                    <td className="p-2 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{new Date(c.date).toLocaleDateString("bn-BD")}</td>
                    <td className="p-2 border border-gray-300">{c.receiptNo}</td>
                    <td className="p-2 border border-gray-300">{person.funds?.find((f:any) => f.fundTypeId === c.fundTypeId)?.fundType?.name || "ফান্ড"}</td>
                    <td className="p-2 border border-gray-300 text-right font-medium">{formatTk(c.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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

// মেইন পেজ যেটা Suspense দিয়ে র‍্যাপ করা হলো
export default function PrintPersonReportPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <PrintPersonContent params={params} />
    </Suspense>
  );
}