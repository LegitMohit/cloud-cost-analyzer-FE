"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AWSResource {
  id: string;
  resourceType: string;
  resourceId: string;
  status: string;
}

export default function Home() {
  const [resources, setResources] = useState<AWSResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aws/resources`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setResources(data.resources || []);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  const resourceTypes = [
    { type: "EC2", icon: "🖥️", count: resources.filter((r) => r.resourceType === "EC2").length },
    { type: "EBS", icon: "💾", count: resources.filter((r) => r.resourceType === "EBS").length },
    { type: "S3", icon: "🪣", count: resources.filter((r) => r.resourceType === "S3").length },
    { type: "RDS", icon: "🗄️", count: resources.filter((r) => r.resourceType === "RDS").length },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">AWS Resources</h2>
            <Link
              href={{ pathname: "/connect-aws" }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              + Connect AWS
            </Link>
          </div>

          {loading ? (
            <div className="text-zinc-400">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">No AWS resources connected yet.</p>
              <Link
                href={{ pathname: "/connect-aws" }}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Connect your AWS account
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {resourceTypes.map((rt) => (
                <div
                  key={rt.type}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center"
                >
                  <div className="text-2xl mb-2">{rt.icon}</div>
                  <div className="text-2xl font-bold text-white">{rt.count}</div>
                  <div className="text-sm text-zinc-400">{rt.type}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Cost Overview</h2>
          <Link
            href={{ pathname: "/costs" }}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View Cost Analysis →
          </Link>
        </section>
      </div>
    </div>
  );
}
