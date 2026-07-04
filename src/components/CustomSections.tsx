import Link from "next/link";
import Reveal from "./Reveal";
import type { Content, CustomSection } from "@/lib/content";

const accents: Record<CustomSection["accent"], string> = {
  gold: "from-gold-500/12 via-transparent to-gold-500/6",
  sapphire: "from-[#5B8DEF]/12 via-transparent to-[#5B8DEF]/6",
  emerald: "from-emerald-500/12 via-transparent to-emerald-500/6",
};

function BlockCentered({ s }: { s: CustomSection }) {
  return (
    <section className={`relative overflow-hidden py-24 bg-gradient-to-br ${accents[s.accent]}`}>
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        {s.subtitle && (
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">{s.subtitle}</p>
        )}
        <h2 className="mt-3 font-display text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight text-white">
          {s.title}
        </h2>
        <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-white/65">
          {s.body.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {s.imageUrl && (
          <img src={s.imageUrl} alt="" className="mx-auto mt-8 max-h-96 rounded-2xl border border-white/10 shadow-card" />
        )}
        {s.ctaText && s.ctaLink && (
          <Link href={s.ctaLink} className="btn-gold mt-8 inline-block rounded-full px-8 py-3.5 text-[14px]">
            {s.ctaText} →
          </Link>
        )}
      </Reveal>
    </section>
  );
}

function BlockSideBySide({ s }: { s: CustomSection }) {
  const reverse = s.layout === "image-right";
  return (
    <section className={`relative overflow-hidden py-24 bg-gradient-to-br ${accents[s.accent]}`}>
      <div className={`relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal>
          {s.imageUrl ? (
            <img
              src={s.imageUrl}
              alt=""
              className="w-full rounded-[26px] border border-white/10 object-cover shadow-float"
            />
          ) : (
            <div className="aspect-video w-full rounded-[26px] border border-white/10 bg-gradient-to-br from-sapphire-800 to-sapphire-950" />
          )}
        </Reveal>
        <Reveal>
          {s.subtitle && (
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">{s.subtitle}</p>
          )}
          <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-tight text-white">
            {s.title}
          </h2>
          <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-white/65">
            {s.body.split(/\n\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {s.ctaText && s.ctaLink && (
            <Link href={s.ctaLink} className="btn-gold mt-8 inline-block rounded-full px-8 py-3.5 text-[14px]">
              {s.ctaText} →
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default function CustomSections({ content }: { content: Content }) {
  const active = content.customSections.filter((s) => s.enabled);
  if (!active.length) return null;
  return (
    <>
      {active.map((s) => (
        <div key={s.id}>
          {s.layout === "centered" ? <BlockCentered s={s} /> : <BlockSideBySide s={s} />}
        </div>
      ))}
    </>
  );
}
