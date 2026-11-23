import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-32 max-w-7xl mx-auto">
      {/* পেছনের হালকা ব্যাকগ্রাউন্ড ডিজাইন */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl w-96 h-96" />
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10 blur-3xl w-72 h-72" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* বাম দিক: টেক্সট এবং বাটন */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            
            <div className="space-y-4">
              {/* ছোট হাইলাইট টেক্সট */}
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 bg-accent rounded-full"></span>
                <span className="text-sm font-bold tracking-wider text-accent uppercase">
                  আসসালামু আলাইকুম
                </span>
              </div>

              {/* মেইন হেডলাইন */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  ভায়াবহ উত্তরপাড়া
                </span>
                <br />
                জামে মসজিদ
              </h1>

              {/* ঠিকানা */}
              <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base font-medium">
                <MapPin className="h-4 w-4 text-accent" />
                <span>ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।</span>
              </div>

              {/* ডেসক্রিপশন */}
              <p className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed pt-2">
                দ্বীনের খিদমতে আমাদের এই ক্ষুদ্র প্রয়াস। মসজিদের যাবতীয় নির্মাণ ফান্ড, বাৎসরিক চাঁদা এবং সাপ্তাহিক আদায়ের স্বচ্ছ হিসাব নিকাশ এখন এক জায়গায়।
              </p>
            </div>

            {/* বাটনসমূহ */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/hisab" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full bg-accent text-primary hover:bg-accent/90 font-bold text-base h-12 px-8"
                >
                  হিসাব নিকাশ দেখুন
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/about" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-primary text-primary hover:bg-primary/5 font-semibold text-base h-12 px-8"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  আমাদের সম্পর্কে
                </Button>
              </Link>
            </div>

          </div>

          {/* ডান দিক: মসজিদের ছবি */}
          <div className="relative mx-auto w-full max-w-lg md:max-w-none">
            {/* ছবির পেছনে গোল্ডেন বর্ডার/শ্যাডো ইফেক্ট */}
            <div className="absolute inset-0 -m-4 rounded-3xl border-2 border-accent/30 translate-x-4 translate-y-4 -z-10" />
            
            <div className="relative aspect-[4/3] md:aspect-[5/4] w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/mosjid.jpeg"
                alt="ভায়াবহ উত্তরপাড়া জামে মসজিদ"
                fill
                priority
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}