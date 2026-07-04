import type { Content } from "@/lib/content";

export default function SocialRail({ content }: { content: Content }) {
  const { social } = content.contact;
  const items = [
    { label: "IG", href: social.instagram, name: "Instagram" },
    { label: "TT", href: social.tiktok, name: "TikTok" },
    { label: "FB", href: social.facebook, name: "Facebook" },
    { label: "YT", href: social.youtube, name: "YouTube" },
  ];
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 xl:flex">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group glass relative flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-bold text-white/60 transition-all duration-300 hover:border-gold-500/50 hover:text-gold-300"
          aria-label={it.name}
        >
          {it.label}
          <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-md bg-sapphire-800 px-2.5 py-1 text-[11px] text-white/80 opacity-0 shadow-card transition-all duration-300 group-hover:opacity-100">
            {it.name}
          </span>
        </a>
      ))}
    </div>
  );
}
