"use client";

import { useState, useEffect } from "react";
import { awsApi, type Recommendation, type RecommendationResponse } from "@/lib/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ConnectedAccount {
  id: string;
  awsAccountUsername: string;
  accessKey: string;
  region: string;
}

export default function RecommendationsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      fetchRecommendations(selectedAccountId);
    }
  }, [selectedAccountId]);

  const fetchAccounts = async () => {
    try {
      const data = await awsApi.getConnectedAccounts();
      const accountsData = Array.isArray(data) ? data : (data?.accounts || []);
      setAccounts(accountsData);
      if (accountsData.length > 0) {
        setSelectedAccountId(accountsData[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (accountId?: string) => {
    setLoading(true);
    try {
      const data = await awsApi.getRecommendations(accountId);
      setRecommendations(data.recommendations);
      setTotalSavings(data.totalSavings);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedAccountId) {
      setError("Please select an AWS account");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      await awsApi.generateRecommendations(selectedAccountId);
      await fetchRecommendations(selectedAccountId);
    } catch (err: any) {
      setError(err.message || "Failed to generate recommendations");
    } finally {
      setGenerating(false);
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-8">AWS Recommendations</h1>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-zinc-400 mb-4">No AWS accounts connected.</p>
          <a href="/connect-aws" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Connect an AWS account →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-8">AWS Recommendations</h1>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-zinc-300 mb-2">AWS Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.awsAccountUsername} ({account.region})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-2"
          >
            {generating && <Loader2 className="h-4 w-4 animate-spin" />}
            {generating ? "Generating..." : "Generate Recommendations"}
          </button>
        </div>
        <p className="text-zinc-400 text-sm mt-3">
          Analyze your AWS resources and get cost optimization recommendations
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-zinc-400 mb-4">No recommendations yet.</p>
          <p className="text-zinc-500 text-sm">Click "Generate Recommendations" to analyze your AWS resources.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-6 p-4 bg-emerald-900/20 rounded-lg">
            <span className="text-emerald-400 font-semibold text-lg">
              Total Potential Savings: ${totalSavings.toFixed(2)}/month
            </span>
            <span className="text-zinc-400 text-sm ml-2">
              ({recommendations.length} recommendations)
            </span>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="border border-zinc-800 bg-zinc-800/30 rounded-lg p-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-zinc-400">
                        {rec.resourceType}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-sm text-zinc-500">
                        {rec.awsAccountUsername}
                      </span>
                    </div>
                    <p className="text-white font-medium">{rec.issue}</p>
                    <p className="text-zinc-400 text-sm mt-1">{rec.recommendation}</p>
                    <p className="text-zinc-500 text-xs mt-2 font-mono">
                      {rec.resourceIdentifier}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-semibold text-lg">
                      ${rec.estimatedSavings.toFixed(2)}
                    </span>
                    <span className="text-zinc-500 text-sm">/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}