"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { awsApi } from "@/lib/api";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await awsApi.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Change Password
          </h1>
          <p className="text-zinc-400">Update your Cloud Vento password</p>
        </div>

        <div className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111118]/80 p-8 shadow-xl shadow-violet-500/10">
          {success && (
            <div className="mb-6 rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400">
              Password changed successfully! Redirecting to home...
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#1E1E2E] bg-[#0D1019]/90 px-4 py-3.5 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#1E1E2E] bg-[#0D1019]/90 px-4 py-3.5 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#1E1E2E] bg-[#0D1019]/90 px-4 py-3.5 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-400">
            Want to go back?{" "}
            <a
              href="/login"
              className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
