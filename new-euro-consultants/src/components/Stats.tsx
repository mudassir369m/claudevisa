"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1600;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 4);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats({ content }: { content: Content }) {
  return (
    <section className="relative border-y border-white/10 bg-sapphire-900/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px lg:grid-cols-4">
        {content.stats.map((s, i) => (
          <div
            key={`${s.label}-${i}`}
            className="group relative flex flex-col items-center gap-1.5 px-6 py-12 text-center transition-colors duration-500 hover:bg-white/[0.03]"
          >
            <span className="font-display text-4xl font-extrabold text-gold-gradient lg:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </span>
            <span className="text-[13px] uppercase tracking-[0.16em] text-white/50">{s.label}</span>
            <span className="mt-2 h-0.5 w-8 bg-gold-500/40 transition-all duration-500 group-hover:w-16 group-hover:bg-gold-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
