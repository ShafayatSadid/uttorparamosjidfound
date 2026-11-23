import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    console.log("sessionCookie:", sessionCookie);
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const role = (session?.user as { role?: string })?.role;

    if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // /hisab বা /dashboard যেকোনো রুট যেটা প্রোটেক্ট করতে চান
    matcher: "/admin/:path*",
};