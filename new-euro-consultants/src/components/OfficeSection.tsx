"use client";
import Reveal from "./Reveal";
import type { Content } from "@/lib/content";

export default function OfficeSection({ content }: { content: Content }) {
  const { contact } = content;
  return (
    <section id="office" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-1 absolute left-1/4 top-0 h-[380px] w-[380px] rounded-full bg-gold-500 opacity-[0.06] blur-[130px]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Visit Us</p>
          <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
            Our Office in <span className="text-gold-gradient">F-11 Markaz</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/55">
            Walk-ins welcome. Or call ahead — we&apos;ll block a private slot for you.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="glass-strong h-full rounded-[26px] p-8 shadow-card">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-2xl shadow-glow-gold">📍</span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">Address</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-white">{contact.address}</p>
                </div>
              </div>
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-2xl">🕐</span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">Hours</p>
                  <p className="mt-1 text-[15px] text-white">{contact.hours}</p>
                </div>
              </div>
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-2xl">☎️</span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">Phone / WhatsApp</p>
                  <a href={`tel:${contact.phoneRaw}`} className="mt-1 block text-[15px] font-semibold text-white hover:text-gold-300">{contact.phone}</a>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold rounded-full px-6 py-3 text-[13px]">Get Directions →</a>
                <a href={`https://wa.me/${contact.whatsapp}?text=I%20want%20to%20book%20an%20appointment.`} className="btn-ghost rounded-full px-6 py-3 text-[13px] font-semibold text-white">💬 Book Appointment</a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="relative overflow-hidden rounded-[26px] border border-gold-500/25 shadow-glow-gold">
              <iframe
                title="New Euro Consultants — Office Location"
                src={contact.mapsEmbed}
                className="h-[440px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-sapphire-950/90 px-4 py-2 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-500" />
                </span>
                <span className="text-[12px] font-semibold text-white">📍 New Euro Consultants</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
