"use client";
import Link from "next/link";
import { Search } from "lucide-react";

import { ProfileMenu } from "./profile-menu";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  const quickLinks: { href: { pathname: string }; label: string }[] = [
    { href: { pathname: "/aws" }, label: "AWS" },
    { href: { pathname: "/costs" }, label: "Costs" },
    { href: { pathname: "/recommendations" }, label: "Recommendations" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0E]/90 backdrop-blur-lg rounded-bl-[7px] rounded-br-[7px] shadow-black/20">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-white">
            Cloud Vento
          </Link>
          <nav className="hidden md:flex items-center gap-5">
              {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72">
                <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-3 shadow-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search pages, costs, resources..."
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                      autoFocus
                    />
                  </div>
                  {searchQuery.length > 0 && (
                    <div className="mt-2 border-t border-[#1E1E2E] pt-2">
                      <p className="text-xs text-zinc-500 px-2 py-1">Quick Links</p>
                      <div className="space-y-1">
                        {quickLinks
                          .filter((link) =>
                            link.label.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={() => setSearchOpen(false)}
                              className="block px-2 py-1.5 text-sm text-zinc-300 hover:bg-white/5 rounded-md hover:text-white transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        {quickLinks.filter((link) =>
                          link.label.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                          <p className="px-2 py-1.5 text-xs text-zinc-500">No results found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
