"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberCard from "../shared/MemberCard";
import { fetchPublic } from "@/lib/api";

interface MemberData {
    _id: string;
    name: string;
    designation: string;
    profession: string;
    phone: string;
    category: "advisory" | "committee" | "member";
    imageUrl: string;
    isFeatured: boolean;
}

const categoryTitles: Record<string, string> = {
    advisory: "উপদেষ্টা মণ্ডলী",
    committee: "কার্যনির্বাহী কমিটি",
    member: "সাধারণ সদস্য",
};

export function Leadership() {
    const [members, setMembers] = useState<MemberData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembers() {
            try {
                // সরাসরি fetch এর বদলে fetchPublic ব্যবহার করুন
                const data = await fetchPublic("/api/members");
                setMembers(data);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMembers();
    }, []);

    // ১. শুধুমাত্র "isFeatured" (হোমপেজে দেখান) সিলেক্ট করা মেম্বারদের ফিল্টার করা
    // ২. প্রতিটি ক্যাটাগরি থেকে সর্বোচ্চ ৩ জনকে নেওয়া (slice(0, 3))
    const featuredMembers = members.filter((m) => m.isFeatured);

    const groupedMembers = {
        advisory: featuredMembers.filter((m) => m.category === "advisory").slice(0, 3),
        committee: featuredMembers.filter((m) => m.category === "committee").slice(0, 3),
        member: featuredMembers.filter((m) => m.category === "member").slice(0, 3),
    };

    if (loading) {
        return (
            <section className="py-20 bg-slate-50 relative flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </section>
        );
    }

    return (
        <section className="py-20 bg-slate-50 relative">
            <div className="container mx-auto px-4 md:px-6">

                {/* সেকশন হেডার */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        আমাদের নেতৃত্ব
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        মসজিদের দ্বীনি খেদমতে নিয়োজিত সম্মানিত কমিটি, উপদেষ্টা ও সদস্যবৃন্দ।
                    </p>
                </div>

                {/* ক্যাটাগরি অনুযায়ী সেকশন রেন্ডার */}
                <div className="space-y-16 max-w-7xl mx-auto">
                    {(Object.keys(groupedMembers) as Array<keyof typeof groupedMembers>).map((category) => {

                        // যদি কোনো ক্যাটাগরিতে হোমপেজের জন্য কোনো মেম্বার সিলেক্ট করা না থাকে, তবে ওই সেকশনটি হাইড হয়ে যাবে
                        if (groupedMembers[category].length === 0) return null;

                        return (
                            <div key={category}>
                                {/* ক্যাটাগরি টাইটেল */}
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-2xl font-bold text-primary">
                                        {categoryTitles[category]}
                                    </h3>
                                    <div className="h-px bg-accent/30 flex-1"></div>
                                </div>

                                {/* কার্ড গ্রিড */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupedMembers[category].map((member) => (
                                        // ব্যাকএন্ডের _id কে id হিসেবে পাস করা হচ্ছে MemberCard এর জন্য
                                        <MemberCard key={member._id} member={{ ...member, id: member._id } as any} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* সম্পূর্ণ তালিকা দেখার বাটন */}
                <div className="mt-16 text-center">
                    <Link href="/about">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-white px-8 h-12 rounded-full"
                        >
                            সম্পূর্ণ কমিটি দেখুন
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}