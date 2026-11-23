"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  { name: "হোম", href: "/" },
  { name: "হিসাব নিকাশ", href: "/hisab" },
  { name: "আমাদের সম্পর্কে", href: "/about" },
  { name: "যোগাযোগ", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Better Auth সেশন হুক
  const { data: session, isPending } = authClient.useSession();

  // any ছাড়া টাইপ সেফ চেক
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const isActive = (href: string) => pathname === href;
  const closeSheet = () => setOpen(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto relative flex h-16 items-center justify-between px-4 md:px-6">

        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold tracking-wide hover:text-accent transition-colors"
          >
            ভায়াবহ উত্তরপাড়া জামে মসজিদ
          </Link>
        </div>

        {/* Middle Side (Desktop Nav) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-accent",
                isActive(item.href)
                  ? "text-accent font-medium"
                  : "text-primary-foreground/80"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Auth & Mobile Menu */}
        <div className="flex items-center gap-2">

          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-primary-foreground/20" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="size-9 cursor-pointer ring-2 ring-accent/50 transition-all hover:ring-accent">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback className="bg-accent text-primary text-xs font-bold">
                      {session.user.name?.slice(0, 2).toUpperCase() || "AD"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-xl border-border/50">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-0 mb-2">
                      <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                        <Avatar className="size-10 border border-border">
                          <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {session.user.name?.slice(0, 2).toUpperCase() || "AD"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 truncate">
                          <p className="text-sm font-semibold leading-none truncate text-primary">{session.user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="mb-1" />

                    {isAdmin && (
                      <DropdownMenuItem
                        onClick={() => router.push("/admin")}
                        className="cursor-pointer rounded-lg py-2.5 focus:bg-primary/10 focus:text-primary transition-colors"
                      >
                        <LayoutDashboard className="mr-2 size-4" />
                        <span className="font-medium">হিসাব নিকাশ</span>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-lg py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors mt-1"
                    >
                      <LogOut className="mr-2 size-4" />
                      <span className="font-medium">লগ আউট</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full px-6 border-accent text-accent hover:bg-accent hover:text-primary transition-all bg-transparent"
                )}
              >
                অ্যাডমিন লগইন
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-transparent" />}
              >
                <Menu />
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary border-none text-primary-foreground w-[250px] p-6">
                <SheetHeader>
                  <SheetTitle className="text-accent text-left text-xl font-bold">
                    উত্তরপাড়া মসজিদ
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 mt-6">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSheet}
                      className={cn(
                        "rounded-md px-2 py-2 text-base transition-colors hover:bg-primary-foreground/10",
                        isActive(item.href)
                          ? "text-accent font-medium"
                          : "text-primary-foreground/80"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Auth Section */}
                  <div className="mt-6 flex flex-col gap-2 border-t border-primary-foreground/20 pt-4">
                    {isPending ? (
                      <div className="h-10 w-full animate-pulse rounded-md bg-primary-foreground/20" />
                    ) : session?.user ? (
                      <>
                        <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-3 mb-2">
                          <Avatar className="size-10 border border-primary-foreground/20">
                            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                            <AvatarFallback className="bg-accent text-primary text-xs font-bold">
                              {session.user.name?.slice(0, 2).toUpperCase() || "AD"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col truncate">
                            <span className="text-sm font-semibold text-accent">{session.user.name}</span>
                            <span className="text-xs text-primary-foreground/70 truncate">{session.user.email}</span>
                          </div>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={closeSheet}
                            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full justify-start gap-2 rounded-lg bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20")}
                          >
                            <LayoutDashboard className="size-4" />
                            Admin Panel 
                          </Link>
                        )}

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => { closeSheet(); handleSignOut(); }}
                          className="w-full justify-start gap-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                        >
                          <LogOut className="size-4" />
                          লগ আউট
                        </Button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeSheet}
                        className={cn(buttonVariants({ size: "sm" }), "w-full rounded-full bg-accent text-primary hover:bg-accent/90 font-bold")}
                      >
                        অ্যাডমিন লগইন
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </nav>
    </header>
  );
}