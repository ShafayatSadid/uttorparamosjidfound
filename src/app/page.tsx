import { Hero } from "@/components/home/Hero";
import { PrayerTimes } from "@/components/home/PrayerTimes";
import { QuranHadith } from "@/components/home/QuranHadith";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <PrayerTimes />
      <QuranHadith/>
    </main>
  );
}