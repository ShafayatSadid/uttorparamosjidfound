"use client";

import { useEffect, useState, use, Suspense } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

function FundReportContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const fundTypeId = resolvedParams.id;

  const [persons, setPersons] = useState<any[]>([]);
  const [fundName, setFundName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ১. ফান্ডের নাম বের করার জন্য ফান্ড টাইপস আনা
        const fundTypes = await fetchWithAuth("/api/fund-types");
        const currentFund = fundTypes.find((f: any) => f._id === fundTypeId);
        if (currentFund) setFundName(currentFund.name);

        // ২. সবার ডেটা আনা (যাদের এই ফান্ড আছে শুধু তাদের ফিল্টার করা হবে)
        const personsData = await fetchWithAuth("/api/persons");
        setPersons(personsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fundTypeId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";

  // শুধু যে সমস্ত ব্যক্তির এই নির্দিষ্ট ফান্ডটি (fundTypeId) আছে তাদের ফিল্টার করা
  const filteredPersons = persons.filter((p) => 
    p.funds?.some((f: any) => f.fundTypeId === fundTypeId)
  );

  // সামারি ক্যালকুলেশন
  let totalAssigned = 0;
  let totalPaid = 0;

  const reportData = filteredPersons.map((person, index) => {
    const fund = person.funds?.find((f: any) => f.fundTypeId === fundTypeId);
    const assignedAmount = fund ? fund.assignedAmount : 0;
    
    // এই নির্দিষ্ট ফান্ডে কত টাকা জমা পড়েছে
    const paidAmount = person.contributions
      ?.filter((c: any) => c.fundTypeId === fundTypeId)
      .reduce((sum: number, c: any) => sum + c.amount, 0) || 0;
      
    const dueAmount = assignedAmount - paidAmount;

    totalAssigned += assignedAmount;
    totalPaid += paidAmount;

    return {
      sl: index + 1,
      name: person.name,
      phone: person.phone,
      assigned: assignedAmount,
      paid: paidAmount,
      due: dueAmount,
    };
  });

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
        {/* হেডার */}
        <div className="text-center border-b-2 border-primary pb-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">ভায়াবহ উত্তরপাড়া জামে মসজিদ</h1>
          <p className="text-gray-600">ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।</p>
          <h2 className="text-xl font-semibold text-accent mt-4 inline-block px-4 py-1 bg-primary/5 rounded-full">
            {fundName} - হিসাব বিবরণী
          </h2>
        </div>

        <div className="text-right mb-4">
          <p className="text-sm text-gray-600"><strong>প্রিন্টের তারিখ:</strong> {new Date().toLocaleDateString("bn-BD")}</p>
        </div>

        {/* টেবিল */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border border-gray-300 p-2 text-center w-12">ক্রম</th>
              <th className="border border-gray-300 p-2 text-left">নাম</th>
              <th className="border border-gray-300 p-2 text-left">মোবাইল</th>
              <th className="border border-gray-300 p-2 text-right">নির্ধারিত (৳)</th>
              <th className="border border-gray-300 p-2 text-right">আদায়কৃত (৳)</th>
              <th className="border border-gray-300 p-2 text-right">বাকি (৳)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr key={row.sl} className="border-b border-gray-200">
                <td className="p-2 border border-gray-300 text-center">{row.sl}</td>
                <td className="p-2 border border-gray-300 font-medium">{row.name}</td>
                <td className="p-2 border border-gray-300">{row.phone}</td>
                <td className="p-2 border border-gray-300 text-right">{formatTk(row.assigned)}</td>
                <td className="p-2 border border-gray-300 text-right text-green-600">{formatTk(row.paid)}</td>
                <td className="p-2 border border-gray-300 text-right text-red-600 font-bold">{formatTk(row.due)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={3} className="p-3 border border-gray-300 text-right">সর্বমোট:</td>
              <td className="p-3 border border-gray-300 text-right">{formatTk(totalAssigned)}</td>
              <td className="p-3 border border-gray-300 text-right text-green-700">{formatTk(totalPaid)}</td>
              <td className="p-3 border border-gray-300 text-right text-red-700">{formatTk(totalDue)}</td>
            </tr>
          </tfoot>
        </table>

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

export default function PrintFundReportPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <FundReportContent params={params} />
    </Suspense>
  );
}