"use client";
import { useRef } from "react";

export default function BoardingPass({
  from = "ISB",
  to,
  passenger,
  gate = "B7",
  seat = "12A",
}: {
  from?: string;
  to: string;
  passenger: string;
  gate?: string;
  seat?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${px * 14}deg) rotateX(${-py * 10}deg) translateZ(0)`;
  }
  function onLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateY(-6deg) rotateX(4deg) translateZ(0)";
  }

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative flex overflow-hidden rounded-2xl shadow-float transition-transform duration-500 will-change-transform"
        style={{
          transform: "perspective(1200px) rotateY(-6deg) rotateX(4deg)",
          background:
            "linear-gradient(135deg,#0f2647 0%,#1e4685 55%,#0a1a33 100%)",
          border: "1px solid rgba(212,175,55,0.35)",
        }}
      >
        {/* main stub */}
        <div className="relative flex-1 p-6 text-white">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-gold-300">
            <span>Boarding Pass</span>
            <span>NE ✈</span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div>
              <p className="text-[10px] uppercase text-white/50">From</p>
              <p className="font-display text-3xl font-extrabold text-white">{from}</p>
            </div>
            <div className="flex-1 border-t border-dashed border-white/30 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">✈</span>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/50">To</p>
              <p className="font-display text-3xl font-extrabold text-gold-gradient">{to}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-[11px]">
            <div>
              <p className="uppercase text-white/40">Passenger</p>
              <p className="mt-1 font-semibold text-white">{passenger}</p>
            </div>
            <div>
              <p className="uppercase text-white/40">Gate</p>
              <p className="mt-1 font-semibold text-white">{gate}</p>
            </div>
            <div>
              <p className="uppercase text-white/40">Seat</p>
              <p className="mt-1 font-semibold text-white">{seat}</p>
            </div>
          </div>
        </div>

        {/* perforation */}
        <div
          className="relative w-4 shrink-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, transparent 3px, rgba(212,175,55,0.3) 3.5px, transparent 4px)",
            backgroundSize: "8px 12px",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "center",
          }}
        />

        {/* barcode stub */}
        <div className="flex w-24 flex-col items-center justify-center gap-3 bg-black/25 p-4">
          <p className="text-[9px] uppercase tracking-widest text-gold-300">Stub</p>
          <div
            className="h-14 w-14"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,#F0D78A 0 2px,transparent 2px 4px,#F0D78A 4px 5px,transparent 5px 7px)",
            }}
          />
          <p className="text-[9px] uppercase tracking-widest text-white/60">{seat}</p>
        </div>
      </div>
    </div>
  );
}
