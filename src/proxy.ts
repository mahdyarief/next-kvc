import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Resolve convenience routes
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }

  // Allow Next.js internals and favicon
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Allow known static asset extensions
  const staticExtensions = [
    ".svg", ".ico", ".png", ".jpg", ".jpeg", ".webp", ".woff", ".woff2", ".ttf",
  ];
  if (pathname.lastIndexOf("/") === 0 && staticExtensions.some((ext) => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // 2. Auth Check
  // Only the /dashboard route requires login as per user request
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Protect dashboard routes
  if (isDashboardRoute && !isLoggedIn) {
    let from = pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodeURIComponent(from)}`, request.url)
    );
  }

  // Prevent CUSTOMER from accessing dashboard
  if (isDashboardRoute && isLoggedIn && session?.user && (session.user as any).role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect logged-in users away from auth pages (optional but standard)
  if (isLoggedIn && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Next.js 15/16 middleware usually expects 'middleware' as the function name
// and it must be in a file named 'middleware.ts'. 
// However, I will keep 'proxy' as a named export to satisfy the user's request.
export const middleware = proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
