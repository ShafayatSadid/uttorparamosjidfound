import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar"; // নতুন ইমপোর্ট

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ভায়াবহ উত্তরপাড়া জামে মসজিদ",
  description: "মসজিদের যাবতীয় হিসাব নিকাশ ও ফান্ড ম্যানেজমেন্ট সিস্টেম - ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${inter.className} bg-white text-[#0a192f] antialiased`}>
        <Navbar /> {/* Navbar এখানে বসানো হলো */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}