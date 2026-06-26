"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Fill in all fields.");
      return;
    }
    setBusy(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed.");
      setBusy(false);
      return;
    }

    router.push("/study");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-900 leading-none">
            粵語
          </div>
          <p className="text-brand font-medium mt-2">Cantonese Flashcards</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-5">Sign in</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-brand/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-brand/40 transition-colors"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-lg bg-brand text-white font-medium text-sm hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 flex flex-col gap-2">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Forgot password?
          </Link>
          <p className="text-sm text-gray-500">
            No account?{" "}
            <Link href="/register" className="text-brand font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
