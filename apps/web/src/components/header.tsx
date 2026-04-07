"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import { ProfileMenu } from "./profile-menu";

export default function Header() {
  const links = [{ to: "/", label: "Home" }] as const;

  return (
    <header className="border-b border-zinc-800">
      <div className="flex flex-row items-center justify-between px-4 py-3">
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
          <ProfileMenu />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
