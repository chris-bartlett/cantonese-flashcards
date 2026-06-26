"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    // Simulate sending reset email
    await new Promise((r) => setTimeout(r, 800));
    setMessage(
      "If that email is registered, a password reset link has been sent."
    );
    setBusy(false);
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
          <h2 className="text-lg font-medium mb-2">Reset password</h2>
          <p className="text-sm text-gray-500 mb-5">
            Enter your email and we&apos;ll send you a reset link.
          </p>

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

            {message && <p className="text-green-700 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-lg bg-brand text-white font-medium text-sm hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send reset link"}
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
