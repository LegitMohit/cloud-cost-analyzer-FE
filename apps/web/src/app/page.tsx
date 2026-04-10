"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, X } from "lucide-react";

interface AWSResource {
  id: string;
  resourceType: string;
  resourceId: string;
  resourceStatus: string;
  awsAccountUsername: string;
}

export default function Home() {
  const [resources, setResources] = useState<AWSResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

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

  const filteredResources = selectedType
    ? resources.filter((r) => r.resourceType === selectedType)
    : [];

  const resourcesByAccount = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.awsAccountUsername]) {
      acc[resource.awsAccountUsername] = [];
    }
    acc[resource.awsAccountUsername].push(resource);
    return acc;
  }, {} as Record<string, AWSResource[]>);

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
                <button
                  key={rt.type}
                  onClick={() => setSelectedType(rt.type)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <div className="text-2xl mb-2">{rt.icon}</div>
                  <div className="text-2xl font-bold text-white">{rt.count}</div>
                  <div className="text-sm text-zinc-400">{rt.type}</div>
                </button>
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

      {selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedType} Resources
              </h3>
              <button
                onClick={() => setSelectedType(null)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {Object.keys(resourcesByAccount).length === 0 ? (
              <p className="text-zinc-400 text-center py-8">No {selectedType} resources found</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(resourcesByAccount).map(([accountName, accountResources]) => (
                  <div key={accountName} className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      ☁️ {accountName}
                      <span className="text-sm font-normal text-zinc-400">
                        ({accountResources.length} resources)
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {accountResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-2"
                        >
                          <span className="text-zinc-300 font-mono text-sm">{resource.resourceId}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            resource.resourceStatus === "running" || resource.resourceStatus === "active"
                              ? "bg-green-500/20 text-green-400"
                              : resource.resourceStatus === "stopped" || resource.resourceStatus === "inactive"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-zinc-700 text-zinc-400"
                          }`}>
                            {resource.resourceStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
