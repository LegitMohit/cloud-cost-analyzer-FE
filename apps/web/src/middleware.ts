import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@cloud_cost_analyzer/env/web";

const publicPaths = ["/login", "/signup", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) => pathname === path);
  const isApiRoute = pathname.startsWith("/api/");

  if (isPublicPath || isApiRoute) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/me`, {
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