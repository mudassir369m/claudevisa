"use client";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import type { VideoItem } from "@/lib/content";

export default function VideoGallery({ videos }: { videos: VideoItem[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => v.category && set.add(v.category));
    return ["All", ...Array.from(set)];
  }, [videos]);

  const [cat, setCat] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);

  const filtered = cat === "All" ? videos : videos.filter((v) => v.category === cat);
  if (!filtered.length) return null;

  return (
    <section id="videos" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">
            Watch & Learn
          </p>
          <h2 className="mt-3 text-center font-display text-[clamp(30px,4vw,52px)] font-extrabold tracking-tight text-white">
            Knowledge <span className="text-gold-gradient">Videos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/55">
            Interview tips, document checklists and real client journeys — straight from our office.
          </p>
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

        <Reveal stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => {
            const isFile = !!v.fileUrl;
            const thumb = v.thumbnail || (v.youtubeId ? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg` : "");
            return (
              <div key={v.id} className="group glass overflow-hidden rounded-[22px] transition-all duration-500 hover:shadow-float hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-black">
                  {playing === v.id ? (
                    isFile ? (
                      <video
                        src={v.fileUrl}
                        controls
                        autoPlay
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : v.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                        className="absolute inset-0 h-full w-full"
                        title={v.title}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    ) : null
                  ) : (
                    <button
                      onClick={() => setPlaying(v.id)}
                      className="group/btn absolute inset-0 h-full w-full"
                      aria-label={`Play ${v.title}`}
                    >
                      {thumb ? (
                        <img src={thumb} alt={v.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-sapphire-800 to-sapphire-950" />
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-sapphire-950/80 via-transparent to-transparent" />
                      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 shadow-glow-gold transition-transform duration-300 group-hover/btn:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-sapphire-950">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      {v.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-300 backdrop-blur">
                          {v.category}
                        </span>
                      )}
                      {isFile && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200 backdrop-blur">
                          Direct
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 font-display text-[15px] font-bold text-white">{v.title}</h3>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
