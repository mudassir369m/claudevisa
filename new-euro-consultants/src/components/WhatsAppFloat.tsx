import type { Content } from "@/lib/content";

export default function WhatsAppFloat({ content }: { content: Content }) {
  const { whatsapp } = content.contact;
  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Hi%20New%20Euro%20Consultants%2C%20I%20need%20visa%20guidance.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-float ring-2 ring-gold-500/40 transition-transform duration-300 hover:scale-110 animate-float"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
        <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.9 1 4 1.6 6.2 1.6h.1c6.6 0 12-5.3 12-11.9C29.5 8.3 24.2 3 16 3zm5.9 16.9c-.3.8-1.5 1.5-2.1 1.6-.5.1-1.2.1-2-.1-.5-.1-1.1-.3-1.9-.6-3.3-1.4-5.5-4.8-5.6-5-.2-.2-1.4-1.8-1.4-3.5 0-1.7.9-2.5 1.2-2.8.3-.3.7-.4.9-.4h.6c.2 0 .5-.1.7.5.3.7.9 2.4 1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.5.6-.2.2-.4.4-.2.7.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.2.5.1.7-.1.2-.2.9-1 1.1-1.4.2-.3.5-.3.8-.2.3.1 2 1 2.4 1.1.3.2.6.3.6.4.2.2.2.8-.1 1.6z" />
      </svg>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
      </span>
    </a>
  );
}
