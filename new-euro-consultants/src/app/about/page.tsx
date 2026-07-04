import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description: "18 years of transparent visa consultancy from F-11 Markaz, Islamabad. Meet New Euro Consultants.",
};

export default async function AboutPage() {
  const content = await getContent();
  const { contact } = content;
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">About Us</p>
        <h1 className="mt-3 font-display text-[clamp(34px,5vw,60px)] font-extrabold tracking-tight text-white">
          18 Years. One Promise: <span className="text-gold-gradient">Honesty First.</span>
        </h1>
      </Reveal>
      <Reveal className="mt-10 space-y-6 text-[16px] leading-relaxed text-white/65">
        <p>
          Since {contact.since}, New Euro Consultants has operated on one principle: assess honestly <em>before</em> the embassy does. We are <strong className="text-white">&quot;{contact.tagline}&quot;</strong> — we check your eligibility against real embassy policies, tell you exactly where your file stands, and only then move forward.
        </p>
        <p>
          Led by <strong className="text-white">S. Mustafa</strong>, our team has processed thousands of successful applications for the UK, USA, Canada, Australia, Turkey and the Schengen states — including hundreds of post-refusal cases other consultants had given up on.
        </p>
        <p>
          We are a complete travel house: visas, air ticketing, hotel bookings, Schengen-approved travel insurance, and fully managed tour packages — all issued in-house from our F-11 Markaz office. No middlemen. No hidden fees. No false promises.
        </p>
      </Reveal>
      <Reveal stagger className="mt-14 grid gap-5 sm:grid-cols-3">
        {[
          { t: "Transparent", d: "You see the real assessment before paying anything. If your profile isn't ready, we say so." },
          { t: "Embassy-Grade", d: "Files built the way caseworkers actually read them — narrative, evidence, sequence." },
          { t: "Complete", d: "Visa to boarding pass under one roof. One office, one point of accountability." },
        ].map((x) => (
          <div key={x.t} className="glass rounded-[22px] p-6">
            <h3 className="font-display text-lg font-bold text-gold-gradient">{x.t}</h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/60">{x.d}</p>
          </div>
        ))}
      </Reveal>
      <Reveal className="glass-strong mt-14 rounded-[26px] p-8 text-center">
        <p className="text-white/70">{contact.address}</p>
        <p className="mt-1 text-white/50">{contact.hours}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/eligibility" className="btn-gold rounded-full px-7 py-3.5 text-sm">Free Eligibility Check</Link>
          <a href={`https://wa.me/${contact.whatsapp}`} className="btn-ghost rounded-full px-7 py-3.5 text-sm font-semibold text-white">WhatsApp Us</a>
          <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost rounded-full px-7 py-3.5 text-sm font-semibold text-white">📍 Directions</a>
        </div>
      </Reveal>
    </div>
  );
}
