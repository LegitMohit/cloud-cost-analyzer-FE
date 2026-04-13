"use client";

import { useState, useEffect, useRef } from "react";
import { awsApi, type CostData } from "@/lib/api";
import { Loader2, DollarSign, Calendar, PieChart, TrendingUp, ArrowLeft } from "lucide-react";
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

export default function CostsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [costData, setCostData] = useState<CostData | null>(null);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [granularity, setGranularity] = useState<"DAILY" | "MONTHLY" | "HOURLY">("MONTHLY");

  useEffect(() => {
    if (granularity === "HOURLY") {
      const end = new Date(endDate);
      const start = new Date(end);
      start.setDate(start.getDate() - 14);
      setStartDate(start.toISOString().split("T")[0]);
    }
  }, [granularity, endDate]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await awsApi.getConnectedAccounts();
        const accountsData = Array.isArray(response) 
          ? response 
          : (response?.accounts || []);
        setAccounts(accountsData);
        if (accountsData.length > 0) {
          setSelectedAccountId(accountsData[0].id);
        }
      } catch (err: any) {
        console.error("Failed to fetch accounts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  const fetchCosts = async () => {
    if (!selectedAccountId) {
      setError("Please select an AWS account");
      return;
    }
    setFetching(true);
    setError("");
    try {
      const data = await awsApi.getCostAndUsage({
        accountId: selectedAccountId,
        startDate,
        endDate,
        granularity,
      });
      setCostData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cost data");
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
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
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] border border-[#1E1E2E] bg-[#0A0B10]/80 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                <DollarSign className="w-4 h-4" />
                <span className="text-violet-300">Cost Analytics</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Cost Analysis</h1>
              <p className="mt-4 text-sm text-zinc-400 sm:text-base">
                Analyze your AWS spending patterns, view cost breakdowns by service, and optimize your cloud expenses.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Fetch Costs</h2>
              <p className="mt-2 text-sm text-zinc-400">Select AWS account and date range to analyze costs.</p>
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
              <div className="min-w-[200px]">
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
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-zinc-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Granularity</label>
                <select
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value as "DAILY" | "MONTHLY" | "HOURLY")}
                  className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                >
                  <option value="DAILY">Daily</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="HOURLY">Hourly</option>
                </select>
              </div>
              <button
                onClick={fetchCosts}
                disabled={fetching}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-50"
              >
                {fetching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Fetch Costs"
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

        {costData && (
          <section className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Service Breakdown</h2>
                <p className="text-sm text-zinc-400">Costs grouped by AWS service</p>
              </div>
            </div>
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-violet-500/10 px-4 py-4 border border-violet-500/20">
              <span className="text-lg font-semibold text-white">Total Cost</span>
              <span className="text-2xl font-bold text-green-400">
                ${formatToTwoDecimals(costData.totalCost)}
              </span>
            </div>
            {costData.serviceBreakdown.length === 0 ? (
              <div className="text-zinc-500 text-center py-4">No cost data available</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {costData.serviceBreakdown.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl bg-[#0F1220] px-4 py-3"
                  >
                    <span className="text-zinc-300 font-medium truncate">{service.serviceName}</span>
                    <span className="text-white font-semibold whitespace-nowrap">
                      ${formatToTwoDecimals(service.cost)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href={{ pathname: "/recommendations" }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-violet-500/20 bg-white/5 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-white/10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}