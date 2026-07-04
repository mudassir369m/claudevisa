"use client";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import type { GalleryImage } from "@/lib/content";

export default function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    images.forEach((i) => i.category && set.add(i.category));
    return ["All", ...Array.from(set)];
  }, [images]);

  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered = cat === "All" ? images : images.filter((i) => i.category === cat);

  return (
    <section id="gallery" className="relative bg-sapphire-950/40 py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">
            Destinations Gallery
          </p>
          <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
            Where Our Clients <span className="text-gold-gradient">Fly</span>
          </h2>
        </Reveal>

        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                  cat === c
                    ? "border-gold-500 bg-gold-500/15 text-gold-300 shadow-glow-gold"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-gold-500/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <Reveal stagger className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img)}
              className={`group relative overflow-hidden rounded-[18px] border border-white/10 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-float ${
                i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-sapphire-950/90 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <span className="block font-display text-sm font-bold text-white drop-shadow">
                  {img.caption}
                </span>
                <span className="mt-0.5 block text-[11px] uppercase tracking-widest text-gold-300">
                  {img.category}
                </span>
              </span>
            </button>
          ))}
        </Reveal>
      </div>

      {/* lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            ✕
          </button>
          <div
            className="relative max-h-[90vh] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.caption}
              className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-float"
            />
            <p className="mt-4 text-center font-display text-lg font-semibold text-white">
              {lightbox.caption}
              <span className="ml-3 text-[12px] uppercase tracking-widest text-gold-300">
                {lightbox.category}
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
