"use client";

import Link from "next/link";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const { isSignedIn } = useAuth();
  const links = [{ to: "/", label: "Home" }] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton>
              <button className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}
