"use client";

import { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const categories = [
    { value: "advisory", label: "উপদেষ্টা" },
    { value: "committee", label: "কমিটি" },
    { value: "member", label: "সদস্য" },
];

interface Member {
  _id?: string;
  name?: string;
  designation?: string; 
  profession?: string;  
  phone?: string;       
  category?: 'advisory' | 'committee' | 'member';
  imageUrl?: string;    
  imagePublicId?: string; 
  isFeatured?: boolean; 
  createdAt?: Date;
}

export default function AdminMembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // ✅ ১. null অ্যালাউ করার জন্য Union Type ব্যবহার
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ফর্ম স্টেট
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        profession: "",
        phone: "",
        category: "committee" as 'advisory' | 'committee' | 'member', // ✅ ২. টাইপ ঠিক করা হলো
        isFeatured: false,
        imageUrl: "",
        imagePublicId: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        try {
            const data = await fetchWithAuth("/api/members");
            setMembers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // ছবি সিলেক্ট করার সময় ২ মেগাবাইট চেক
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("ছবির সাইজ ২ মেগাবাইটের কম হতে হবে!");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    // ✅ ৩. any বাদ দিয়ে Member | null ব্যবহার
    const handleOpenDialog = (member: Member | null = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name || "",
                designation: member.designation || "",
                profession: member.profession || "",
                phone: member.phone || "",
                category: member.category || "committee",
                isFeatured: member.isFeatured || false,
                imageUrl: member.imageUrl || "",
                imagePublicId: member.imagePublicId || "",
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: "", designation: "", profession: "", phone: "",
                category: "committee", isFeatured: false, imageUrl: "", imagePublicId: "",
            });
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalImageUrl = formData.imageUrl;
            let finalPublicId = formData.imagePublicId;

            // ১. নতুন ছবি সিলেক্ট করা হলে Cloudinary-তে আপলোড
            if (selectedFile) {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

                const imageFormData = new FormData();
                imageFormData.append("file", selectedFile);
                imageFormData.append("upload_preset", uploadPreset as string);

                const cloudinaryRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: "POST", body: imageFormData }
                );
                const cloudinaryData = await cloudinaryRes.json();

                if (cloudinaryData.secure_url) {
                    finalImageUrl = cloudinaryData.secure_url;
                    finalPublicId = cloudinaryData.public_id;
                } else {
                    throw new Error("Cloudinary আপলোড ব্যর্থ হয়েছে");
                }
            }

            // ২. ব্যাকএন্ডে ডেটা পাঠানো
            const payload = {
                ...formData,
                imageUrl: finalImageUrl,
                imagePublicId: finalPublicId,
            };

            if (editingMember) {
                // আপডেট
                await fetchWithAuth(`/api/members/${editingMember._id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                // নতুন অ্যাড
                await fetchWithAuth("/api/members", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            setIsDialogOpen(false);
            fetchMembers(); // লিস্ট রিফ্রেশ
        } catch (error: unknown) { // ✅ ৪. any বাদ
            console.error(error);
            const message = error instanceof Error ? error.message : "সেভ করতে সমস্যা হয়েছে";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return; // ✅ ৫. undefined চেক
        if (!confirm("আপনি কি নিশ্চিতভাবে এই মেম্বারকে ডিলিট করতে চান?")) return;
        try {
            await fetchWithAuth(`/api/members/${id}`, { method: "DELETE" });
            fetchMembers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">মেম্বার ম্যানেজমেন্ট</h1>
                    <p className="text-muted-foreground text-sm mt-1">কমিটি, উপদেষ্টা ও সদস্য অ্যাড করুন।</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger render={<Button onClick={() => handleOpenDialog()} className="bg-primary text-white" />}>
                        <Plus className="mr-2 h-4 w-4" /> নতুন মেম্বার
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingMember ? "মেম্বার এডিট করুন" : "নতুন মেম্বার যোগ করুন"}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>ছবি (সর্বোচ্চ ২MB)</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full border border-border overflow-hidden bg-secondary relative flex items-center justify-center">
                                        {selectedFile ? (
                                            <Image src={URL.createObjectURL(selectedFile)} alt="Preview" fill className="object-cover" />
                                        ) : formData.imageUrl ? (
                                            <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>নাম</Label>
                                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>পদবী</Label>
                                    <Input required value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>পেশা</Label>
                                    <Input value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>মোবাইল নাম্বার</Label>
                                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>ক্যাটাগরি</Label>
                                {/* ✅ ৬. Select এর onValueChange এ সঠিক টাইপ */}
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as 'advisory' | 'committee' | 'member' })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="সিলেক্ট করুন" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">হোমপেজে দেখান</Label>
                                    <p className="text-xs text-muted-foreground">হোমপেজের &quot;নেতৃত্ব&quot; সেকশনে দেখানো হবে।</p>
                                </div>
                                <Switch checked={formData.isFeatured} onCheckedChange={(val) => setFormData({ ...formData, isFeatured: val })} />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white">
                                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "সেভ করুন"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-primary/10 shadow-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-secondary/50">
                                <TableRow>
                                    <TableHead>ছবি ও নাম</TableHead>
                                    <TableHead>পদবী</TableHead>
                                    <TableHead>ক্যাটাগরি</TableHead>
                                    <TableHead>হোমপেজে</TableHead>
                                    <TableHead className="text-right">অ্যাকশন</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((m) => (
                                    <TableRow key={m._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden relative bg-secondary border">
                                                    {m.imageUrl ? <Image src={m.imageUrl} alt={m.name || "Member"} fill className="object-cover" /> : <ImageIcon className="h-5 w-5 m-auto text-muted-foreground mt-2.5" />}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-primary">{m.name}</div>
                                                    <div className="text-xs text-muted-foreground">{m.phone}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{m.designation}</TableCell>
                                        <TableCell>
                                            {m.category === "advisory" ? "উপদেষ্টা" : m.category === "committee" ? "কমিটি" : "সদস্য"}
                                        </TableCell>
                                        <TableCell>
                                            <Switch checked={m.isFeatured} disabled />
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => handleOpenDialog(m)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {/* ✅ handleDelete(m._id) এখন সেফ */}
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(m._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}