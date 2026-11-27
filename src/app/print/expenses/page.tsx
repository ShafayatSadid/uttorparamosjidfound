"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintExpensePage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const data = await fetchWithAuth("/api/expenses");
        setExpenses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

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
            খরচের হিসাব বিবরণী
          </h2>
        </div>

        <div className="text-right mb-4">
          <p className="text-sm text-gray-600"><strong>প্রিন্টের তারিখ:</strong> {new Date().toLocaleDateString("bn-BD")}</p>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border border-gray-300 p-2 text-center w-12">ক্রম</th>
              <th className="border border-gray-300 p-2 text-left">তারিখ</th>
              <th className="border border-gray-300 p-2 text-left">বিবরণ</th>
              <th className="border border-gray-300 p-2 text-right">পরিমাণ (৳)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, index) => (
              <tr key={e._id} className="border-b border-gray-200">
                <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                <td className="p-2 border border-gray-300">{new Date(e.date).toLocaleDateString("bn-BD")}</td>
                <td className="p-2 border border-gray-300 font-medium">{e.description}</td>
                <td className="p-2 border border-gray-300 text-right text-red-600 font-bold">{formatTk(e.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={3} className="p-3 border border-gray-300 text-right">সর্বমোট খরচ:</td>
              <td className="p-3 border border-gray-300 text-right text-red-700">{formatTk(totalExpense)}</td>
            </tr>
          </tfoot>
        </table>

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