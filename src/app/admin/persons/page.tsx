"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Phone, Search, Receipt, Calendar } from "lucide-react";

// ✅ ১. প্রপার টাইপ ডিফাইন করা হলো
interface FundType {
  _id: string;
  name: string;
}

interface PersonFund {
  _id: string;
  fundTypeId: string;
  assignedAmount: number;
}

interface Person {
  _id: string;
  name: string;
  phone: string;
  funds?: PersonFund[];
  fundTypeDetails?: FundType[];
  totalAssigned?: number;
  totalPaid?: number;
  totalDue?: number;
}

interface Contribution {
  _id: string;
  fundTypeId: string;
  amount: number;
  date: string;
  receiptNo: string;
}

export default function AdminPersonsPage() {
  // স্টেটসমূহ (any বাদ দিয়ে সঠিক ইন্টারফেস ব্যবহার)
  const [persons, setPersons] = useState<Person[]>([]);
  const [fundTypes, setFundTypes] = useState<FundType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // নতুন ব্যক্তি মডাল স্টেট
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fundAmounts, setFundAmounts] = useState<Record<string, number>>({});

  // বিস্তারিত মডাল স্টেট (Contributions)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(false);

  // টাকা জমা ফর্ম স্টেট
  const [payFundType, setPayFundType] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payReceipt, setPayReceipt] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [personsData, fundTypesData] = await Promise.all([
        fetchWithAuth("/api/persons"),
        fetchWithAuth("/api/fund-types"),
      ]);
      setPersons(personsData);
      setFundTypes(fundTypesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // --- নতুন ব্যক্তি যোগ ---
  const handleOpenDialog = () => {
    setName("");
    setPhone("");
    setFundAmounts({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fundsData = Object.keys(fundAmounts)
        .filter((id) => fundAmounts[id] > 0)
        .map((id) => ({ fundTypeId: id, assignedAmount: fundAmounts[id] }));

      await fetchWithAuth("/api/persons", {
        method: "POST",
        body: JSON.stringify({ name, phone, funds: fundsData }),
      });
      setIsDialogOpen(false);
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "সেভ করতে সমস্যা হয়েছে";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- বিস্তারিত দেখা ও টাকা জমা ---
  const handleOpenDetails = async (person: Person) => {
    setSelectedPerson(person);
    setIsDetailsOpen(true);
    setPayFundType("");
    setPayAmount("");
    setPayReceipt("");
    setPayDate(new Date().toISOString().split("T")[0]);
    fetchContributions(person._id);
  };

  const fetchContributions = async (personId: string) => {
    setLoadingContributions(true);
    try {
      const data = await fetchWithAuth(`/api/contributions/person/${personId}`);
      setContributions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingContributions(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payFundType || !payAmount || !payReceipt) {
      alert("সবগুলো ঘর পূরণ করুন");
      return;
    }
    setIsPaying(true);
    try {
      await fetchWithAuth("/api/contributions", {
        method: "POST",
        body: JSON.stringify({
          personId: selectedPerson?._id, // ✅ null সেফটি
          fundTypeId: payFundType,
          amount: Number(payAmount),
          date: payDate,
          receiptNo: payReceipt,
        }),
      });
      // সফলভাবে জমা হলে
      setPayAmount("");
      setPayReceipt("");
      if (selectedPerson) fetchContributions(selectedPerson._id); // ✅ null সেফটি
      fetchData(); // মেইন টেবিলের সামারি রিফ্রেশ
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "টাকা জমা দিতে সমস্যা হয়েছে";
      alert(message);
    } finally {
      setIsPaying(false);
    }
  };

  const handleDeleteContribution = async (id: string) => {
    if (!confirm("এই জমার রেকর্ডটি ডিলিট করতে চান?")) return;
    try {
      await fetchWithAuth(`/api/contributions/${id}`, { method: "DELETE" });
      if (selectedPerson) fetchContributions(selectedPerson._id); // ✅ null সেফটি
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";
  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* হেডার এবং নতুন ব্যক্তি বাটন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">ব্যক্তিভিত্তিক হিসাব</h1>
          <p className="text-muted-foreground text-sm mt-1">দাতা ও এলাকাবাসীর তালিকা এবং তাদের নির্ধারিত চাঁদা।</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button onClick={handleOpenDialog} className="bg-primary text-white" />}>
            <Plus className="mr-2 h-4 w-4" /> নতুন ব্যক্তি
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>নতুন ব্যক্তি যোগ করুন</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>নাম</Label>
                <Input required placeholder="ব্যক্তির নাম" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>মোবাইল নাম্বার</Label>
                <Input required placeholder="০১৭XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="border-t pt-4 mt-4">
                <Label className="text-base font-semibold mb-3 block">নির্ধারিত চাঁদা (ঐচ্ছিক)</Label>
                <div className="space-y-3">
                  {fundTypes.map((ft) => (
                    <div key={ft._id} className="flex items-center justify-between gap-4">
                      <Label className="flex-1">{ft.name}</Label>
                      <div className="relative w-32">
                        <Input
                          type="number"
                          placeholder="0"
                          className="text-right pr-8"
                          value={fundAmounts[ft._id] || ""}
                          onChange={(e) => setFundAmounts({ ...fundAmounts, [ft._id]: Number(e.target.value) })}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">৳</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white mt-4">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "সেভ করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* সার্চ বার */}
      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white"
        />
      </div>

      {/* মেইন টেবিল */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/50">
                  <TableRow>
                    <TableHead>নাম ও মোবাইল</TableHead>
                    <TableHead>নির্ধারিত ফান্ডসমূহ</TableHead>
                    <TableHead className="text-right">মোট নির্ধারিত</TableHead>
                    <TableHead className="text-right text-green-600">আদায়কৃত</TableHead>
                    <TableHead className="text-right text-red-500">বাকি</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">কোনো ব্যক্তি পাওয়া যায়নি।</TableCell>
                    </TableRow>
                  ) : (
                    filteredPersons.map((person) => (
                      <TableRow key={person._id}>
                        <TableCell>
                          <div className="font-semibold text-primary">{person.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" /> {person.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {person.funds?.map((f) => {
                              const fundName = person.fundTypeDetails?.find((ft) => ft._id === f.fundTypeId)?.name || "ফান্ড";
                              return (
                                <span key={f._id} className="text-xs bg-secondary px-2 py-1 rounded-md text-primary">
                                  {fundName}: {formatTk(f.assignedAmount)}
                                </span>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatTk(person.totalAssigned || 0)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">{formatTk(person.totalPaid || 0)}</TableCell>
                        <TableCell className="text-right font-bold text-red-500">{formatTk(person.totalDue || 0)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            onClick={() => handleOpenDetails(person)}
                            variant="outline" 
                            size="sm" 
                            className="border-accent text-primary hover:bg-accent hover:text-white"
                          >
                            বিস্তারিত
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

      {/* ================= বিস্তারিত ও টাকা জমা মডাল ================= */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">{selectedPerson?.name} এর হিসাব</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedPerson?.phone}</p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* বাম দিক: ফান্ড সামারি ও টাকা জমার ফর্ম */}
            <div className="space-y-6">
              {/* ফান্ড সামারি */}
              <div className="space-y-3 bg-secondary/30 p-4 rounded-lg border">
                <h3 className="font-bold text-primary mb-2">ফান্ডের অবস্থা</h3>
                {selectedPerson?.funds?.map((f) => {
                  const fundName = selectedPerson.fundTypeDetails?.find((ft) => ft._id === f.fundTypeId)?.name || "ফান্ড";
                  const fundPaid = contributions.filter(c => c.fundTypeId === f.fundTypeId).reduce((sum, c) => sum + c.amount, 0);
                  const fundDue = f.assignedAmount - fundPaid;
                  
                  return (
                    <div key={f._id} className="text-sm border-b pb-2 last:border-0">
                      <div className="font-semibold text-primary">{fundName}</div>
                      <div className="flex justify-between text-muted-foreground mt-1">
                        <span>নির্ধারিত: {formatTk(f.assignedAmount)}</span>
                        <span>বাকি: <strong className="text-red-500">{formatTk(fundDue)}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* টাকা জমার ফর্ম */}
              <form onSubmit={handleAddPayment} className="space-y-3 border-t pt-4">
                <h3 className="font-bold text-primary">নতুন টাকা জমা</h3>
                <div className="space-y-2">
                  <Label>কোন ফান্ডে?</Label>
                  <Select value={payFundType} onValueChange={setPayFundType} required>
                    <SelectTrigger><SelectValue placeholder="ফান্ড সিলেক্ট করুন" /></SelectTrigger>
                    <SelectContent>
                      {selectedPerson?.funds?.map((f) => {
                        const fundName = selectedPerson.fundTypeDetails?.find((ft) => ft._id === f.fundTypeId)?.name || "ফান্ড";
                        return <SelectItem key={f.fundTypeId} value={f.fundTypeId}>{fundName}</SelectItem>
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>টাকার পরিমাণ</Label>
                    <Input type="number" required placeholder="0" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>রসিদ নং</Label>
                    <Input required placeholder="R-101" value={payReceipt} onChange={(e) => setPayReceipt(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>তারিখ</Label>
                  <Input type="date" required value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                </div>
                <Button type="submit" disabled={isPaying} className="w-full bg-primary text-white">
                  {isPaying ? <Loader2 className="animate-spin h-4 w-4" /> : "জমা করুন"}
                </Button>
              </form>
            </div>

            {/* ডান দিক: জমার ইতিহাস */}
            <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 space-y-3">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <Receipt className="h-4 w-4" /> জমার ইতিহাস
              </h3>
              {loadingContributions ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin h-5 w-5 text-primary" /></div>
              ) : contributions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">এখনো কোনো টাকা জমা হয়নি।</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {contributions.map((c) => {
                    const fundName = selectedPerson?.fundTypeDetails?.find((ft) => ft._id === c.fundTypeId)?.name || "ফান্ড";
                    return (
                      <div key={c._id} className="p-3 border rounded-lg bg-white shadow-sm flex justify-between items-start group">
                        <div>
                          <p className="font-bold text-green-600">{formatTk(c.amount)}</p>
                          <p className="text-xs text-primary font-medium">{fundName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" /> {new Date(c.date).toLocaleDateString("bn-BD")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">রসিদ: {c.receiptNo}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteContribution(c._id)}
                        >
                          &times;
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}