import { env } from "@cloud_cost_analyzer/env/web";
import { NextRequest, NextResponse } from "next/server";

function getPath(request: NextRequest): string {
  const url = new URL(request.url);
  return url.pathname.replace("/api/", "");
}

export async function GET(request: NextRequest) {
  const targetUrl = `${env.NEXT_PUBLIC_API_URL}${getPath(request)}${request.nextUrl.search}`;

  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const data = await response.text();
  
  const res = new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("Set-Cookie", setCookie);
  }

  return res;
}

export async function POST(request: NextRequest) {
  const targetUrl = `${env.NEXT_PUBLIC_API_URL}${getPath(request)}${request.nextUrl.search}`;

  const body = await request.text();

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") || "",
    },
    body,
  });

  const data = await response.text();
  
  const res = new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("Set-Cookie", setCookie);
  }

  return res;
}