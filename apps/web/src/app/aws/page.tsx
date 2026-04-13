"use client";

import { useEffect, useState, useRef, type SVGProps } from "react";
import Link from "next/link";
import { Loader2, X, Server, Database, HardDrive } from "lucide-react";
import { KebabMenu } from "@/components/kebab-menu";
import { awsApi } from "@/lib/api";

interface AWSResource {
  id: string;
  resourceType: string;
  resourceId: string;
  resourceStatus: string;
  awsAccountUsername: string;
}

interface AWSAccount {
  id: string;
  awsAccountUsername: string;
  accessKey: string;
  region: string;
  status: string;
}

function BucketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 8H3l2 12c.1 1.1 1 2 2 2h10c1 0 1.9-.9 2-2L21 8z" />
      <path d="M8 8V5c0-1.7 1.3-3 4-3s4 1.3 4 3v3" />
    </svg>
  );
}

export default function Home() {
  const [resources, setResources] = useState<AWSResource[]>([]);
  const [accounts, setAccounts] = useState<AWSAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reconnectModal, setReconnectModal] = useState<{ open: boolean; account: AWSAccount | null }>({ open: false, account: null });
  const [secretKey, setSecretKey] = useState("");
  const reconnectModalRef = useRef<HTMLDivElement>(null);
  const resourceModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reconnectModal.open || selectedType) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [reconnectModal.open, selectedType]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        reconnectModalRef.current &&
        !reconnectModalRef.current.contains(event.target as Node)
      ) {
        setReconnectModal({ open: false, account: null });
      }
    }
    if (reconnectModal.open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [reconnectModal.open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resourceModalRef.current &&
        !resourceModalRef.current.contains(event.target as Node)
      ) {
        setSelectedType(null);
      }
    }
    if (selectedType) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [selectedType]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resourcesRes, accountsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/aws/resources`, { credentials: "include" }),
          awsApi.getConnectedAccounts(),
        ]);
        if (resourcesRes.ok) {
          const data = await resourcesRes.json();
          setResources(data.resources || []);
        }
        if (accountsRes.accounts) {
          setAccounts(accountsRes.accounts);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleReconnect = (account: AWSAccount) => {
    setReconnectModal({ open: true, account });
    setSecretKey("");
  };

  const handleReconnectSubmit = async () => {
    if (!reconnectModal.account) return;
    if (!secretKey) {
      alert("Please enter your AWS Secret Access Key");
      return;
    }
    setReconnectingId(reconnectModal.account.id);
    try {
      await awsApi.connect({
        accessKey: reconnectModal.account.accessKey,
        secretKey: secretKey,
        region: reconnectModal.account.region,
      });
      alert("AWS account reconnected successfully!");
      setReconnectModal({ open: false, account: null });
      setSecretKey("");
      const [resourcesRes, accountsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/aws/resources`, { credentials: "include" }),
        awsApi.getConnectedAccounts(),
      ]);
      if (resourcesRes.ok) {
        const data = await resourcesRes.json();
        setResources(data.resources || []);
      }
      if (accountsRes.accounts) {
        setAccounts(accountsRes.accounts);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to reconnect");
    } finally {
      setReconnectingId(null);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("Are you sure you want to delete this AWS account?")) return;
    setDeletingId(accountId);
    try {
      await awsApi.deleteAWSAccount(accountId);
      setAccounts(accounts.filter((a) => a.id !== accountId));
      const [resourcesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/aws/resources`, { credentials: "include" }),
      ]);
      if (resourcesRes.ok) {
        const data = await resourcesRes.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const resourceTypes = [
    { type: "EC2", icon: Server, accent: "from-orange-500 to-orange-600", count: resources.filter((r) => r.resourceType === "EC2").length },
    { type: "EBS", icon: HardDrive, accent: "from-red-500 to-red-600", count: resources.filter((r) => r.resourceType === "EBS").length },
    { type: "S3", icon: BucketIcon, accent: "from-emerald-500 to-emerald-600", count: resources.filter((r) => r.resourceType === "S3").length },
    { type: "RDS", icon: Database, accent: "from-blue-500 to-blue-600", count: resources.filter((r) => r.resourceType === "RDS").length },
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
    <div className="mx-auto max-w-7xl flex flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-[#1E1E2E] bg-[#0A0B10]/80 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
              <span className="text-violet-300">AI-Powered AWS Insights</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Manage AWS connections with Cloud Vento</h1>
            <p className="mt-4 text-sm text-zinc-400 sm:text-base">
              Keep the AWS page aligned with the homepage experience: clear spacing, premium dark surfaces, and fast access to account status, resource inventory, and cost workflows.
            </p>
          </div>
          <Link
            href={{ pathname: "/connect-aws" }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-center text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-violet-400"
          >
            + Connect AWS
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr] w-full">
        <section className="min-w-0 rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Connected AWS Accounts</h2>
              <p className="mt-2 text-sm text-zinc-400">All connected AWS accounts are monitored here with quick reconnect and management actions.</p>
            </div>
            <Link
              href={{ pathname: "/connect-aws" }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-center text-violet-200 transition hover:bg-violet-500/15"
            >
              + Connect AWS
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center gap-3 text-sm text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin text-violet-400" /> Loading accounts...
            </div>
          ) : accounts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-zinc-800 bg-[#10121A]/80 p-8 text-center text-zinc-500">
              No AWS accounts connected yet. Connect an account to start exploring resource inventory.
            </div>
          ) : (
            <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex-shrink-0 w-full sm:w-[45%] lg:w-[43%] rounded-[1.5rem] border border-zinc-800 bg-[#0D1019]/90 p-5 transition hover:border-violet-500/30 hover:bg-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-violet-300">AWS Account</p>
                      <p className="mt-2 text-lg font-semibold text-white truncate">{account.awsAccountUsername}</p>
                    </div>
                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">{account.region}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleReconnect(account)}
                      disabled={reconnectingId === account.id}
                      className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reconnectingId === account.id ? "Reconnecting..." : "Reconnect"}
                    </button>
                    <KebabMenu>
                      <button
                        onClick={() => handleDelete(account.id)}
                        disabled={deletingId === account.id}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 disabled:opacity-50"
                      >
                        {deletingId === account.id ? "Deleting..." : "Delete"}
                      </button>
                    </KebabMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">AWS Resources</h2>
              <p className="mt-2 text-sm text-zinc-400">Inventory overview for the most common AWS services in your deployment.</p>
            </div>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white/5 px-3 py-2 text-center text-xs text-zinc-300">
              Select a service to drill into resources.
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center gap-3 text-sm text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin text-violet-400" /> Loading resources...
            </div>
          ) : resources.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-zinc-800 bg-[#10121A]/80 p-8 text-center text-zinc-500">
              No AWS resources discovered. Connect an AWS account to populate this inventory.
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-max">
              {resourceTypes.map((rt) => {
                const Icon = rt.icon;
                const active = selectedType === rt.type;
                return (
                  <button
                    key={rt.type}
                    onClick={() => setSelectedType(rt.type)}
                    className={`flex flex-col items-center rounded-[1.5rem] border px-5 py-6 text-center transition ${
                      active
                        ? "border-violet-500/40 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.25)]"
                        : "border-zinc-800 bg-[#0D1019]/90 hover:border-zinc-700 hover:bg-white/5"
                    }`}
                  >
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${rt.accent} text-white shadow-lg shadow-violet-500/10`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="mt-5 text-3xl font-semibold text-white">{rt.count}</div>
                    <div className="mt-2 text-sm uppercase tracking-[0.24em] text-zinc-400">{rt.type}</div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="min-w-0 rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Cost Overview</h2>
            <p className="mt-2 text-sm text-zinc-400">Quick access to cost analysis and recommendations.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={{ pathname: "/costs" }}
              className="rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-violet-400"
            >
              View Cost Analysis
            </Link>
            <Link
              href={{ pathname: "/recommendations" }}
              className="rounded-full border border-violet-500/20 bg-white/5 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-white/10"
            >
              View Recommendations
            </Link>
          </div>
        </div>
      </section>

      {selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] p-4">
          <div ref={resourceModalRef} className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[1.5rem] border border-zinc-800 bg-[#0B0D13]/95 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedType} Resources</h3>
                <p className="text-sm text-zinc-400">Detailed inventory for the selected AWS service.</p>
              </div>
              <button
                onClick={() => setSelectedType(null)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {Object.keys(resourcesByAccount).length === 0 ? (
              <p className="text-zinc-400 text-center py-8">No {selectedType} resources found</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(resourcesByAccount).map(([accountName, accountResources]) => (
                  <div key={accountName} className="rounded-3xl border border-zinc-800 bg-[#11131D]/80 p-4">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      ☁️ {accountName}
                      <span className="text-sm font-normal text-zinc-400">({accountResources.length} resources)</span>
                    </h4>
                    <div className="space-y-2">
                      {accountResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between rounded-3xl bg-[#0F1220] px-4 py-3"
                        >
                          <span className="text-zinc-300 font-mono text-sm">{resource.resourceId}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
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

      {reconnectModal.open && reconnectModal.account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] p-4">
          <div ref={reconnectModalRef} className="w-full max-w-md rounded-[1.5rem] border border-zinc-800 bg-[#0B0D13]/95 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Reconnect AWS Account</h3>
              <button
                onClick={() => setReconnectModal({ open: false, account: null })}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Access Key</label>
                <div className="text-white font-mono text-sm bg-[#12151F] p-3 rounded-2xl">{reconnectModal.account.accessKey}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Region</label>
                <div className="text-white font-mono text-sm bg-[#12151F] p-3 rounded-2xl">{reconnectModal.account.region}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">AWS Account</label>
                <div className="text-white font-mono text-sm bg-[#12151F] p-3 rounded-2xl">{reconnectModal.account.awsAccountUsername}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Secret Access Key</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter your AWS Secret Access Key"
                  className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleReconnectSubmit}
                disabled={reconnectingId === reconnectModal.account.id}
                className="w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-50"
              >
                {reconnectingId === reconnectModal.account.id ? "Reconnecting..." : "Reconnect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
