import Reveal from "./Reveal";
import type { Content } from "@/lib/content";

export default function TrustBadges({ content }: { content: Content }) {
  return (
    <section className="relative border-y border-white/[0.06] bg-sapphire-950/60 py-10">
      <Reveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-6 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
          {content.trustBadges.map((b, i) => (
            <div key={i} className="group flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xl transition-all duration-500 group-hover:border-gold-500/40 group-hover:bg-gold-500/8 group-hover:shadow-glow-gold">
                {b.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-white">{b.title}</p>
                <p className="truncate text-[11px] text-white/45">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
