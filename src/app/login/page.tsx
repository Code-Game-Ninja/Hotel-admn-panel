"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid email or password");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-none mb-4">
                        <KeyRound className="w-7 h-7 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Grand Horizon</h1>
                    <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>
                </div>

                {/* Login Card */}
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-400 font-medium flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
                            placeholder="admin@grandhorizon.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-400 font-medium flex items-center gap-2">
                            <Lock className="w-3 h-3" /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 text-sm uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                        Protected area. Authorized personnel only.
                    </p>
                </form>
            </div>
        </div>
    );
}
