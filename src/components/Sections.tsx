"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import type { Content } from "@/lib/content";

const Passport3D = dynamic(() => import("./Passport3D"), { ssr: false });
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export function Services({ content }: { content: Content }) {
  return (
    <section id="services" className="relative bg-sapphire-900/40 py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Complete Travel</p>
          <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
            Beyond Visas — <span className="text-gold-gradient">One Office, Everything</span>
          </h2>
        </Reveal>
        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.services.map((s) => (
            <Tilt key={s.slug} className="glass group rounded-[22px] p-7">
              <div className="tilt-inner">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/12 text-3xl shadow-glow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{s.icon}</span>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">{s.desc}</p>
                <span className="mt-4 inline-block text-[13px] font-semibold text-gold-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Learn more →
                </span>
              </div>
            </Tilt>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Process({ content }: { content: Content }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <Reveal>
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">The Process</p>
        <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
          Visa Approved in <span className="text-gold-gradient">4 Simple Steps</span>
        </h2>
      </Reveal>
      <div className="relative mt-16 grid gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal stagger className="relative space-y-10">
          <span className="absolute left-[27px] top-4 hidden h-[calc(100%-40px)] w-px bg-gradient-to-b from-gold-500 via-gold-500/40 to-transparent lg:block" />
          {content.processSteps.map((p) => (
            <div key={p.n} className="relative flex gap-6">
              <span className="glass relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-lg font-extrabold text-gold-gradient shadow-glow-gold">{p.n}</span>
              <div>
                <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-white/60">{p.desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal className="flex items-center justify-center">
          <div className="relative h-[420px] w-full max-w-[380px]">
            <Passport3D />
            <Reveal className="absolute -right-4 top-4 z-10">
              <span className="stamp inline-block rounded-lg px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-[0.2em]">Approved</span>
            </Reveal>
            <div className="pointer-events-none absolute -bottom-8 left-1/2 h-6 w-52 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Tours({ content }: { content: Content }) {
  const { tours, contact } = content;
  return (
    <section className="bg-sapphire-900/40 py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Travel & Tours</p>
            <h2 className="mt-3 font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
              Curated <span className="text-gold-gradient">Experiences</span>
            </h2>
          </div>
          <Link href="/tours" className="btn-ghost rounded-full px-6 py-3 text-sm font-semibold text-white">View all packages →</Link>
        </Reveal>
        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((t) => (
            <Tilt key={t.slug} className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-b ${t.gradient} glass p-6`}>
              <div className="tilt-inner flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">{t.emoji}</span>
                  <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300">{t.tag}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug text-white">{t.title}</h3>
                <p className="mt-1.5 text-[12.5px] text-white/50">{t.days} Days · {t.nights} Nights</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {t.includes.slice(0, 4).map((i) => (
                    <li key={i} className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-white/70">{i}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between pt-5">
                  <div>
                    {t.old && <p className="text-[11.5px] text-white/40 line-through">{t.old}</p>}
                    <p className="font-display text-lg font-extrabold text-gold-gradient">{t.price}</p>
                  </div>
                  <a
                    href={`https://wa.me/${contact.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(t.title)}`}
                    className="rounded-full border border-gold-500/40 px-4 py-2 text-[12px] font-semibold text-gold-300 transition hover:bg-gold-500/10"
                  >
                    Book →
                  </a>
                </div>
              </div>
            </Tilt>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Testimonials({ content }: { content: Content }) {
  return (
    <section id="stories" className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <Reveal>
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Success Stories</p>
        <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
          Real Visas. <span className="text-gold-gradient">Real People.</span>
        </h2>
      </Reveal>
      <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.testimonials.map((t, i) => (
          <div key={i} className="glass group relative overflow-hidden rounded-[22px] p-7 transition-all duration-500 hover:shadow-float hover:-translate-y-1">
            <span className="stamp absolute right-5 top-5 rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em]">Approved</span>
            <div className="flex gap-1 text-gold-400">
              {Array.from({ length: t.rating }).map((_, i) => (<span key={i}>★</span>))}
            </div>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 font-display text-sm font-bold text-gold-300">{t.name[0]}</span>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-[12px] text-white/45">{t.country}</p>
              </div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function FAQ({ content }: { content: Content }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-sapphire-900/40 py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-white">
            Questions, <span className="text-gold-gradient">Answered</span>
          </h2>
        </Reveal>
        <Reveal stagger className="mt-12 space-y-3">
          {content.faqs.map((f, i) => (
            <div key={i} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-[15px] font-semibold text-white">{f.q}</span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className="grid transition-all duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-[14px] leading-relaxed text-white/60">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCTA({ content }: { content: Content }) {
  const { contact } = content;
  return (
    <section className="relative overflow-hidden py-32 noise">
      <ParticleField count={700} />
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-1 absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-gold-500 opacity-[0.08] blur-[120px]" />
        <div className="aurora-2 absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#5B8DEF] opacity-[0.10] blur-[120px]" />
      </div>
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-[clamp(36px,5vw,64px)] font-extrabold tracking-tight text-white">
          Ready to <span className="text-shimmer">Take Off?</span>
        </h2>
        <p className="mt-5 text-lg text-white/60">Get your free eligibility check today. Honest assessment, zero commitment.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/eligibility" className="btn-gold rounded-full px-9 py-4 text-[15px]">Start My Application →</Link>
          <a href={`tel:${contact.phoneRaw}`} className="btn-ghost rounded-full px-8 py-4 text-[15px] font-semibold text-white">📞 {contact.phone}</a>
        </div>
        <p className="mt-8 text-[12.5px] text-white/35">{contact.address} · {contact.hours}</p>
      </Reveal>
    </section>
  );
}
