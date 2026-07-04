import Link from "next/link";
import Reveal from "./Reveal";
import WavingFlag from "./WavingFlag";
import type { Content } from "@/lib/content";

export default function Countries({ content }: { content: Content }) {
  return (
    <section id="countries" className="relative mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <Reveal>
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Destinations</p>
        <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
          Your Destination, <span className="text-gold-gradient">Our Expertise</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-white/55">
          Specialized visa pathways. Hover any card to see what&apos;s inside the file we build for you.
        </p>
      </Reveal>

      <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.countries.map((c) => (
          <div key={c.slug} className="flip h-[340px]">
            <div className="flip-inner h-full w-full">
              <div className={`flip-face glass overflow-hidden rounded-[22px] bg-gradient-to-br ${c.gradient} p-7`}>
                <WavingFlag emoji={c.flag} />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <span className="text-5xl drop-shadow-lg">{c.flag}</span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-white">{c.name}</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.visaTypes.slice(0, 3).map((v) => (
                        <span key={v} className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur">{v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-[12px] text-white/70">
                      <p>⏱ {c.processing}</p>
                      <p className="mt-1">✅ {c.success} success rate</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-white/50">Hover ↻</span>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              </div>
              <div className="flip-face flip-back glass-strong rounded-[22px] p-7">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">Inside your file</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/75">{c.blurb}</p>
                    <ul className="mt-4 space-y-1.5 text-[12.5px] text-white/60">
                      {c.eligibility.slice(0, 3).map((e) => (
                        <li key={e} className="flex gap-2"><span className="text-gold-400">✦</span> {e}</li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/visa/${c.slug}`} className="btn-gold mt-4 rounded-full px-5 py-2.5 text-center text-[13px]">
                    View {c.name} Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
