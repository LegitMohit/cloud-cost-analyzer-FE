"use client";

import Link from "next/link";
import { Cloud, BarChart3, Lightbulb, Settings, Zap } from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "AWS Integration",
    description: "Connect your AWS accounts and automatically discover resources",
    href: { pathname: "/aws" },
  },
  {
    icon: BarChart3,
    title: "Cost Analysis",
    description: "View detailed cost breakdowns and spending trends across your resources",
    href: { pathname: "/costs" },
  },
  {
    icon: Lightbulb,
    title: "Recommendations",
    description: "Get AI-powered cost optimization recommendations for your infrastructure",
    href: { pathname: "/recommendations" },
  },
  {
    icon: Settings,
    title: "Account Management",
    description: "Manage connected AWS accounts and credentials",
    href: { pathname: "/aws" },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Cloud Optimization</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Cloud Vento
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto">
            Optimize your AWS spending with intelligent insights, cost breakdowns, and AI-powered recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group p-6 rounded-xl bg-[#111118] border border-[#1E1E2E] hover:border-violet-500/50 hover:bg-white/5 transition-all duration-200"
            >
              <feature.icon className="h-10 w-10 text-violet-400 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                {feature.title}
              </h2>
              <p className="text-zinc-400">{feature.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={{ pathname: "/aws" }}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-3 text-sm font-semibold text-white hover:from-violet-500 hover:to-violet-400 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}