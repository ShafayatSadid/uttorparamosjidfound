"use client";

import { useEffect, useState } from "react";
import { Clock, Sun, Sunset, Sunrise } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// নামাজের নাম এবং আইকন ম্যাপিং
const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="h-5 w-5 text-accent" />,
  Sunrise: <Sun className="h-5 w-5 text-accent" />,
  Dhuhr: <Sun className="h-5 w-5 text-accent" />,
  Asr: <Sun className="h-5 w-5 text-accent" />,
  Maghrib: <Sunset className="h-5 w-5 text-accent" />,
  Isha: <Clock className="h-5 w-5 text-accent" />,
};

const prayerNamesBn: Record<string, string> = {
  Fajr: "ফজর",
  Sunrise: "সূর্যোদয়",
  Dhuhr: "জোহর",
  Asr: "আসর",
  Maghrib: "মাগরিব",
  Isha: "এশা",
};

// ২৪ ঘণ্টার সময়কে ১২ ঘণ্টায় (AM/PM) রূপান্তর করার ফাংশন
function formatTime(timeString: string) {
  if (!timeString) return "";
  
  // API মাঝে মাঝে "(BST)" এরকম টাইমজোন দিয়ে দেয়, তাই শুধু সময়টা আলাদা করছি
  const time = timeString.split(" ")[0]; 
  const [hoursStr, minutes] = time.split(":");
  
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 ঘণ্টা মানে 12 AM
  
  const formattedHours = hours < 10 ? `0${hours}` : hours; // ০৯:০০ দেখানোর জন্য
  
  return `${formattedHours}:${minutes} ${ampm}`;
}

export function PrayerTimes() {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        // ময়মনসিংহের জন্য API কল
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Mymensingh&country=Bangladesh&method=1"
        );
        const data = await res.json();
        
        if (data.code === 200) {
          setTimings(data.data.timings);
          
          // হিজরি তারিখ (ইংরেজি ফরম্যাটে আসে, সেটাই রাখছি)
          const hijri = data.data.date.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`);
        }
      } catch (error) {
        console.error("নামাজের সময় আনতে সমস্যা হচ্ছে:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground animate-pulse">নামাজের সময় লোড হচ্ছে...</p>
        </div>
      </section>
    );
  }

  if (!timings) return null;

  const displayPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* পেছনের হালকা ডিজাইন */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            নামাজের সময়সূচী
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">হিজরি: {hijriDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {displayPrayers.map((prayer) => (
            <Card key={prayer} className="bg-white border-primary/10 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-secondary rounded-full">
                  {prayerIcons[prayer]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {prayerNamesBn[prayer]}
                  </h3>
                  <p className="text-2xl font-semibold text-accent mt-1 whitespace-nowrap">
                    {formatTime(timings[prayer])}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* সূর্যোদয় এবং সূর্যাস্ত */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-accent" />
            <span>সূর্যোদয়: <strong>{formatTime(timings["Sunrise"])}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="h-4 w-4 text-accent" />
            <span>সূর্যাস্ত: <strong>{formatTime(timings["Sunset"])}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}