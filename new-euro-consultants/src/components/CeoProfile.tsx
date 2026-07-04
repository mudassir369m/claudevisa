import Reveal from "./Reveal";
import type { Content, CeoProfile } from "@/lib/content";

const socialIcons: Record<keyof CeoProfile["socials"], { label: string; color: string }> = {
  instagram: { label: "IG", color: "bg-gradient-to-tr from-fuchsia-500 to-orange-400" },
  facebook: { label: "f", color: "bg-[#1877F2]" },
  tiktok: { label: "TT", color: "bg-black" },
  youtube: { label: "YT", color: "bg-[#FF0000]" },
};

export default function CeoProfileSection({ content }: { content: Content }) {
  const { ceo } = content;
  const initials = ceo.name.split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  return (
    <section id="ceo" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-1 absolute -left-24 top-10 h-[480px] w-[480px] rounded-full bg-gold-500 opacity-[0.07] blur-[140px]" />
        <div className="aurora-2 absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[#5B8DEF] opacity-[0.08] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">
            Meet Our Founder
          </p>
          <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
            The Man Behind <span className="text-gold-gradient">New Euro</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-center lg:gap-16">
          {/* Photo */}
          <Reveal>
            <div className="relative mx-auto max-w-[420px]">
              {/* animated gold ring */}
              <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-gold-500/40 via-transparent to-[#5B8DEF]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border-2 border-gold-500/40 shadow-float">
                {ceo.photo ? (
                  <img
                    src={ceo.photo}
                    alt={ceo.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full flex-col items-center justify-center bg-gradient-to-br from-sapphire-800 to-sapphire-950">
                    <span className="font-display text-[100px] font-extrabold text-gold-gradient">
                      {initials}
                    </span>
                    <span className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/40">
                      Upload photo in admin
                    </span>
                  </div>
                )}
                {/* corner badge */}
                <div className="absolute left-4 top-4 rounded-full border border-gold-500/60 bg-sapphire-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300 backdrop-blur">
                  CEO
                </div>
                {/* bottom shimmer overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sapphire-950/95 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-2xl font-bold text-white">{ceo.name}</p>
                  <p className="text-[12px] text-gold-300">{ceo.role}</p>
                </div>
              </div>

              {/* reach chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[12px]">
                  <span className="text-fuchsia-400">◉</span>
                  <span className="font-semibold text-white">{ceo.reachInstagram}</span>
                  <span className="text-white/45">Instagram</span>
                </div>
                <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[12px]">
                  <span className="text-[#1877F2]">f</span>
                  <span className="font-semibold text-white">{ceo.reachFacebook}</span>
                  <span className="text-white/45">Facebook</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-gold-400">
              Since {ceo.since}
            </p>
            <h3 className="mt-3 font-display text-[clamp(24px,3vw,38px)] font-bold leading-tight text-white">
              {ceo.tagline}
            </h3>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/65">{ceo.bio}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ceo.highlights.map((h, i) => (
                <div key={i} className="glass flex items-start gap-3 rounded-xl px-4 py-3 text-[13px] text-white/75">
                  <span className="mt-0.5 text-gold-400">✦</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {ceo.quote && (
              <blockquote className="mt-8 border-l-2 border-gold-500 pl-5 text-[15px] italic leading-relaxed text-white/75">
                &ldquo;{ceo.quote}&rdquo;
                <footer className="mt-2 not-italic text-[12px] uppercase tracking-widest text-gold-400">
                  — {ceo.name}
                </footer>
              </blockquote>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {(Object.keys(ceo.socials) as (keyof CeoProfile["socials"])[]).map((k) => {
                const conf = socialIcons[k];
                const href = ceo.socials[k];
                if (!href) return null;
                return (
                  <a
                    key={k}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white shadow-card transition-transform hover:scale-105 ${conf.color}`}
                  >
                    <span className="font-bold">{conf.label}</span>
                    <span className="opacity-90 capitalize">{k}</span>
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
