"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Content } from "@/lib/content";

const links = [
  { href: "/#countries", label: "Visas" },
  { href: "/#services", label: "Services" },
  { href: "/tours", label: "Tours" },
  { href: "/#ceo", label: "CEO" },
  { href: "/#videos", label: "Videos" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/#office", label: "Office" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ content }: { content: Content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { announcement, contact } = content;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {announcement.enabled && announcement.items.length > 0 && (
        <div className="relative z-50 overflow-hidden bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-sapphire-950">
          <div className="flex whitespace-nowrap animate-marquee text-[12px] font-semibold tracking-wide py-1.5">
            {[0, 1].map((i) => (
              <span key={i} className="flex shrink-0 items-center gap-8 px-8">
                {announcement.items.map((it, idx) => (
                  <span key={idx}>{it}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-card" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8 py-3.5">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/60 bg-sapphire-800/80 shadow-glow-gold transition-transform duration-500 group-hover:rotate-[360deg]">
              <span className="font-display text-sm font-800 text-gold-gradient font-extrabold">NE</span>
              <span className="absolute inset-0 rounded-full border border-gold-500/25 animate-spin-slow" style={{ borderStyle: "dashed" }} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight text-white">
                New Euro Consultants
              </span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-gold-400">
                {contact.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-[13px] font-medium text-white/75 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/eligibility" className="btn-gold rounded-full px-5 py-2.5 text-[13px]">
              Free Check
            </Link>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        <div
          className={`glass-strong overflow-hidden transition-all duration-500 lg:hidden ${
            open ? "max-h-[500px] border-t border-white/10" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-gold-300"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/eligibility"
              onClick={() => setOpen(false)}
              className="btn-gold mt-2 rounded-full px-5 py-3 text-center text-sm"
            >
              Free Eligibility Check
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
