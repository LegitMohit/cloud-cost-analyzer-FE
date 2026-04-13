"use client";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navColumns = [
    {
      title: "Overview",
      links: [
        { href: "/aws", label: "AWS" },
        { href: "/cost", label: "Cost Analysis" },
        { href: "/recommendations", label: "Recommendations" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms and Conditions" },
        { href: "/privacy-policy", label: "Privacy Policy" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: "https://wa.me/918010382879", label: "WhatsApp" },
        { href: "https://www.linkedin.com/in/mohit-sharma-a98a95218/", label: "LinkedIn" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A0A0F] border-t border-[#1E1E2E]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h2 className="font-serif text-3xl font-normal text-white tracking-tight">
                cloud vento
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-[260px] text-right leading-relaxed">
              Optimize your AWS spending with intelligent insights, cost breakdowns, and AI-powered recommendations
            </p>
          </div>

          <div className="h-px bg-[#1E1E2E] mb-8" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <p className="text-xs text-zinc-500">
              © {currentYear} cloud vento. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-8 md:gap-16">
              {navColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-[13px] font-semibold text-zinc-300 mb-3">
                    {column.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {column.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-xs text-zinc-500 hover:text-violet-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}