"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/components/userProvider";

const setAuthCookie = (token: string) => {
    document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
};

function LoginForm() {
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useUser();
    const registered = searchParams?.get("registered");
    const redirectParam = searchParams?.get("redirect") || "/";
    const redirectTo = redirectParam.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (registered) {
            setMessage("Registration successful! You can now log in.");
        }
    }, [registered]);

    useEffect(() => {
        if (!authLoading && user) {
            window.location.href = redirectTo;
        }
    }, [authLoading, user, redirectTo]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid login credentials");
            }

            localStorage.setItem("token", data.token);
            setAuthCookie(data.token);
            window.location.href = redirectTo;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#0A0A0F] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111218]/80 p-8 shadow-xl shadow-violet-500/10 my-10">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome Back</h1>
                        <p className="mt-2 text-sm text-zinc-400">Log in to your Cloud Vento account</p>
                    </div>

                    {message && (
                        <div className="mb-6 rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full rounded-2xl border border-zinc-700 bg-[#12151F] px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-400">
                        Don't have an account?{" "}
                        <a href="/signup" className="font-semibold text-violet-200 hover:text-violet-100 transition-colors">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
