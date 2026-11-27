"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Loader2, Trash2, Receipt } from "lucide-react";

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ফর্ম স্টেট
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    fetchExpenses();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchWithAuth("/api/expenses", {
        method: "POST",
        body: JSON.stringify({ date, description, amount: Number(amount) }),
      });
      setIsDialogOpen(false);
      setDescription("");
      setAmount("");
      fetchExpenses();
    } catch (error: any) {
      alert(error.message || "সেভ করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/api/expenses/${id}`, { method: "DELETE" });
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const formatTk = (amount: number) => new Intl.NumberFormat("bn-BD").format(amount) + " ৳";
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">খরচের হিসাব</h1>
          <p className="text-muted-foreground text-sm mt-1">মসজিদের যাবতীয় খরচের বিবরণ।</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-white" />}>
            <Plus className="mr-2 h-4 w-4" /> নতুন খরচ
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>নতুন খরচ যোগ করুন</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>তারিখ</Label>
                <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>কী বাবদ খরচ</Label>
                <Input required placeholder="যেমন: কারেন্ট বিল" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>পরিমাণ (৳)</Label>
                <Input type="number" required placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white mt-4">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "সেভ করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-primary text-white border-none shadow-md max-w-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">সর্বমোট খরচ</p>
            <h3 className="text-3xl font-bold text-accent">{formatTk(totalExpense)}</h3>
          </div>
          <div className="p-3 bg-white/10 rounded-full">
            <Receipt className="h-8 w-8 text-accent" />
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
                  <TableHead>বিবরণ</TableHead>
                  <TableHead className="text-right">পরিমাণ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">কোনো খরচ যোগ করা হয়নি।</TableCell>
                  </TableRow>
                ) : (
                  expenses.map((e) => (
                    <TableRow key={e._id}>
                      <TableCell className="font-medium text-primary whitespace-nowrap">
                        {new Date(e.date).toLocaleDateString("bn-BD")}
                      </TableCell>
                      <TableCell>{e.description}</TableCell>
                      <TableCell className="text-right font-semibold text-red-500">
                        {formatTk(e.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger render={<Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>} />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                              <AlertDialogDescription>এই খরচের রেকর্ডটি ডিলিট হয়ে যাবে।</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(e._id)} className="bg-destructive text-white">ডিলিট করুন</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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