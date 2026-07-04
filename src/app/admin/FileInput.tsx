"use client";
import { useRef, useState } from "react";

type Kind = "image" | "video" | "any";

export default function FileInput({
  label,
  value,
  onChange,
  kind = "image",
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind?: Kind;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const accept =
    kind === "image" ? "image/*" : kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*,video/*";

  async function handle(file: File) {
    setErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isVideo = /\.(mp4|webm|mov)$/i.test(value);
  const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(value) || value.startsWith("http");

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{label}</span>

      <div className="glass rounded-xl p-3">
        {value && (
          <div className="mb-3 overflow-hidden rounded-lg border border-white/10 bg-black/40">
            {isVideo ? (
              <video src={value} controls className="max-h-48 w-full object-contain" />
            ) : isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="preview" className="max-h-48 w-full object-contain" />
            ) : null}
            <p className="truncate px-3 py-2 text-[11px] text-white/40">{value}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handle(f);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[12px] font-semibold text-gold-300 hover:bg-gold-500/20 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "📤 Upload file"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full border border-rose-500/40 px-3 py-1.5 text-[12px] text-rose-300 hover:bg-rose-500/10"
            >
              Clear
            </button>
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste a URL"
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white placeholder-white/30 outline-none focus:border-gold-500/60"
        />
      </div>

      {hint && <p className="mt-1 text-[11px] text-white/40">{hint}</p>}
      {err && <p className="mt-1 text-[12px] text-rose-400">{err}</p>}
    </div>
  );
}
