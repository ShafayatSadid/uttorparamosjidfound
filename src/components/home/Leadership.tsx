import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dummyMembers, MemberCategory } from "@/data/members";
import MemberCard from "../shared/MemberCard";

// ক্যাটাগরি অনুযায়ী টাইটেল
const categoryTitles: Record<MemberCategory, string> = {
    advisory: "উপদেষ্টা মণ্ডলী",
    committee: "কার্যনির্বাহী কমিটি",
    member: "সাধারণ সদস্য",
};

export function Leadership() {
    // ক্যাটাগরি অনুযায়ী ডেটা গ্রুপ করা
    const groupedMembers = {
        advisory: dummyMembers.filter((m) => m.category === "advisory"),
        committee: dummyMembers.filter((m) => m.category === "committee"),
        member: dummyMembers.filter((m) => m.category === "member"),
    };

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
                    {(Object.keys(groupedMembers) as MemberCategory[]).map((category) => (
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

                                {groupedMembers[category].slice(0, 3).map((member) => (

                                    // <Card
                                    //     key={member.id}
                                    //     className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-2xl"
                                    // >
                                    //     {/* পুরো কার্ড জুড়ে ছবি */}
                                    //     <div className="relative aspect-[4/5] w-full overflow-hidden">
                                    //         <Image
                                    //             src="/images/furkan.jpeg"
                                    //             alt={member.name}
                                    //             fill
                                    //             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    //             className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    //         />

                                    //         {/* নিচের দিকে গাঢ় গ্র্যাডিয়েন্ট */}
                                    //         <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />

                                    //         {/* টেক্সট ওভারলে */}
                                    //         <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col gap-1.5">

                                    //             {/* নাম ও পদবী */}
                                    //             <div>
                                    //                 <h4 className="text-xl font-bold drop-shadow-sm tracking-wide leading-tight">
                                    //                     {member.name}
                                    //                 </h4>
                                    //                 <p className="text-sm font-semibold text-accent">
                                    //                     {member.designation}
                                    //                 </p>
                                    //             </div>

                                    //             {/* সূক্ষ্ম ডিভাইডার */}
                                    //             <div className="w-12 h-[2px] bg-accent/70 my-1 rounded-full" />

                                    //             {/* পেশা ও ফোন */}
                                    //             <div className="flex flex-col gap-1 text-xs sm:text-sm text-white/90">
                                    //                 <div className="flex items-center gap-2">
                                    //                     <Briefcase className="h-3.5 w-3.5 text-accent" />
                                    //                     <span>{member.profession}</span>
                                    //                 </div>
                                    //                 <a
                                    //                     href={`tel:${member.phone}`}
                                    //                     className="flex items-center gap-2 hover:text-accent transition-colors w-fit"
                                    //                 >
                                    //                     <Phone className="h-3.5 w-3.5 text-accent" />
                                    //                     <span>{member.phone}</span>
                                    //                 </a>
                                    //             </div>

                                    //         </div>
                                    //     </div>
                                    // </Card>
                                    <MemberCard member={member} key={member.id} />
                                ))}
                            </div>
                        </div>
                    ))}
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