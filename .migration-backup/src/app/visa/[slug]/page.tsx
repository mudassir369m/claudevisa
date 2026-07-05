import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content";

const MiniGlobe = dynamic(() => import("@/components/MiniGlobe"), { ssr: false });

export const revalidate = 60;

export async function generateStaticParams() {
  const c = await getContent();
  return c.countries.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = await getContent();
  const country = c.countries.find((x) => x.slug === params.slug);
  if (!country) return {};
  return {
    title: `${country.name} Visa from Pakistan`,
    description: `${country.name} visit visa consultancy in Islamabad — ${country.processing}, ${country.success} success rate. ${country.blurb}`,
  };
}

export default async function VisaPage({ params }: { params: { slug: string } }) {
  const content = await getContent();
  const c = content.countries.find((x) => x.slug === params.slug);
  if (!c) notFound();
  const { contact } = content;

  return (
    <div className="relative">
      <section className={`relative overflow-hidden bg-gradient-to-br ${c.gradient} noise`}>
        <div className="absolute inset-0 bg-sapphire-950/70" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-28 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-8">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-300">Visa Pathway</p>
            <h1 className="mt-4 font-display text-[clamp(38px,6vw,76px)] font-extrabold tracking-tight text-white">
              <span className="mr-4 align-middle text-[0.85em]">{c.flag}</span>
              Your {c.name} Visa, <span className="text-gold-gradient">Done Right</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/70">{c.blurb}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="glass rounded-full px-5 py-2.5">⏱ {c.processing}</span>
              <span className="glass rounded-full px-5 py-2.5">✅ {c.success} success rate</span>
              <span className="glass rounded-full px-5 py-2.5">🗓 Since {contact.since}</span>
            </div>
          </Reveal>
          <div className="mx-auto h-[320px] w-full max-w-[420px] sm:h-[400px]">
            <MiniGlobe lat={c.lat} lng={c.lng} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-3 lg:px-8">
        <div className="space-y-14 lg:col-span-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white">Visa Types We Handle</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {c.visaTypes.map((v) => (<span key={v} className="glass rounded-full px-5 py-2.5 text-sm text-white/80">{v}</span>))}
            </div>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white">Eligibility Criteria</h2>
            <ul className="mt-5 space-y-3">
              {c.eligibility.map((e) => (
                <li key={e} className="glass flex items-start gap-3 rounded-xl px-5 py-4 text-[14.5px] text-white/75">
                  <span className="mt-0.5 text-gold-400">✦</span> {e}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white">Required Documents</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.documents.map((d) => (
                <li key={d} className="glass flex items-start gap-3 rounded-xl px-5 py-4 text-[14px] text-white/75">
                  <span className="mt-0.5 text-emerald-400">✓</span> {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white">{c.name} FAQs</h2>
            <div className="mt-5 space-y-4">
              {c.faqs.map((f) => (
                <div key={f.q} className="glass rounded-2xl p-6">
                  <p className="font-semibold text-white">{f.q}</p>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-white/60">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <aside className="lg:pt-2">
          <div className="glass-strong sticky top-28 rounded-[22px] p-7 shadow-card">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-400">Start Today</p>
            <h3 className="mt-2 font-display text-xl font-bold text-white">Free {c.name} Eligibility Check</h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
              Honest assessment against real embassy policy — before you spend a rupee.
            </p>
            <Link href="/eligibility" className="btn-gold mt-6 block rounded-full px-6 py-3.5 text-center text-sm">Check My Eligibility →</Link>
            <a href={`https://wa.me/${contact.whatsapp}?text=I%20want%20to%20apply%20for%20a%20${encodeURIComponent(c.name)}%20visa.`} className="btn-ghost mt-3 block rounded-full px-6 py-3.5 text-center text-sm font-semibold text-white">WhatsApp Us</a>
            <p className="mt-5 text-center text-[12px] text-white/40">{contact.phone}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
