"use client";
import { useState, useTransition } from "react";
import type { Lead } from "@/lib/leads";
import { deleteLeadAction } from "../actions";

export default function LeadsTable({ leads: initial }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState<"all" | "contact" | "eligibility">("all");
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.source !== filter) return false;
    if (q && !`${l.name} ${l.phone} ${l.email ?? ""} ${l.country ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function del(id: string) {
    if (!confirm("Delete this lead?")) return;
    startTransition(async () => {
      await deleteLeadAction(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    });
  }

  function exportCsv() {
    const header = "When,Source,Name,Phone,Email,Country,Score,Message";
    const rows = filtered.map((l) =>
      [l.createdAt, l.source, l.name, l.phone, l.email ?? "", l.country ?? "", l.score ?? "", (l.message ?? "").replace(/[\r\n,]/g, " ")]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="glass flex overflow-hidden rounded-full">
          {(["all", "contact", "eligibility"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition ${
                filter === f ? "bg-gold-500/20 text-gold-300" : "text-white/50 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          placeholder="Search name / phone / email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="glass ml-auto w-64 rounded-full px-5 py-2 text-[13px] text-white outline-none focus:border-gold-500/60"
        />
        <button onClick={exportCsv} className="btn-ghost rounded-full px-5 py-2 text-[13px] font-semibold text-white">Export CSV</button>
      </div>

      <div className="glass-strong overflow-hidden rounded-[22px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-white/45">
            <tr>
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Country / Score</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-16 text-center text-white/45">No leads match.</td></tr>
            )}
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-white/5 text-white/70 transition hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-xs text-white/45">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${l.source === "eligibility" ? "bg-gold-500/15 text-gold-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                    {l.source}
                  </span>
                </td>
                <td className="px-5 py-4 text-white">
                  <div className="font-semibold">{l.name}</div>
                  {l.email && <div className="text-[11px] text-white/40">{l.email}</div>}
                </td>
                <td className="px-5 py-4">{l.phone}</td>
                <td className="px-5 py-4">
                  {l.country ? l.country : l.score != null ? <span className="font-semibold text-gold-300">Score {l.score}</span> : "—"}
                  {l.message && <div className="mt-1 max-w-xs truncate text-[11px] text-white/40" title={l.message}>{l.message}</div>}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <a
                      href={`https://wa.me/${l.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-emerald-500/40 px-3 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10"
                    >WhatsApp</a>
                    <a
                      href={`tel:${l.phone.replace(/\D/g, "")}`}
                      className="rounded-full border border-sky-500/40 px-3 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
                    >Call</a>
                    <button
                      onClick={() => del(l.id)}
                      disabled={pending}
                      className="rounded-full border border-rose-500/40 px-3 py-1 text-[11px] text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
                    >Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
