import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth";
import { readLeads } from "@/lib/leads";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const email = getSessionEmail();
  if (!email) redirect("/admin/login");
  const [leads, content] = await Promise.all([readLeads(), getContent()]);
  const today = new Date().toISOString().slice(0, 10);
  const kpis = [
    { l: "Total Leads", v: leads.length },
    { l: "Leads Today", v: leads.filter((x) => x.createdAt.startsWith(today)).length },
    { l: "Countries", v: content.countries.length },
    { l: "Tours", v: content.tours.length },
    { l: "Videos", v: content.videos.length },
    { l: "Gallery", v: content.gallery.length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold-400">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">Signed in as {email}</p>
        </div>
        <form
          action="/api/admin/login"
          method="post"
          className="text-sm text-white/50"
        >
          <button
            formMethod="delete"
            formAction="/api/admin/login"
            className="hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.l} className="glass rounded-2xl p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">{k.l}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-gold-gradient">{k.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/content" className="glass-strong group flex items-center justify-between rounded-2xl p-6 transition hover:shadow-glow-gold">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">A–Z Editor</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Content Manager</h2>
            <p className="mt-1 text-sm text-white/50">Edit announcement, hero, videos, tours, countries, FAQs, contact — everything.</p>
          </div>
          <span className="text-3xl text-gold-400 transition-transform group-hover:translate-x-1">→</span>
        </Link>
        <Link href="/admin/leads" className="glass-strong group flex items-center justify-between rounded-2xl p-6 transition hover:shadow-glow-gold">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">Inbox</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Leads ({leads.length})</h2>
            <p className="mt-1 text-sm text-white/50">Contact form + eligibility submissions with WhatsApp shortcuts.</p>
          </div>
          <span className="text-3xl text-gold-400 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="mt-8 glass-strong overflow-hidden rounded-[22px]">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-white">Recent Leads</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-white/45">
            <tr>
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Country / Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-white/45">No leads yet.</td></tr>
            )}
            {leads.slice(0, 8).map((l) => (
              <tr key={l.id} className="border-b border-white/5 text-white/70">
                <td className="px-5 py-3 text-xs text-white/45">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${l.source === "eligibility" ? "bg-gold-500/15 text-gold-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                    {l.source}
                  </span>
                </td>
                <td className="px-5 py-3 text-white">{l.name}</td>
                <td className="px-5 py-3">{l.phone}</td>
                <td className="px-5 py-3">{l.country ? l.country : l.score != null ? `Score ${l.score}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
