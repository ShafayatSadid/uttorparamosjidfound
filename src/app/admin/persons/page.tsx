'use client'
import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import { Calendar, Phone, Receipt } from 'lucide-react';
import { Input } from '@base-ui/react';

interface Person {
    _id: string;
    name: string;
    phone: string;
    funds: { fundTypeId: string; assignedAmount: number }[];
    fundTypeDetails: { _id: string; name: string }[];
    totalAssigned: number;
    totalPaid: number;
    totalDue: number;
}

interface Contribution {
    _id: string;
    fundTypeId: string;
    amount: number;
    date: string;
    receiptNo: string;
}

const DashboardPage = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [filteredPersons, setFilteredPersons] = useState<Person[]>(persons);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [payFundType, setPayFundType] = useState('');
    const [payAmount, setPayAmount] = useState('');
    const [payReceipt, setPayReceipt] = useState('');
    const [payDate, setPayDate] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [loadingContributions, setLoadingContributions] = useState(false);

    const fetchPersons = async () => {
        // Fetch persons data from API
    };

    const fetchContributions = async (personId: string) => {
        // Fetch contributions data for a person from API
    };

    const handleOpenDetails = (person: Person) => {
        setSelectedPerson(person);
        setIsDetailsOpen(true);
    };

    const handleAddPayment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!payFundType || !payAmount || !payReceipt || !payDate) {
            alert("All fields are required");
            return;
        }

        setIsPaying(true);
        try {
            const response = await fetch('/api/contributions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personId: selectedPerson?._id,
                    fundTypeId: payFundType,
                    amount: parseFloat(payAmount),
                    date: payDate,
                    receiptNo: payReceipt,
                }),
            });

            if (response.ok) {
                const contribution: Contribution = await response.json();
                setContributions([...contributions, contribution]);
                setPayFundType('');
                setPayAmount('');
                setPayReceipt('');
                setPayDate('');
            } else {
                alert("Payment failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while adding the payment");
        } finally {
            setIsPaying(false);
        }
    };

    const handleDeleteContribution = async (id: string) => {
        try {
            const response = await fetch(`/api/contributions/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setContributions(contributions.filter(c => c._id !== id));
            } else {
                alert("Failed to delete contribution");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the contribution");
        }
    };

    const filterByDate = (date: string) => {
        const startDate = new Date(date).setHours(0, 0, 0, 0);
        const endDate = new Date(date).setHours(23, 59, 59, 999);
        setFilteredPersons(persons.filter(p => p.totalDue <= 0 && p.totalAssigned > 0));
    };

    const formatTk = (amount: number, options: Intl.NumberFormatOptions = { style: 'currency', currency: 'BDT' }) => {
        return new Intl.NumberFormat('bn-BD', options).format(amount);
    };

    // Fetch data on component mount
    React.useEffect(() => {
        fetchPersons();
    }, []);

    // Fetch contributions when selectedPerson changes
    React.useEffect(() => {
        if (selectedPerson) {
            fetchContributions(selectedPerson._id);
        }
    }, [selectedPerson]);

    return (
        <div className="container mx-auto px-4">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>মাসীক হিসাব</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4" /> নতুন হিসাব
                        </Button>
                        <div className="flex flex-1">
                            <Input
                                placeholder="নাম বা ফোন নং দিন"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyUp={() => filterByDate(searchTerm)}
                                className="flex-1"
                            />
                            <Search className="h-4 w-4 ml-2" />
                        </div>
                    </div>
                    {filteredPersons.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>নাম</TableHead>
                                        <TableHead>ফান্ড</TableHead>
                                        <TableHead>নির্ধারিত টাকা</TableHead>
                                        <TableHead>প্রাপ্ত টাকা</TableHead>
                                        <TableHead>অপরিদ্যুপোন্ন টাকা</TableHead>
                                        <TableHead>অ্যাকশন</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPersons.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">কোনো ব্যক্তি পাওয়া যায়নি।</TableCell>
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
                                                        {person.funds?.map((f: { fundTypeId: string; assignedAmount: number }) => {
                                                            const fundName = person.fundTypeDetails?.find((ft: { _id: string; name: string }) => ft._id === f.fundTypeId)?.name || "ফান্ড";
                                                            return (
                                                                <span key={f.fundTypeId} className="text-xs bg-secondary px-2 py-1 rounded-md text-primary">
                                                                    {fundName}: {formatTk(f.assignedAmount)}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatTk(person.totalAssigned)}</TableCell>
                                                <TableCell>{formatTk(person.totalPaid)}</TableCell>
                                                <TableCell>{formatTk(person.totalDue)}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenDetails(person)}>
                                                        তفাবত দেখুন
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

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>বিস্তারিত</DialogTitle>
                    </DialogHeader>
                    {/* Content for the dialog */}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DashboardPage;