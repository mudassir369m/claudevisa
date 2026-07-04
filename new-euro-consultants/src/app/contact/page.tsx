"use client";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";

type MinimalContact = {
  phone: string; phoneRaw: string; whatsapp: string; email: string;
  address: string; hours: string; mapsUrl: string; mapsEmbed: string;
};

const FALLBACK: MinimalContact = {
  phone: "+92 314 535 2222",
  phoneRaw: "923145352222",
  whatsapp: "923145352222",
  email: "info@neweuroconsultants.com",
  address: "Office No. 17-18, 1st Floor, Lord Trade Centre, F-11 Markaz, Islamabad",
  hours: "Mon – Fri · 9:00 AM – 4:00 PM",
  mapsUrl: "https://maps.app.goo.gl/VtsZB1DP8oL6PQm38",
  mapsEmbed: "https://www.google.com/maps?q=New+Euro+Consultants,+Lord+Trade+Centre,+Office+17-18,+F-11+Markaz,+Islamabad&t=&z=17&ie=UTF8&iwloc=B&output=embed",
};

export default function ContactPage() {
  const [contact, setContact] = useState<MinimalContact>(FALLBACK);
  const [form, setForm] = useState({ name: "", phone: "", email: "", country: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/public/contact")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setContact({ ...FALLBACK, ...d }); })
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 10) {
      setErr("Please enter your name and a valid phone number.");
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      setStatus("ok");
      setForm({ name: "", phone: "", email: "", country: "", message: "" });
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Contact</p>
        <h1 className="mt-3 text-center font-display text-[clamp(34px,5vw,60px)] font-extrabold tracking-tight text-white">
          Visit Us in <span className="text-gold-gradient">F-11 Markaz</span>
        </h1>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="glass-strong rounded-[26px] p-8">
            <h2 className="font-display text-xl font-bold text-white">Reach Out</h2>
            <ul className="mt-6 space-y-4 text-[14.5px] text-white/70">
              <li className="flex gap-3"><span className="text-gold-400">📍</span> {contact.address}</li>
              <li className="flex gap-3"><span className="text-gold-400">🕐</span> {contact.hours}</li>
              <li className="flex gap-3"><span className="text-gold-400">☎️</span> <a href={`tel:${contact.phoneRaw}`} className="hover:text-white">{contact.phone}</a></li>
              <li className="flex gap-3"><span className="text-gold-400">💬</span> <a href={`https://wa.me/${contact.whatsapp}`} className="text-emerald-400 hover:text-emerald-300">WhatsApp us instantly</a></li>
              <li className="flex gap-3"><span className="text-gold-400">✉️</span> <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
            </ul>
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-7 block h-64 overflow-hidden rounded-2xl border border-gold-500/25 shadow-glow-gold">
              <iframe title="New Euro Consultants — F-11 Markaz Islamabad" src={contact.mapsEmbed} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </a>
          </div>
        </Reveal>

        <Reveal>
          <form onSubmit={submit} className="glass-strong space-y-4 rounded-[26px] p-8">
            <h2 className="font-display text-xl font-bold text-white">Send a Message</h2>
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass w-full rounded-2xl px-5 py-3.5 text-[14.5px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            <input placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="glass w-full rounded-2xl px-5 py-3.5 text-[14.5px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            <input placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="glass w-full rounded-2xl px-5 py-3.5 text-[14.5px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="glass w-full rounded-2xl bg-sapphire-900 px-5 py-3.5 text-[14.5px] text-white outline-none focus:border-gold-500/60">
              <option value="">Interested destination</option>
              <option>United Kingdom</option><option>United States</option><option>Canada</option>
              <option>Australia</option><option>Schengen (Europe)</option><option>Turkey</option>
              <option>Umrah / Saudi Arabia</option><option>Other</option>
            </select>
            <textarea placeholder="Tell us your situation…" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="glass w-full resize-none rounded-2xl px-5 py-3.5 text-[14.5px] text-white placeholder-white/35 outline-none focus:border-gold-500/60" />
            {err && <p className="text-sm text-rose-400">{err}</p>}
            {status === "ok" && <p className="text-sm text-emerald-400">Received. We&apos;ll respond within one working day.</p>}
            {status === "err" && <p className="text-sm text-rose-400">Send failed. Please WhatsApp us at {contact.phone}.</p>}
            <button type="submit" disabled={status === "sending"} className="btn-gold w-full rounded-full px-8 py-4 text-[15px] disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Send Message →"}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
