"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
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

export default function Home() {
  const [resources, setResources] = useState<AWSResource[]>([]);
  const [accounts, setAccounts] = useState<AWSAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reconnectModal, setReconnectModal] = useState<{ open: boolean; account: AWSAccount | null }>({ open: false, account: null });
  const [secretKey, setSecretKey] = useState("");

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
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

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
            <h2 className="text-xl font-semibold text-white">Connected AWS Accounts</h2>
            <Link
              href={{ pathname: "/connect-aws" }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              + Connect AWS
            </Link>
          </div>
          {loading ? (
            <div className="text-zinc-400">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="text-zinc-400 text-center py-4">No AWS accounts connected</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex-shrink-0 w-48 p-3 rounded-lg border border-zinc-800 bg-zinc-900">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium truncate">{account.awsAccountUsername}</div>
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
                  <div className="text-zinc-400 text-sm mb-3">{account.region}</div>
                  <button
                    onClick={() => handleReconnect(account)}
                    disabled={reconnectingId === account.id}
                    className="w-full text-indigo-400 hover:text-indigo-300 text-sm disabled:opacity-50"
                  >
                    {reconnectingId === account.id ? "Reconnecting..." : "Reconnect"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">AWS Resources</h2>
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
          <div className="flex flex-col gap-2">
            <Link
              href={{ pathname: "/costs" }}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View Cost Analysis →
            </Link>
            <Link
              href={{ pathname: "/recommendations" }}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View Recommendations →
            </Link>
          </div>
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

      {reconnectModal.open && reconnectModal.account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Reconnect AWS Account</h3>
              <button
                onClick={() => setReconnectModal({ open: false, account: null })}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Access Key</label>
                <div className="text-white font-mono text-sm bg-zinc-800 p-2 rounded">{reconnectModal.account.accessKey}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Region</label>
                <div className="text-white font-mono text-sm bg-zinc-800 p-2 rounded">{reconnectModal.account.region}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">AWS Account</label>
                <div className="text-white font-mono text-sm bg-zinc-800 p-2 rounded">{reconnectModal.account.awsAccountUsername}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Secret Access Key</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter your AWS Secret Access Key"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleReconnectSubmit}
                disabled={reconnectingId === reconnectModal.account.id}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
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
