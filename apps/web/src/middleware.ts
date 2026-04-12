import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) => pathname === path);

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!res.ok) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};