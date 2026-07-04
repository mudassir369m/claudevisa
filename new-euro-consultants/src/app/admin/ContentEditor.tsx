"use client";
import { useState, useTransition } from "react";
import type { Content } from "@/lib/content";
import { saveContentAction, resetContentAction } from "./actions";
import FileInput from "./FileInput";

type Tab =
  | "announcement" | "hero" | "trustBadges" | "stats" | "countries"
  | "services" | "processSteps" | "tours" | "testimonials" | "videos"
  | "gallery" | "ceo" | "customSections" | "faqs" | "contact" | "raw";

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "announcement", label: "Announcement Bar", hint: "Top marquee items" },
  { id: "hero", label: "Hero", hint: "Homepage headline + CTAs + background" },
  { id: "trustBadges", label: "Trust Badges", hint: "Trust strip under hero" },
  { id: "stats", label: "Stats", hint: "18+ years, 5000+ visas, etc." },
  { id: "countries", label: "Countries", hint: "Visa destinations & details" },
  { id: "services", label: "Services", hint: "Air, hotel, insurance, tours" },
  { id: "processSteps", label: "Process", hint: "How it works — 4 steps" },
  { id: "ceo", label: "CEO Profile", hint: "S. Mustafa profile section" },
  { id: "tours", label: "Tours", hint: "Tour packages" },
  { id: "testimonials", label: "Testimonials", hint: "Client reviews" },
  { id: "videos", label: "Videos", hint: "Upload or YouTube link" },
  { id: "gallery", label: "Gallery", hint: "Upload or paste image URL" },
  { id: "customSections", label: "Custom Sections", hint: "Add your own homepage sections" },
  { id: "faqs", label: "FAQs", hint: "Homepage FAQs" },
  { id: "contact", label: "Contact & Social", hint: "Phone, address, map, socials" },
  { id: "raw", label: "Raw JSON", hint: "Advanced full edit" },
];

export default function ContentEditor({ initial }: { initial: Content }) {
  const [content, setContent] = useState<Content>(initial);
  const [tab, setTab] = useState<Tab>("announcement");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function save() {
    setMsg(null);
    const json = JSON.stringify(content);
    startTransition(async () => {
      const res = await saveContentAction(json);
      setMsg({ ok: res.ok, text: res.ok ? "Saved ✓ Changes are live." : `Save failed: ${res.error}` });
      setTimeout(() => setMsg(null), 5000);
    });
  }

  function reset() {
    if (!confirm("Reset ALL content to defaults? This cannot be undone.")) return;
    startTransition(async () => {
      await resetContentAction();
      window.location.reload();
    });
  }

  function set<K extends keyof Content>(key: K, value: Content[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold-400">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Content Manager</h1>
          <p className="mt-1 text-sm text-white/50">Edit every section of the website. Changes go live instantly.</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/leads" className="btn-ghost rounded-full px-5 py-2.5 text-[13px] font-semibold text-white">Leads Inbox →</a>
          <button onClick={reset} className="rounded-full border border-rose-500/40 px-5 py-2.5 text-[13px] font-semibold text-rose-300 transition hover:bg-rose-500/10">Reset</button>
          <button onClick={save} disabled={pending} className="btn-gold rounded-full px-6 py-2.5 text-[13px] disabled:opacity-60">
            {pending ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`mb-6 rounded-2xl px-5 py-3 text-sm ${msg.ok ? "bg-emerald-500/12 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/12 text-rose-300 border border-rose-500/30"}`}>
          {msg.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* tabs */}
        <nav className="glass-strong h-fit rounded-2xl p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                tab === t.id ? "bg-gold-500/15 text-gold-300" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="block font-semibold">{t.label}</span>
              <span className="block text-[11px] text-white/40">{t.hint}</span>
            </button>
          ))}
        </nav>

        <div className="glass-strong rounded-2xl p-6">
          {tab === "announcement" && <AnnouncementEditor value={content.announcement} onChange={(v) => set("announcement", v)} />}
          {tab === "hero" && <HeroEditor value={content.hero} onChange={(v) => set("hero", v)} />}
          {tab === "trustBadges" && (
            <ListEditor
              title="Trust Badges" items={content.trustBadges}
              onChange={(v) => set("trustBadges", v)}
              template={{ icon: "✨", title: "New Badge", sub: "Short description" }}
              fields={[
                { key: "icon", label: "Icon (emoji)", type: "text", size: "sm" },
                { key: "title", label: "Title", type: "text" },
                { key: "sub", label: "Subtitle", type: "text" },
              ]}
            />
          )}
          {tab === "stats" && (
            <ListEditor
              title="Stats" items={content.stats}
              onChange={(v) => set("stats", v)}
              template={{ value: 100, suffix: "+", label: "New Stat" }}
              fields={[
                { key: "value", label: "Value (number)", type: "number" },
                { key: "suffix", label: "Suffix", type: "text", size: "sm" },
                { key: "label", label: "Label", type: "text" },
              ]}
            />
          )}
          {tab === "countries" && <CountriesEditor value={content.countries} onChange={(v) => set("countries", v)} />}
          {tab === "services" && (
            <ListEditor
              title="Services" items={content.services}
              onChange={(v) => set("services", v)}
              template={{ slug: "new-service", icon: "⭐", title: "New Service", desc: "Description here" }}
              fields={[
                { key: "slug", label: "Slug", type: "text", size: "sm" },
                { key: "icon", label: "Icon (emoji)", type: "text", size: "sm" },
                { key: "title", label: "Title", type: "text" },
                { key: "desc", label: "Description", type: "textarea" },
              ]}
            />
          )}
          {tab === "processSteps" && (
            <ListEditor
              title="Process Steps" items={content.processSteps}
              onChange={(v) => set("processSteps", v)}
              template={{ n: "05", title: "New Step", desc: "What happens here" }}
              fields={[
                { key: "n", label: "Number (01, 02…)", type: "text", size: "sm" },
                { key: "title", label: "Title", type: "text" },
                { key: "desc", label: "Description", type: "textarea" },
              ]}
            />
          )}
          {tab === "tours" && <ToursEditor value={content.tours} onChange={(v) => set("tours", v)} />}
          {tab === "testimonials" && (
            <ListEditor
              title="Testimonials" items={content.testimonials}
              onChange={(v) => set("testimonials", v)}
              template={{ name: "New Client", country: "🇬🇧 UK Visa", text: "Their review", rating: 5 }}
              fields={[
                { key: "name", label: "Name", type: "text" },
                { key: "country", label: "Visa / Country", type: "text" },
                { key: "rating", label: "Rating (1-5)", type: "number" },
                { key: "text", label: "Review", type: "textarea" },
              ]}
            />
          )}
          {tab === "videos" && <VideosEditor value={content.videos} onChange={(v) => set("videos", v)} />}
          {tab === "gallery" && <GalleryEditor value={content.gallery} onChange={(v) => set("gallery", v)} />}
          {tab === "faqs" && (
            <ListEditor
              title="FAQs" items={content.faqs}
              onChange={(v) => set("faqs", v)}
              template={{ q: "New question?", a: "Answer here." }}
              fields={[
                { key: "q", label: "Question", type: "text" },
                { key: "a", label: "Answer", type: "textarea" },
              ]}
            />
          )}
          {tab === "ceo" && <CeoEditor value={content.ceo} onChange={(v) => set("ceo", v)} />}
          {tab === "customSections" && <CustomSectionsEditor value={content.customSections} onChange={(v) => set("customSections", v)} />}
          {tab === "contact" && <ContactEditor value={content.contact} onChange={(v) => set("contact", v)} />}
          {tab === "raw" && <RawJsonEditor value={content} onChange={setContent} />}
        </div>
      </div>
    </div>
  );
}

/* -------------------- primitives -------------------- */

function Field({
  label, value, onChange, type = "text", multiline, size,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number";
  multiline?: boolean;
  size?: "sm";
}) {
  const cls = "glass w-full rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/30 outline-none focus:border-gold-500/60";
  return (
    <label className={size === "sm" ? "block" : "block"}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{label}</span>
      {multiline ? (
        <textarea rows={3} value={value as string} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-y min-h-[80px]`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

function StringArrayEditor({
  label, values, onChange,
}: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{label}</span>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="glass w-full rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-gold-500/60"
            />
            <button
              onClick={() => onChange(values.filter((_, x) => x !== i))}
              className="rounded-xl border border-rose-500/40 px-3 text-[13px] text-rose-300 hover:bg-rose-500/10"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...values, ""])}
        type="button"
        className="mt-3 rounded-full border border-gold-500/40 px-4 py-1.5 text-[12px] font-semibold text-gold-300 hover:bg-gold-500/10"
      >
        + Add item
      </button>
    </div>
  );
}

/* -------------------- section editors -------------------- */

function AnnouncementEditor({ value, onChange }: { value: Content["announcement"]; onChange: (v: Content["announcement"]) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Announcement Bar" desc="Top gold marquee. Toggle on/off and edit each item." />
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={value.enabled} onChange={(e) => onChange({ ...value, enabled: e.target.checked })} className="h-5 w-5" />
        <span className="text-sm text-white">Enabled (show on all pages)</span>
      </label>
      <StringArrayEditor label="Marquee items (each shown separated in the strip)" values={value.items} onChange={(items) => onChange({ ...value, items })} />
    </div>
  );
}

function HeroEditor({ value, onChange }: { value: Content["hero"]; onChange: (v: Content["hero"]) => void }) {
  const set = <K extends keyof Content["hero"]>(k: K, v: Content["hero"][K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-6">
      <SectionHeader title="Hero Section" desc="First thing visitors see. Headline, CTAs and optional background media." />
      <Field label="Pre-headline (badge above headline)" value={value.preHeadline} onChange={(v) => set("preHeadline", v)} />
      <StringArrayEditor label="Headline words (each animates in sequence)" values={value.headlineWords} onChange={(v) => set("headlineWords", v)} />
      <Field label="Headline accent (last word in gold, e.g. 'Embassy.')" value={value.headlineAccent} onChange={(v) => set("headlineAccent", v)} />
      <Field label="Subhead" value={value.subhead} onChange={(v) => set("subhead", v)} multiline />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Primary CTA text" value={value.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} />
        <Field label="Primary CTA link" value={value.ctaPrimaryLink} onChange={(v) => set("ctaPrimaryLink", v)} />
        <Field label="Secondary CTA text" value={value.ctaSecondary} onChange={(v) => set("ctaSecondary", v)} />
        <Field label="Secondary CTA link" value={value.ctaSecondaryLink} onChange={(v) => set("ctaSecondaryLink", v)} />
      </div>
      <StringArrayEditor label="Trust strip below CTAs" values={value.trustStrip} onChange={(v) => set("trustStrip", v)} />
      <div className="grid gap-4 md:grid-cols-2">
        <FileInput
          label="Background video (mp4/webm, optional)"
          value={value.backgroundVideoUrl || ""}
          onChange={(v) => set("backgroundVideoUrl", v || undefined)}
          kind="video"
          hint="Upload direct or paste an external URL. Max 100MB."
        />
        <FileInput
          label="Background image (fallback / poster)"
          value={value.backgroundImageUrl || ""}
          onChange={(v) => set("backgroundImageUrl", v || undefined)}
          kind="image"
          hint="Upload direct or paste any public image URL."
        />
      </div>
      <p className="text-[12px] text-white/40">Leave both blank to keep the default cinematic aurora background with 3D globe.</p>
    </div>
  );
}

type FieldSpec = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number";
  size?: "sm";
};

function ListEditor<T extends Record<string, unknown>>({
  title, items, onChange, template, fields, hint,
}: {
  title: string;
  items: T[];
  onChange: (v: T[]) => void;
  template: T;
  fields: FieldSpec[];
  hint?: string;
}) {
  return (
    <div className="space-y-5">
      <SectionHeader title={title} desc={hint} />
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-widest text-white/40">#{i + 1}</span>
              <div className="flex gap-2">
                <button
                  disabled={i === 0}
                  onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}
                  type="button"
                  className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-white/60 hover:bg-white/5 disabled:opacity-30"
                >↑</button>
                <button
                  disabled={i === items.length - 1}
                  onClick={() => { const n = [...items]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }}
                  type="button"
                  className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-white/60 hover:bg-white/5 disabled:opacity-30"
                >↓</button>
                <button
                  onClick={() => onChange(items.filter((_, x) => x !== i))}
                  type="button"
                  className="rounded border border-rose-500/40 px-2 py-0.5 text-[11px] text-rose-300 hover:bg-rose-500/10"
                >Delete</button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((f) => {
                const val = it[f.key];
                const isFullWidth = f.type === "textarea" || (f.size !== "sm" && (fields.length <= 2));
                return (
                  <div key={f.key} className={isFullWidth ? "md:col-span-2" : ""}>
                    <Field
                      label={f.label}
                      value={typeof val === "number" ? val : String(val ?? "")}
                      onChange={(v) => {
                        const next = [...items];
                        next[i] = {
                          ...next[i],
                          [f.key]: f.type === "number" ? Number(v) : v,
                        };
                        onChange(next);
                      }}
                      type={f.type === "number" ? "number" : "text"}
                      multiline={f.type === "textarea"}
                      size={f.size}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...items, { ...template }])}
        type="button"
        className="btn-gold rounded-full px-6 py-2.5 text-[13px]"
      >
        + Add new
      </button>
    </div>
  );
}

function CountriesEditor({ value, onChange }: { value: Content["countries"]; onChange: (v: Content["countries"]) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Countries" desc="Each country becomes a card on the homepage and a full /visa/[slug] page." />
      <div className="space-y-5">
        {value.map((c, i) => (
          <details key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4" open={i === 0}>
            <summary className="cursor-pointer text-[14px] font-semibold text-white">
              {c.flag} {c.name} <span className="ml-2 text-[11px] text-white/40">/visa/{c.slug}</span>
            </summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="Slug (URL segment)" value={c.slug} onChange={(v) => update(i, "slug", v)} size="sm" />
              <Field label="Name" value={c.name} onChange={(v) => update(i, "name", v)} />
              <Field label="Flag emoji" value={c.flag} onChange={(v) => update(i, "flag", v)} size="sm" />
              <Field label="Gradient (Tailwind classes)" value={c.gradient} onChange={(v) => update(i, "gradient", v)} />
              <Field label="Latitude" value={c.lat} onChange={(v) => update(i, "lat", Number(v))} type="number" size="sm" />
              <Field label="Longitude" value={c.lng} onChange={(v) => update(i, "lng", Number(v))} type="number" size="sm" />
              <Field label="Processing time" value={c.processing} onChange={(v) => update(i, "processing", v)} />
              <Field label="Success rate" value={c.success} onChange={(v) => update(i, "success", v)} size="sm" />
              <div className="md:col-span-2">
                <Field label="Blurb (short intro)" value={c.blurb} onChange={(v) => update(i, "blurb", v)} multiline />
              </div>
              <div className="md:col-span-2">
                <StringArrayEditor label="Visa types" values={c.visaTypes} onChange={(v) => update(i, "visaTypes", v)} />
              </div>
              <div className="md:col-span-2">
                <StringArrayEditor label="Eligibility bullets" values={c.eligibility} onChange={(v) => update(i, "eligibility", v)} />
              </div>
              <div className="md:col-span-2">
                <StringArrayEditor label="Required documents" values={c.documents} onChange={(v) => update(i, "documents", v)} />
              </div>
              <div className="md:col-span-2">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Country FAQs</span>
                {c.faqs.map((f, fi) => (
                  <div key={fi} className="mb-3 space-y-2 rounded-lg border border-white/10 p-3">
                    <Field label="Question" value={f.q} onChange={(v) => updateFaq(i, fi, "q", v)} />
                    <Field label="Answer" value={f.a} onChange={(v) => updateFaq(i, fi, "a", v)} multiline />
                    <button onClick={() => removeFaq(i, fi)} type="button" className="rounded border border-rose-500/40 px-2 py-0.5 text-[11px] text-rose-300 hover:bg-rose-500/10">Delete FAQ</button>
                  </div>
                ))}
                <button onClick={() => addFaq(i)} type="button" className="rounded-full border border-gold-500/40 px-4 py-1.5 text-[12px] font-semibold text-gold-300 hover:bg-gold-500/10">+ Add FAQ</button>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => onChange(value.filter((_, x) => x !== i))} type="button" className="rounded border border-rose-500/40 px-3 py-1 text-[12px] text-rose-300 hover:bg-rose-500/10">Delete country</button>
            </div>
          </details>
        ))}
      </div>
      <button
        onClick={() => onChange([...value, {
          slug: "new-country", name: "New Country", flag: "🏳️", lat: 0, lng: 0,
          processing: "TBD", success: "95%", visaTypes: ["Tourist"],
          blurb: "Short intro here.", gradient: "from-sapphire-800 to-sapphire-900",
          eligibility: ["Requirement 1"], documents: ["Document 1"],
          faqs: [{ q: "Question?", a: "Answer." }],
        }])}
        type="button"
        className="btn-gold rounded-full px-6 py-2.5 text-[13px]"
      >
        + Add country
      </button>
    </div>
  );

  function update<K extends keyof Content["countries"][number]>(i: number, k: K, v: Content["countries"][number][K]) {
    const next = [...value];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  }
  function updateFaq(ci: number, fi: number, k: "q" | "a", v: string) {
    const next = [...value];
    const faqs = [...next[ci].faqs];
    faqs[fi] = { ...faqs[fi], [k]: v };
    next[ci] = { ...next[ci], faqs };
    onChange(next);
  }
  function addFaq(ci: number) {
    const next = [...value];
    next[ci] = { ...next[ci], faqs: [...next[ci].faqs, { q: "New question?", a: "Answer." }] };
    onChange(next);
  }
  function removeFaq(ci: number, fi: number) {
    const next = [...value];
    next[ci] = { ...next[ci], faqs: next[ci].faqs.filter((_, x) => x !== fi) };
    onChange(next);
  }
}

function ToursEditor({ value, onChange }: { value: Content["tours"]; onChange: (v: Content["tours"]) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Tours" desc="Tour packages shown on homepage and /tours page." />
      <div className="space-y-4">
        {value.map((t, i) => (
          <details key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4" open={i === 0}>
            <summary className="cursor-pointer text-[14px] font-semibold text-white">{t.emoji} {t.title}</summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="Slug" value={t.slug} onChange={(v) => u(i, "slug", v)} size="sm" />
              <Field label="Emoji" value={t.emoji} onChange={(v) => u(i, "emoji", v)} size="sm" />
              <div className="md:col-span-2"><Field label="Title" value={t.title} onChange={(v) => u(i, "title", v)} /></div>
              <Field label="Days" value={t.days} onChange={(v) => u(i, "days", Number(v))} type="number" size="sm" />
              <Field label="Nights" value={t.nights} onChange={(v) => u(i, "nights", Number(v))} type="number" size="sm" />
              <Field label="Price" value={t.price} onChange={(v) => u(i, "price", v)} />
              <Field label="Old price (or empty)" value={t.old || ""} onChange={(v) => u(i, "old", v || null)} />
              <Field label="Tag (Best Seller, Premium…)" value={t.tag} onChange={(v) => u(i, "tag", v)} />
              <Field label="Gradient" value={t.gradient} onChange={(v) => u(i, "gradient", v)} />
              <div className="md:col-span-2"><StringArrayEditor label="Includes" values={t.includes} onChange={(v) => u(i, "includes", v)} /></div>
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => onChange(value.filter((_, x) => x !== i))} type="button" className="rounded border border-rose-500/40 px-3 py-1 text-[12px] text-rose-300 hover:bg-rose-500/10">Delete tour</button>
            </div>
          </details>
        ))}
      </div>
      <button
        onClick={() => onChange([...value, {
          slug: "new-tour", title: "New Tour", days: 7, nights: 6, price: "PKR 200,000",
          old: null, tag: "New", includes: ["Visa", "Flights"],
          emoji: "🗺️", gradient: "from-sapphire-800 to-sapphire-900",
        }])}
        type="button"
        className="btn-gold rounded-full px-6 py-2.5 text-[13px]"
      >
        + Add tour
      </button>
    </div>
  );

  function u<K extends keyof Content["tours"][number]>(i: number, k: K, v: Content["tours"][number][K]) {
    const next = [...value];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  }
}

function ContactEditor({ value, onChange }: { value: Content["contact"]; onChange: (v: Content["contact"]) => void }) {
  const set = <K extends keyof Content["contact"]>(k: K, v: Content["contact"][K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-5">
      <SectionHeader title="Contact & Business Info" desc="Phone, address, map, social — feeds footer, contact page, WhatsApp float, JSON-LD SEO." />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full business name" value={value.fullName} onChange={(v) => set("fullName", v)} />
        <Field label="Tagline" value={value.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Since (year)" value={value.since} onChange={(v) => set("since", Number(v))} type="number" size="sm" />
        <Field label="Years label (18+, 20+…)" value={value.years} onChange={(v) => set("years", v)} size="sm" />
        <Field label="Phone (display format)" value={value.phone} onChange={(v) => set("phone", v)} />
        <Field label="Phone (raw, no spaces, e.g. 923145352222)" value={value.phoneRaw} onChange={(v) => set("phoneRaw", v)} />
        <Field label="WhatsApp number (no + no spaces)" value={value.whatsapp} onChange={(v) => set("whatsapp", v)} />
        <Field label="Email" value={value.email} onChange={(v) => set("email", v)} />
      </div>
      <Field label="Address (single line)" value={value.address} onChange={(v) => set("address", v)} multiline />
      <Field label="Hours" value={value.hours} onChange={(v) => set("hours", v)} />
      <Field label="Google Maps share URL (goo.gl or long)" value={value.mapsUrl} onChange={(v) => set("mapsUrl", v)} />
      <Field label="Google Maps embed URL (iframe src)" value={value.mapsEmbed} onChange={(v) => set("mapsEmbed", v)} multiline />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Latitude" value={value.coords.lat} onChange={(v) => set("coords", { ...value.coords, lat: Number(v) })} type="number" size="sm" />
        <Field label="Longitude" value={value.coords.lng} onChange={(v) => set("coords", { ...value.coords, lng: Number(v) })} type="number" size="sm" />
      </div>
      <SectionHeader title="Social" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Instagram URL" value={value.social.instagram} onChange={(v) => set("social", { ...value.social, instagram: v })} />
        <Field label="TikTok URL" value={value.social.tiktok} onChange={(v) => set("social", { ...value.social, tiktok: v })} />
        <Field label="Facebook URL" value={value.social.facebook} onChange={(v) => set("social", { ...value.social, facebook: v })} />
        <Field label="YouTube URL" value={value.social.youtube} onChange={(v) => set("social", { ...value.social, youtube: v })} />
      </div>
      <StringArrayEditor label="Required documents (shown on visa pages)" values={value.requiredDocs} onChange={(v) => set("requiredDocs", v)} />
    </div>
  );
}

function RawJsonEditor({ value, onChange }: { value: Content; onChange: (v: Content) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState("");
  function apply() {
    try {
      const parsed = JSON.parse(text) as Content;
      onChange(parsed);
      setErr("");
    } catch (e) {
      setErr((e as Error).message);
    }
  }
  return (
    <div className="space-y-4">
      <SectionHeader title="Raw JSON" desc="Advanced: edit the full content object directly. Click 'Apply' to sync back into the editor, then 'Save All Changes' above to persist." />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="glass block h-[540px] w-full rounded-xl p-4 font-mono text-[12px] leading-relaxed text-white outline-none focus:border-gold-500/60"
        spellCheck={false}
      />
      {err && <p className="text-sm text-rose-400">Parse error: {err}</p>}
      <div className="flex gap-3">
        <button onClick={apply} type="button" className="btn-gold rounded-full px-6 py-2 text-[13px]">Apply to editor</button>
        <button
          onClick={() => setText(JSON.stringify(value, null, 2))}
          type="button"
          className="btn-ghost rounded-full px-6 py-2 text-[13px] font-semibold text-white"
        >
          Reload from editor
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      {desc && <p className="mt-0.5 text-[12.5px] text-white/45">{desc}</p>}
    </div>
  );
}

/* -------------------- CEO editor -------------------- */

function CeoEditor({ value, onChange }: { value: Content["ceo"]; onChange: (v: Content["ceo"]) => void }) {
  const set = <K extends keyof Content["ceo"]>(k: K, v: Content["ceo"][K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-6">
      <SectionHeader title="CEO Profile — S. Mustafa" desc="Photo + bio + credentials shown in the founder section on the homepage." />

      <FileInput
        label="CEO photo (portrait recommended, 4:5)"
        value={value.photo}
        onChange={(v) => set("photo", v)}
        kind="image"
        hint="Upload direct or paste any URL. Leave blank to show initials placeholder."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" value={value.name} onChange={(v) => set("name", v)} />
        <Field label="Role" value={value.role} onChange={(v) => set("role", v)} />
        <Field label="Since (year)" value={value.since} onChange={(v) => set("since", Number(v))} type="number" size="sm" />
        <Field label="Tagline (short one-liner)" value={value.tagline} onChange={(v) => set("tagline", v)} />
      </div>

      <Field label="Bio (paragraph)" value={value.bio} onChange={(v) => set("bio", v)} multiline />
      <Field label="Pull quote" value={value.quote} onChange={(v) => set("quote", v)} multiline />

      <StringArrayEditor label="Highlights / credentials (bullets)" values={value.highlights} onChange={(v) => set("highlights", v)} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Instagram reach (e.g. 192K+)" value={value.reachInstagram} onChange={(v) => set("reachInstagram", v)} size="sm" />
        <Field label="Facebook reach (e.g. 125K+)" value={value.reachFacebook} onChange={(v) => set("reachFacebook", v)} size="sm" />
      </div>

      <SectionHeader title="CEO socials" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Instagram URL" value={value.socials.instagram} onChange={(v) => set("socials", { ...value.socials, instagram: v })} />
        <Field label="Facebook URL" value={value.socials.facebook} onChange={(v) => set("socials", { ...value.socials, facebook: v })} />
        <Field label="TikTok URL" value={value.socials.tiktok} onChange={(v) => set("socials", { ...value.socials, tiktok: v })} />
        <Field label="YouTube URL" value={value.socials.youtube} onChange={(v) => set("socials", { ...value.socials, youtube: v })} />
      </div>
    </div>
  );
}

/* -------------------- Videos editor (upload OR YouTube) -------------------- */

function VideosEditor({ value, onChange }: { value: Content["videos"]; onChange: (v: Content["videos"]) => void }) {
  function u<K extends keyof Content["videos"][number]>(i: number, k: K, v: Content["videos"][number][K]) {
    const next = [...value];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  }
  return (
    <div className="space-y-5">
      <SectionHeader title="Videos" desc="Direct upload (mp4/webm, max 100MB) OR YouTube video ID. Categories: Knowledge, Tours, Client Journey, etc." />
      <div className="space-y-4">
        {value.map((v, i) => (
          <details key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4" open={i === 0}>
            <summary className="cursor-pointer text-[14px] font-semibold text-white">
              {v.title || "Untitled"} <span className="ml-2 text-[11px] text-white/40">{v.fileUrl ? "· Direct" : v.youtubeId ? "· YouTube" : ""}</span>
            </summary>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="ID (unique)" value={v.id} onChange={(x) => u(i, "id", x)} size="sm" />
                <Field label="Category" value={v.category || ""} onChange={(x) => u(i, "category", x)} size="sm" />
                <div className="md:col-span-2">
                  <Field label="Title" value={v.title} onChange={(x) => u(i, "title", x)} />
                </div>
              </div>
              <FileInput
                label="Upload video file (mp4/webm/mov)"
                value={v.fileUrl || ""}
                onChange={(x) => u(i, "fileUrl", x || undefined)}
                kind="video"
                hint="If uploaded, this takes priority over YouTube ID."
              />
              <Field label="…or YouTube video ID (e.g. dQw4w9WgXcQ)" value={v.youtubeId || ""} onChange={(x) => u(i, "youtubeId", x || undefined)} size="sm" />
              <FileInput
                label="Custom thumbnail (optional)"
                value={v.thumbnail || ""}
                onChange={(x) => u(i, "thumbnail", x || undefined)}
                kind="image"
                hint="Overrides YouTube auto-thumbnail. Recommended for uploaded videos."
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => onChange(value.filter((_, x) => x !== i))}
                className="rounded border border-rose-500/40 px-3 py-1 text-[12px] text-rose-300 hover:bg-rose-500/10"
              >
                Delete video
              </button>
            </div>
          </details>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            { id: "v" + Date.now(), title: "New Video", youtubeId: "", fileUrl: "", category: "Knowledge" },
          ])
        }
        className="btn-gold rounded-full px-6 py-2.5 text-[13px]"
      >
        + Add video
      </button>
    </div>
  );
}

/* -------------------- Gallery editor (upload OR URL) -------------------- */

function GalleryEditor({ value, onChange }: { value: Content["gallery"]; onChange: (v: Content["gallery"]) => void }) {
  function u<K extends keyof Content["gallery"][number]>(i: number, k: K, v: Content["gallery"][number][K]) {
    const next = [...value];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  }
  return (
    <div className="space-y-5">
      <SectionHeader title="Gallery" desc="Upload photos directly OR paste any public image URL. Categorize (Tours, Umrah, Office, Team, etc.) for the filter chips." />
      <div className="grid gap-4 sm:grid-cols-2">
        {value.map((g, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <FileInput
              label={`Image #${i + 1}`}
              value={g.url}
              onChange={(x) => u(i, "url", x)}
              kind="image"
            />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Caption" value={g.caption} onChange={(x) => u(i, "caption", x)} />
              <Field label="Category" value={g.category} onChange={(x) => u(i, "category", x)} size="sm" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-white/40">ID: {g.id}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => { const n = [...value]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}
                  className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-white/60 hover:bg-white/5 disabled:opacity-30"
                >↑</button>
                <button
                  type="button"
                  disabled={i === value.length - 1}
                  onClick={() => { const n = [...value]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }}
                  className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-white/60 hover:bg-white/5 disabled:opacity-30"
                >↓</button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, x) => x !== i))}
                  className="rounded border border-rose-500/40 px-2 py-0.5 text-[11px] text-rose-300 hover:bg-rose-500/10"
                >Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            { id: "g" + Date.now(), url: "", caption: "New Photo", category: "Tours" },
          ])
        }
        className="btn-gold rounded-full px-6 py-2.5 text-[13px]"
      >
        + Add image
      </button>
    </div>
  );
}

/* -------------------- Custom homepage sections editor -------------------- */

function CustomSectionsEditor({
  value, onChange,
}: {
  value: Content["customSections"];
  onChange: (v: Content["customSections"]) => void;
}) {
  function u<K extends keyof Content["customSections"][number]>(i: number, k: K, v: Content["customSections"][number][K]) {
    const next = [...value];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  }
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Custom Sections"
        desc="Add any homepage block — announcement, story, promotion. Choose layout, accent, image, and optional CTA. Toggle enabled to show/hide."
      />
      <div className="space-y-4">
        {value.map((s, i) => (
          <details key={s.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4" open={i === 0}>
            <summary className="cursor-pointer text-[14px] font-semibold text-white">
              {s.title || "Untitled"}
              <span className="ml-2 text-[11px] text-white/40">
                {s.enabled ? "· visible" : "· hidden"} · {s.layout} · {s.accent}
              </span>
            </summary>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={(e) => u(i, "enabled", e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="text-sm text-white">Enabled (show on homepage)</span>
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Section ID (unique)" value={s.id} onChange={(x) => u(i, "id", x)} size="sm" />
                <label>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Layout</span>
                  <select
                    value={s.layout}
                    onChange={(e) => u(i, "layout", e.target.value as Content["customSections"][number]["layout"])}
                    className="glass w-full rounded-xl bg-sapphire-900 px-4 py-2.5 text-[14px] text-white outline-none focus:border-gold-500/60"
                  >
                    <option value="centered">Centered (text only)</option>
                    <option value="image-left">Image left · text right</option>
                    <option value="image-right">Image right · text left</option>
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Accent color</span>
                  <select
                    value={s.accent}
                    onChange={(e) => u(i, "accent", e.target.value as Content["customSections"][number]["accent"])}
                    className="glass w-full rounded-xl bg-sapphire-900 px-4 py-2.5 text-[14px] text-white outline-none focus:border-gold-500/60"
                  >
                    <option value="gold">Gold</option>
                    <option value="sapphire">Sapphire (blue)</option>
                    <option value="emerald">Emerald (green)</option>
                  </select>
                </label>
                <Field label="Subtitle (small caps above title)" value={s.subtitle || ""} onChange={(x) => u(i, "subtitle", x)} />
                <div className="md:col-span-2">
                  <Field label="Title" value={s.title} onChange={(x) => u(i, "title", x)} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Body (paragraph — separate paragraphs with blank line)" value={s.body} onChange={(x) => u(i, "body", x)} multiline />
                </div>
                <Field label="CTA text (optional)" value={s.ctaText || ""} onChange={(x) => u(i, "ctaText", x)} />
                <Field label="CTA link (optional)" value={s.ctaLink || ""} onChange={(x) => u(i, "ctaLink", x)} />
              </div>
              <FileInput
                label="Section image (optional)"
                value={s.imageUrl || ""}
                onChange={(x) => u(i, "imageUrl", x || undefined)}
                kind="image"
                hint="Upload direct or paste any URL. Used for 'image-left' / 'image-right' layouts, optional decoration for 'centered'."
              />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => { const n = [...value]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}
                className="rounded border border-white/15 px-3 py-1 text-[12px] text-white/60 hover:bg-white/5 disabled:opacity-30"
              >↑ Move up</button>
              <button
                type="button"
                disabled={i === value.length - 1}
                onClick={() => { const n = [...value]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }}
                className="rounded border border-white/15 px-3 py-1 text-[12px] text-white/60 hover:bg-white/5 disabled:opacity-30"
              >↓ Move down</button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, x) => x !== i))}
                className="rounded border border-rose-500/40 px-3 py-1 text-[12px] text-rose-300 hover:bg-rose-500/10"
              >Delete section</button>
            </div>
          </details>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            {
              id: "cs-" + Date.now(),
              enabled: true,
              title: "New Section",
              subtitle: "",
              body: "Write your content here. Separate paragraphs with a blank line.",
              imageUrl: "",
              ctaText: "",
              ctaLink: "",
              layout: "centered",
              accent: "gold",
            },
          ])
        }
        className="btn-gold rounded-full px-6 py-2.5 text-[13px]"
      >
        + Add new section
      </button>
    </div>
  );
}
