"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError("Fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed.");
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
          <h2 className="text-lg font-medium mb-5">Create account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-brand/40 transition-colors"
              />
            </div>
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
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
