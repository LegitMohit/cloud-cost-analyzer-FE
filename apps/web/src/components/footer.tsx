"use client";
import Link from "next/link";

interface FooterLink {
  href: string;
  label: string;
}

interface NavColumn {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navColumns: NavColumn[] = [
    {
      title: "Overview",
      links: [
        { href: "/aws", label: "AWS" },
        { href: "/costs", label: "Cost Analysis" },
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-white tracking-tight">
                cloud vento
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed text-right">
              Optimize your AWS spending with intelligent insights, cost breakdowns, and AI-powered recommendations
            </p>
          </div>

          <div className="h-px bg-[#1E1E2E] mb-8" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-xs text-zinc-500">
              © {currentYear} cloud vento. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 md:gap-12">
              {navColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-xs font-semibold text-violet-300 uppercase tracking-wider mb-3">
                    {column.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {column.links.map((link) => {
                      const isExternal = link.href.startsWith("http");
                      return isExternal ? (
                        <a
                          key={link.label}
                          href={link.href}
                          className="text-xs text-zinc-400 hover:text-violet-200 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.label}
                          href={link.href as any}
                          className="text-xs text-zinc-400 hover:text-violet-200 transition-colors"
                        >
                          {link.label}
                        </Link>
                      );
                    })}
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