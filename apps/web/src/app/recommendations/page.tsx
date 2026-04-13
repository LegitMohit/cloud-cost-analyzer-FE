"use client";

import { useState, useEffect } from "react";
import { awsApi, type Recommendation, type RecommendationResponse } from "@/lib/api";
import { Loader2, Lightbulb, TrendingDown, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

interface ConnectedAccount {
  id: string;
  awsAccountUsername: string;
  accessKey: string;
  region: string;
}

function formatToTwoDecimals(num: number) {
  const [intPart, decimalPart = ""] = num.toString().split(".");
  const trimmedDecimal = decimalPart.slice(0, 2);
  const formatted = trimmedDecimal
    ? `${intPart}.${trimmedDecimal}`
    : intPart;
  return formatted === "0.00" || formatted === "0.0" || formatted === "-0.0" || formatted === "-0.00" ? "0" : formatted;
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
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <Link
          href={{ pathname: "/aws" }}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] border border-[#1E1E2E] bg-[#0A0B10]/80 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                <Lightbulb className="w-4 h-4" />
                <span className="text-violet-300">Cost Optimization</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">AWS Recommendations</h1>
              <p className="mt-4 text-sm text-zinc-400 sm:text-base">
                Analyze your AWS resources and get AI-powered cost optimization recommendations to reduce your cloud spending.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Generate Recommendations</h2>
              <p className="mt-2 text-sm text-zinc-400">Select an AWS account to analyze resources.</p>
            </div>
          </div>

          {accounts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-zinc-800 bg-[#10121A]/80 p-8 text-center">
              <p className="text-zinc-500 mb-4">No AWS account is connected.</p>
              <Link
                href={{ pathname: "/connect-aws" }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-violet-400"
              >
                Connect AWS Account
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 items-end">
              <div className="min-w-[200px] flex-1 max-w-[300px]">
                <label className="block text-sm font-medium text-zinc-400 mb-2">AWS Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Recommendations
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-8 text-center">
            <p className="text-zinc-400 mb-2">No recommendations yet.</p>
            <p className="text-zinc-500 text-sm">Click "Generate Recommendations" to analyze your AWS resources.</p>
          </div>
        ) : (
          <section className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Optimization Results</h2>
                <p className="text-sm text-zinc-400">{recommendations.length} recommendations found</p>
              </div>
            </div>
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-500/10 px-4 py-4 border border-emerald-500/20">
              <span className="text-lg font-semibold text-white">Total Potential Savings</span>
              <span className="text-2xl font-bold text-emerald-400">
                ${formatToTwoDecimals(totalSavings)}/month
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl border border-zinc-800 bg-[#0F1220] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-violet-300 uppercase tracking-wide">
                        {rec.resourceType}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-sm text-zinc-500">
                        {rec.awsAccountUsername}
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{rec.issue}</p>
                    <p className="text-zinc-400 text-sm">{rec.recommendation}</p>
                    <p className="text-zinc-600 text-xs mt-3 font-mono">
                      {rec.resourceIdentifier}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-500 text-sm">Savings</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      ${formatToTwoDecimals(rec.estimatedSavings)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href="/costs"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-violet-500/20 bg-white/5 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-white/10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Cost Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}