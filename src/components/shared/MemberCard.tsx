import Image from 'next/image';
import { Card } from '../ui/card';
import { Member } from "@/data/members";
import { Briefcase, Phone } from 'lucide-react';


interface MemberCardProps {
  member: Member;
}

const MemberCard = ({ member }: MemberCardProps) => {
    return (
        <Card
            key={member.id}
            className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-2xl"
        >
            {/* পুরো কার্ড জুড়ে ছবি */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                    src="/images/furkan.jpeg"
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* নিচের দিকে গাঢ় গ্র্যাডিয়েন্ট */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />

                {/* টেক্সট ওভারলে */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col gap-1.5">

                    {/* নাম ও পদবী */}
                    <div>
                        <h4 className="text-xl font-bold drop-shadow-sm tracking-wide leading-tight">
                            {member.name}
                        </h4>
                        <p className="text-sm font-semibold text-accent">
                            {member.designation}
                        </p>
                    </div>

                    {/* সূক্ষ্ম ডিভাইডার */}
                    <div className="w-12 h-[2px] bg-accent/70 my-1 rounded-full" />

                    {/* পেশা ও ফোন */}
                    <div className="flex flex-col gap-1 text-xs sm:text-sm text-white/90">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-accent" />
                            <span>{member.profession}</span>
                        </div>
                        <a
                            href={`tel:${member.phone}`}
                            className="flex items-center gap-2 hover:text-accent transition-colors w-fit"
                        >
                            <Phone className="h-3.5 w-3.5 text-accent" />
                            <span>{member.phone}</span>
                        </a>
                    </div>

                </div>
            </div>
        </Card>
    );
};

export default MemberCard;