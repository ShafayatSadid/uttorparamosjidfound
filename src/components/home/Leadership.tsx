import Image from "next/image";
import Link from "next/link";
import { Phone, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dummyMembers, MemberCategory } from "@/data/members";

// ক্যাটাগরি অনুযায়ী টাইটেল
const categoryTitles: Record<MemberCategory, string> = {
  advisory: "উপদেষ্টা মণ্ডলী",
  committee: "কার্যনির্বাহী কমিটি",
  member: "সাধারণ সদস্য",
};

export function Leadership() {
  // ক্যাটাগরি অনুযায়ী ডেটা গ্রুপ করা
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
            মসজিদের দ্বীনি খেদমতে নিয়োজিত সম্মানিত কমিটি, উপদেষ্টা ও সদস্যবৃন্দ।
          </p>
        </div>

        {/* ক্যাটাগরি অনুযায়ী সেকশন রেন্ডার */}
        <div className="space-y-16  max-w-7xl mx-auto">
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
                  <Card key={member.id} className="overflow-hidden border-primary/10 shadow-sm hover:shadow-md transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        
                        {/* ছবি */}
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors">
                          <Image
                            src={"/public/images/mosjid.jpeg"}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* নাম ও পদবী */}
                        <div>
                          <h4 className="text-lg font-bold text-primary">
                            {member.name}
                          </h4>
                          <p className="text-sm font-semibold text-accent">
                            {member.designation}
                          </p>
                        </div>

                        {/* পেশা ও ফোন */}
                        <div className="w-full pt-4 mt-2 border-t border-border/50 space-y-2">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4 text-primary/60" />
                            <span>{member.profession}</span>
                          </div>
                          
                          <a 
                            href={`tel:${member.phone}`} 
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Phone className="h-4 w-4 text-primary/60" />
                            <span>{member.phone}</span>
                          </a>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
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
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 h-12"
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