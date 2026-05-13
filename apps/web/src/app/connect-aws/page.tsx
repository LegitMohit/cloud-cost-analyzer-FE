"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { awsApi } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AWS_REGIONS = [
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-south-2", label: "Asia Pacific (Hyderabad)" },
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "EU (Ireland)" },
  { value: "eu-west-2", label: "EU (London)" },
  { value: "eu-central-1", label: "EU (Frankfurt)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
];

export default function ConnectAWSPage() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("ap-south-1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await awsApi.connect({ accessKey, secretKey, region });
      alert(`${result.message} (${result.resourcesFetched} resources fetched)`);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to connect AWS account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1E1E2E] bg-[#111218]/80 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Connect AWS</h1>
          <p className="mt-2 text-sm text-zinc-400">Enter your AWS credentials to scan resources</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Access Key ID
            </label>
            <input
              type="text"
              required
              className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
              placeholder="AKIA..."
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Secret Access Key
            </label>
            <input
              type="password"
              required
              className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
              placeholder="••••••••••••••••"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              AWS Region
            </label>
            <select
              required
              className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {AWS_REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Connecting..." : "Connect AWS Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          <Link href="/aws" className="font-semibold text-violet-200 hover:text-violet-100 transition-colors">
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
