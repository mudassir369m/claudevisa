import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth";
import { readLeads } from "@/lib/leads";
import LeadsTable from "./LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  if (!getSessionEmail()) redirect("/admin/login");
  const leads = await readLeads();
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold-400">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Leads Inbox</h1>
          <p className="mt-1 text-sm text-white/50">{leads.length} total</p>
        </div>
        <Link href="/admin" className="btn-ghost rounded-full px-5 py-2.5 text-[13px] font-semibold text-white">← Dashboard</Link>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
