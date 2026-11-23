

import Link from "next/link";

import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

import { FaFacebook, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { cacheLife } from "next/cache";

const NAV_ITEMS = [
  { name: "হোম", href: "/" },
  { name: "হিসাব নিকাশ", href: "/hisab" },
  { name: "আমাদের সম্পর্কে", href: "/about" },
  { name: "যোগাযোগ", href: "/contact" },
];

const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
  { name: "WhatsApp", href: "https://wa.me/8801XXXXXXXXX", icon: MessageCircle },
];

async function getCopyrightYear() {
    "use cache";
    cacheLife("max");
    return new Date().getFullYear();
}

export default async function Footer() {

  const year = await getCopyrightYear();

 

  return (
    <footer className="w-full bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      {/* Top CTA Band */}
      {/* <div className="max-w-7xl mx-auto border-b border-sidebar-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <Heart className="size-5 shrink-0 text-sidebar-primary" />
            <p className="text-sm text-sidebar-foreground/80">
              মসজিদের উন্নয়নে আপনিও অংশ নিন — সদকা ও অনুদান দিন।
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-sidebar-primary px-6 py-2 text-sm font-bold text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90"
          >
            যোগাযোগ করুন
          </Link>
        </div>
      </div> */}

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-3">
        {/* 1. Brand */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-wide text-sidebar-foreground transition-colors hover:text-sidebar-primary md:text-xl"
          >
            ভায়াবহ উত্তরপাড়া জামে মসজিদ
          </Link>
          <p className="text-sm leading-relaxed text-sidebar-foreground/70 max-w-90">
            আলহামদুলিল্লাহ, আমাদের মসজিদ কমিউনিটি দ্বীনের খেদমতে নিয়োজিত। নামাজ, কুরআন শিক্ষা ও সমাজসেবায় আমরা একসাথে।
          </p>
          <div className="flex items-center gap-3 pt-1">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex size-9 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-sidebar-foreground/80 transition-all hover:border-sidebar-primary hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* 2. Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sidebar-primary">
            দ্রুত লিংক
          </h3>
          <ul className="flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors hover:text-sidebar-primary hover:translate-x-1 inline-block",
                    
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sidebar-primary">
            যোগাযোগ
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <span className="text-sidebar-foreground/70">
                ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <a
                href="tel:+8801XXXXXXXXX"
                className="text-sidebar-foreground/70 transition-colors hover:text-sidebar-primary"
              >
                +৮৮০ ১XXX-XXXXXX
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <a
                href="mailto:info@uttorparamosjid.com"
                className="break-all text-sidebar-foreground/70 transition-colors hover:text-sidebar-primary"
              >
                info@uttorparamosjid.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sidebar-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-sidebar-foreground/60 md:flex-row md:px-6 md:text-left">
          <p>
            © {year} ভায়াবহ উত্তরপাড়া জামে মসজিদ। সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Design & Development Credit */}
            <a
              href="https://shafayat-sadid.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 transition-colors hover:text-sidebar-primary"
            >
              <span>
                Design &amp; Development by{" "}
                <span className="font-medium text-sidebar-foreground/80 group-hover:text-sidebar-primary">
                  Shafayat Hossain
                </span>
              </span>
              <ExternalLink className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}