import { Cloud, BarChart3, Lightbulb, Settings, Zap, ArrowDown } from "lucide-react";
import Link from "next/link";

import PolicyBlock from "@/components/policy-block";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: { pathname: string };
}

const features: Feature[] = [
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
    <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <section className="text-center mb-16" aria-labelledby="page-heading">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            <Zap className="w-4 h-4" aria-hidden="true" />
            <span>AI-Powered Cloud Optimization</span>
          </div>
          <h1 id="page-heading" className="text-5xl font-bold text-white mb-4 tracking-tight">
            Cloud Vento
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto">
            Optimize your AWS spending with intelligent insights, cost breakdowns, and AI-powered recommendations
          </p>
        </section>

        <nav aria-label="Feature navigation">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                prefetch={false}
                className="group p-6 rounded-xl bg-[#111118] border border-[#1E1E2E] hover:border-violet-500/50 hover:bg-white/5 transition-all duration-200"
              >
                <feature.icon className="h-10 w-10 text-violet-400 mb-4" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {feature.title}
                </h2>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>
        </nav>

        <div className="text-center flex flex-col items-center gap-4">
          <Link
            href={{ pathname: "/aws" }}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-3 text-sm font-semibold text-white hover:from-violet-500 hover:to-violet-400 transition-all active:scale-95"
          >
            Get Started
          </Link>
          <a
            href="#how-to-get-started"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            How to get started
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        <section id="how-to-get-started" className="mt-24 max-w-3xl mx-auto" aria-labelledby="get-started-heading">
          <h2 id="get-started-heading" className="text-3xl font-bold text-white mb-8 text-center">How to Get Started</h2>

          <div className="space-y-8">
            <article className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-semibold" aria-hidden="true">1</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Use IAM Role-Based Access (Recommended)</h3>
                  <p className="text-zinc-400 text-sm">
                    IAM role-based access is the preferred method as it provides better security with temporary credentials and follows AWS best practices. Create an IAM role with the required permissions instead of using long-term access keys.
                  </p>
                </div>
              </div>
            </article>

            <article className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-semibold" aria-hidden="true">2</div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="text-lg font-semibold text-white mb-2">Attach User Policy via Root Account</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    If using IAM users, attach the following policy to your IAM user from the root account:
                  </p>

                  <PolicyBlock />
                </div>
              </div>
            </article>

            <article className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-semibold" aria-hidden="true">3</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Enable Cloud Cost Explorer for IAM User</h3>
                  <p className="text-zinc-400 text-sm">
                    Go to AWS Console → Cost Explorer → Enable it if not already active. Without Cloud Cost Explorer enabled, you won't be able to retrieve cost and usage data programmatically. Make sure the IAM user has the necessary permissions to access Cost Explorer data.
                  </p>
                </div>
              </div>
            </article>

            <article className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-semibold" aria-hidden="true">4</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Enable Hourly Granularity</h3>
                  <p className="text-zinc-400 text-sm">
                    In AWS Console → Billing → Preferences → Enable &quot;Receive hourly granularity&quot; for detailed cost data. This allows Cloud Vento to provide accurate, real-time cost analysis with hourly breakdown instead of daily summaries. Note: This may incur additional costs depending on your AWS setup.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
