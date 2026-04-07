"use client";

import { useState } from "react";
import { awsApi, type CostData } from "@/lib/api";

export default function CostsPage() {
  const [costData, setCostData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(false);
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

  const fetchCosts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await awsApi.getCostAndUsage({ startDate, endDate, granularity });
      setCostData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cost data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Cost Analysis</h1>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Granularity</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as "DAILY" | "MONTHLY" | "HOURLY")}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-white"
            >
              <option value="DAILY">Daily</option>
              <option value="MONTHLY">Monthly</option>
              <option value="HOURLY">Hourly</option>
            </select>
          </div>
          <button
            onClick={fetchCosts}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Fetch Costs"}
          </button>
        </div>
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
              ${costData.totalCost.toFixed(2)}
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
                      ${service.cost.toFixed(2)}
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
