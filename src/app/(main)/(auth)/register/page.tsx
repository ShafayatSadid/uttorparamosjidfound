"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, User, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // নতুন স্টেট
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (error) {
                setError(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। (সাইনআপ বন্ধ থাকতে পারে)");
            } else {
                router.push("/hisab");
                router.refresh();
            }
        } catch (err) {
            setError("সার্ভারে সমস্যা হচ্ছে।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
            <Card className="w-full max-w-md border-primary/10 shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/5 p-3 rounded-full w-fit mb-2">
                        <User className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary">অ্যাডমিন রেজিস্ট্রেশন</CardTitle>
                    <CardDescription>
                        মসজিদের হিসাব নিকাশের জন্য নতুন অ্যাকাউন্ট খুলুন।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">নাম</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="আপনার নাম"
                                    className="pl-10"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">পাসওয়ার্ড</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    // পাসওয়ার্ড শো করার জন্য টাইপ ডাইনামিক করা হলো
                                    type={showPassword ? "text" : "password"}
                                    placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                                    // ডান দিকে আইকনের জায়গা রাখার জন্য pr-10
                                    className="pl-10 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={8}
                                    required
                                />
                                {/* চোখের আইকন বাটন */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 mt-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "রেজিস্টার করুন"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-border/50 pt-4 pb-6">
                    <p className="text-sm text-muted-foreground">
                        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                        <Link href="/login" className="text-accent font-semibold hover:underline">
                            লগইন করুন
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}