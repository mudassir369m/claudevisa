"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (r.ok) router.push("/admin");
    else setErr("Invalid credentials");
  }

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md items-center px-6">
      <form onSubmit={submit} className="glass-strong w-full space-y-4 rounded-[26px] p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold-400">Admin</p>
        <h1 className="font-display text-2xl font-bold text-white">Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="glass w-full rounded-2xl px-5 py-3.5 text-white outline-none focus:border-gold-500/60"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="glass w-full rounded-2xl px-5 py-3.5 text-white outline-none focus:border-gold-500/60"
        />
        {err && <p className="text-sm text-rose-400">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn-gold w-full rounded-full px-8 py-4 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}
