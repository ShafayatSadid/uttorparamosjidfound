"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  HeartHandshake, 
  FileText, 
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "ওভারভিউ", href: "/admin", icon: LayoutDashboard },
  { name: "ব্যক্তিভিত্তিক", href: "/admin/persons", icon: Users },
  { name: "সাপ্তাহিক", href: "/admin/weekly", icon: CalendarDays },
  { name: "বিবিধ দান", href: "/admin/misc", icon: HeartHandshake },
  { name: "প্রিন্ট/রিপোর্ট", href: "/admin/reports", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground hidden md:flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-primary-foreground/10">
          <h2 className="text-xl font-bold text-accent">হিসাব নিকাশ</h2>
          <p className="text-xs text-primary-foreground/60 mt-1">অ্যাডমিন প্যানেল</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accent text-primary" 
                    : "hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to Website */}
        <div className="p-4 border-t border-primary-foreground/10">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}