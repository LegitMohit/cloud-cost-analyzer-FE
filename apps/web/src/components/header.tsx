"use client";
import Link from "next/link";

import { ProfileMenu } from "./profile-menu";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A0B0E]/70 backdrop-blur-lg">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-white">
            Cloud Vento
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
