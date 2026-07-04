import Link from "next/link";
import type { Content } from "@/lib/content";

export default function Footer({ content }: { content: Content }) {
  const { contact, services, countries } = content;
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-sapphire-950">
      <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[18vw] font-extrabold leading-none text-white/[0.025]">
        NEW&nbsp;EURO
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/60 bg-sapphire-800 font-display text-sm font-extrabold text-gold-gradient">
              NE
            </span>
            <div>
              <p className="font-display font-bold text-white">{contact.fullName}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-400">{contact.tagline}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            {contact.years} years of transparent, embassy-grade visa consultancy from the heart of Islamabad. Visas, tickets, hotels, insurance — one office, complete travel.
          </p>
          <div className="mt-5 flex gap-3">
            {Object.entries(contact.social).map(([k, v]) => (
              <a
                key={k}
                href={v}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex h-9 w-9 items-center justify-center rounded-full text-xs uppercase text-white/70 transition hover:border-gold-500/50 hover:text-gold-300"
              >
                {k[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">Visas</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {countries.map((c) => (
              <li key={c.slug}>
                <Link href={`/visa/${c.slug}`} className="transition hover:text-white">
                  {c.flag} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">Services</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {services.map((s) => (
              <li key={s.slug}><Link href="/#services" className="transition hover:text-white">{s.title}</Link></li>
            ))}
            <li><Link href="/tours" className="transition hover:text-white">Tour Packages</Link></li>
            <li><Link href="/eligibility" className="transition hover:text-white">Eligibility Check</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">Office</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>{contact.address}</li>
            <li>{contact.hours}</li>
            <li><a href={`tel:${contact.phoneRaw}`} className="text-gold-300 hover:text-gold-200">{contact.phone}</a></li>
            <li><a href={`https://wa.me/${contact.whatsapp}`} className="text-emerald-400 hover:text-emerald-300">WhatsApp us →</a></li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {contact.fullName}. All rights reserved.
      </div>
    </footer>
  );
}
