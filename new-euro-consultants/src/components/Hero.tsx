"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Content } from "@/lib/content";

const HeroGlobe = dynamic(() => import("./HeroGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full border border-gold-500/30" />
    </div>
  ),
});

export default function Hero({ content }: { content: Content }) {
  const { hero, contact } = content;
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden noise">
      {/* optional background media */}
      {hero.backgroundVideoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={hero.backgroundImageUrl}
        />
      ) : hero.backgroundImageUrl ? (
        <img
          src={hero.backgroundImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {(hero.backgroundVideoUrl || hero.backgroundImageUrl) && (
        <div className="absolute inset-0 bg-gradient-to-b from-sapphire-950/85 via-sapphire-950/60 to-sapphire-950/95" />
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-1 absolute -left-40 top-10 h-[560px] w-[560px] rounded-full bg-[#5B8DEF] opacity-[0.13] blur-[130px]" />
        <div className="aurora-2 absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-[#A78BFA] opacity-[0.10] blur-[130px]" />
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold-500 opacity-[0.06] blur-[150px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-24 pt-16 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
            {hero.preHeadline}
          </p>

          <h1 className="font-display text-[clamp(44px,7vw,96px)] font-extrabold leading-[0.98] tracking-tight text-white">
            {hero.headlineWords.map((w, i) => (
              <span key={`${w}-${i}`} className="word-mask mr-[0.22em]">
                <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{w}</span>
              </span>
            ))}
            <br />
            <span className="word-mask">
              <span style={{ animationDelay: `${0.15 + hero.headlineWords.length * 0.12 + 0.1}s` }} className="text-shimmer">
                {hero.headlineAccent}
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/65">{hero.subhead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={hero.ctaPrimaryLink} className="btn-gold group rounded-full px-8 py-4 text-[15px]">
              {hero.ctaPrimary}
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
            <a
              href={hero.ctaSecondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold text-white"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              {hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/50">
            {hero.trustStrip.map((t, i) => (
              <span key={i} className="flex items-center gap-4">
                <span>{t}</span>
                {i < hero.trustStrip.length - 1 && <span className="hidden h-3 w-px bg-white/15 sm:block" />}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto h-[380px] w-full max-w-[520px] sm:h-[460px] lg:h-[560px]">
          <HeroGlobe />
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/30">
            Pakistan → The World
          </p>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
          <div className="scroll-dot h-2 w-1 rounded-full bg-gold-400" />
        </div>
      </div>
    </section>
  );
}
