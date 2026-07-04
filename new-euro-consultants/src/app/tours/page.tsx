import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/Tilt";
import BoardingPass from "@/components/BoardingPass";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Turkey, Europe, Umrah and Baku packages from Islamabad — visa, flights, hotels and tours in one price.",
};

export default async function ToursPage() {
  const content = await getContent();
  const { tours, contact } = content;
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-400">Travel & Tours</p>
          <h1 className="mt-3 font-display text-[clamp(34px,5vw,60px)] font-extrabold tracking-tight text-white">
            Curated <span className="text-gold-gradient">Experiences</span>
          </h1>
          <p className="mt-4 max-w-xl text-white/55">
            One price. Visa, flights, hotels, transfers and guided tours — fully managed by our Islamabad office.
          </p>
        </Reveal>
        <Reveal><BoardingPass to="IST" passenger="YOU · Guest" gate="B7" seat="12A" /></Reveal>
      </div>

      <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tours.map((t) => (
          <Tilt key={t.slug} className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-b ${t.gradient} glass p-6`}>
            <div className="tilt-inner flex h-full flex-col">
              <div className="flex items-start justify-between">
                <span className="text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">{t.emoji}</span>
                <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300">{t.tag}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold leading-snug text-white">{t.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-white/50">{t.days} Days · {t.nights} Nights</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {t.includes.map((i) => (<li key={i} className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-white/70">{i}</li>))}
              </ul>
              <div className="mt-auto flex items-end justify-between pt-5">
                <div>
                  {t.old && <p className="text-[11.5px] text-white/40 line-through">{t.old}</p>}
                  <p className="font-display text-lg font-extrabold text-gold-gradient">{t.price}</p>
                </div>
                <a href={`https://wa.me/${contact.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(t.title)}`} className="rounded-full border border-gold-500/40 px-4 py-2 text-[12px] font-semibold text-gold-300 transition hover:bg-gold-500/10">Book →</a>
              </div>
            </div>
          </Tilt>
        ))}
      </Reveal>

      <Reveal className="mt-16 text-center text-sm text-white/45">
        Custom itineraries? Group bookings? WhatsApp us at{" "}
        <a href={`https://wa.me/${contact.whatsapp}`} className="text-gold-300 hover:text-gold-200">{contact.phone}</a>
      </Reveal>
    </div>
  );
}
