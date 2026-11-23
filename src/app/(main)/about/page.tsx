"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberCard from "@/components/shared/MemberCard";
import { dummyMembers, MemberCategory } from "@/data/members";
import { MapPin, Info } from "lucide-react";

const categoryTitles: Record<MemberCategory, string> = {
  advisory: "উপদেষ্টা মণ্ডলী",
  committee: "কার্যনির্বাহী কমিটি",
  member: "সাধারণ সদস্য",
};

export default function AboutPage() {
  const groupedMembers = {
    advisory: dummyMembers.filter((m) => m.category === "advisory"),
    committee: dummyMembers.filter((m) => m.category === "committee"),
    member: dummyMembers.filter((m) => m.category === "member"),
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* ১. পেজ হেডার (Page Header) */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            আমাদের সম্পর্কে
          </h1>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80 max-w-2xl mx-auto">
            <MapPin className="h-5 w-5 text-accent shrink-0" />
            <p className="text-lg">
              ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।
            </p>
          </div>
        </div>
      </section>

      {/* ২. মসজিদের ইতিহাস ও তথ্য (History & Info) */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6">
            <Info className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            দ্বীনের খেদমতে আমাদের পথচলা
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            আলহামদুলিল্লাহ, ভায়াবহ উত্তরপাড়া জামে মসজিদ দীর্ঘদিন ধরে এলাকাবাসীর দ্বীনি শিক্ষা, পাঁচ ওয়াক্ত নামাজ এবং সামাজিক উন্নয়নে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে। 
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            আমাদের এই ক্ষুদ্র প্রয়াসে মসজিদের যাবতীয় নির্মাণ ফান্ড, বাৎসরিক চাঁদা এবং সাপ্তাহিক আদায়ের স্বচ্ছ হিসাব নিকাশ সবার জন্য উন্মুক্ত করা হয়েছে। এলাকাবাসীর ঐকান্তিক প্রচেষ্টায় এই মসজিদ আজ একটি আদর্শ দ্বীনি প্রতিষ্ঠানে পরিণত হয়েছে।
          </p>
        </div>
      </section>

      {/* ৩. আমাদের নেতৃত্ব (Leadership Tabs) */}
      <section className="py-16 bg-slate-50 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              আমাদের কমিটি
            </h2>
            <p className="text-muted-foreground">
              মসজিদ পরিচালনায় নিয়োজিত সম্মানিত ব্যক্তিবর্গ।
            </p>
          </div>

          <Tabs defaultValue="committee" className="w-full max-w-7xl mx-auto">
            {/* ট্যাব লিস্ট */}
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white border border-primary/10 shadow-sm p-1 h-auto flex-wrap justify-center gap-1 rounded-full">
                <TabsTrigger 
                  value="committee" 
                  className="rounded-full px-6 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  কার্যনির্বাহী কমিটি
                </TabsTrigger>
                <TabsTrigger 
                  value="advisory" 
                  className="rounded-full px-6 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  উপদেষ্টা মণ্ডলী
                </TabsTrigger>
                <TabsTrigger 
                  value="member" 
                  className="rounded-full px-6 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  সাধারণ সদস্য
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ট্যাব কন্টেন্ট */}
            {(Object.keys(groupedMembers) as MemberCategory[]).map((category) => (
              <TabsContent key={category} value={category} className="mt-0 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedMembers[category].map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </main>
  );
}