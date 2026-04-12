"use client";

import { useState, useEffect } from "react";
import { awsApi, type CostData } from "@/lib/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ConnectedAccount {
  id: string;
  awsAccountUsername: string;
  accessKey: string;
  region: string;
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
        console.log("Connected accounts response:", response);
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
      <div className="container mx-auto max-w-4xl px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Cost Analysis</h1>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">AWS Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              disabled={accounts.length === 0}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white min-w-[200px] disabled:opacity-50"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.awsAccountUsername} ({account.region})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={accounts.length === 0}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={accounts.length === 0}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Granularity</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as "DAILY" | "MONTHLY" | "HOURLY")}
              disabled={accounts.length === 0}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white disabled:opacity-50"
            >
              <option value="DAILY">Daily</option>
              <option value="MONTHLY">Monthly</option>
              <option value="HOURLY">Hourly</option>
            </select>
          </div>
          <button
            onClick={fetchCosts}
            disabled={fetching || accounts.length === 0}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {fetching ? "Loading..." : "Fetch Costs"}
          </button>
        </div>
        
        {accounts.length === 0 && (
          <div className="text-center pt-6">
            <p className="text-red-400">No AWS account is connected.
            <Link
              href={{ pathname: "/connect-aws" }}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Connect here
            </Link>
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      {costData && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Total Cost</h2>
            <p className="text-3xl font-bold text-green-400">
              ${costData.totalCost}
            </p>
            <p className="text-sm text-zinc-400">
              {costData.startDate} to {costData.endDate}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Service Breakdown</h3>
            {costData.serviceBreakdown.length === 0 ? (
              <p className="text-zinc-400">No cost data available</p>
            ) : (
              <div className="space-y-2">
                {costData.serviceBreakdown.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-zinc-800"
                  >
                    <span className="text-zinc-300">{service.serviceName}</span>
                    <span className="text-white font-medium">
                      ${service.cost}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <a href="/" className="text-indigo-400 hover:text-indigo-300 font-medium">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
