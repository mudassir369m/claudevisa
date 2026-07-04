import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-content";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

export type Country = {
  slug: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  processing: string;
  success: string;
  visaTypes: string[];
  blurb: string;
  eligibility: string[];
  documents: string[];
  faqs: { q: string; a: string }[];
  gradient: string;
};

export type Tour = {
  slug: string;
  title: string;
  days: number;
  nights: number;
  price: string;
  old: string | null;
  tag: string;
  includes: string[];
  emoji: string;
  gradient: string;
};

export type Testimonial = {
  name: string;
  country: string;
  text: string;
  rating: number;
};

export type Service = { slug: string; icon: string; title: string; desc: string };
export type ProcessStep = { n: string; title: string; desc: string };
export type Stat = { value: number; suffix: string; label: string };
export type FAQ = { q: string; a: string };
export type TrustBadge = { icon: string; title: string; sub: string };
export type VideoItem = {
  id: string;
  title: string;
  youtubeId?: string;      // legacy / external
  fileUrl?: string;        // uploaded mp4/webm
  thumbnail?: string;      // optional custom thumb
  category?: string;
};
export type GalleryImage = { id: string; url: string; caption: string; category: string };

export type CeoProfile = {
  name: string;
  role: string;
  photo: string;          // upload URL or external
  tagline: string;        // short one-liner
  bio: string;            // full paragraph
  since: number;          // year joined industry / founded
  highlights: string[];   // credentials / bullet points
  quote: string;          // pull-quote for the profile
  reachInstagram: string; // "192K"
  reachFacebook: string;  // "125K+"
  socials: { instagram: string; facebook: string; tiktok: string; youtube: string };
};

export type CustomSection = {
  id: string;
  enabled: boolean;
  title: string;
  subtitle?: string;
  body: string;           // supports simple line breaks
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  layout: "image-left" | "image-right" | "centered";
  accent: "gold" | "sapphire" | "emerald";
};

export type Content = {
  announcement: { enabled: boolean; items: string[] };
  hero: {
    preHeadline: string;
    headlineWords: string[];
    headlineAccent: string;
    subhead: string;
    ctaPrimary: string;
    ctaPrimaryLink: string;
    ctaSecondary: string;
    ctaSecondaryLink: string;
    trustStrip: string[];
    backgroundVideoUrl?: string;
    backgroundImageUrl?: string;
  };
  trustBadges: TrustBadge[];
  stats: Stat[];
  countries: Country[];
  services: Service[];
  processSteps: ProcessStep[];
  tours: Tour[];
  testimonials: Testimonial[];
  videos: VideoItem[];
  gallery: GalleryImage[];
  faqs: FAQ[];
  ceo: CeoProfile;
  customSections: CustomSection[];
  contact: {
    fullName: string;
    tagline: string;
    since: number;
    years: string;
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
    mapsUrl: string;
    mapsEmbed: string;
    coords: { lat: number; lng: number };
    social: { instagram: string; tiktok: string; facebook: string; youtube: string };
    requiredDocs: string[];
  };
};

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

let cache: Content | null = null;

export async function getContent(): Promise<Content> {
  if (cache) return cache;
  try {
    await ensureDir();
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Content>;
    // deep-merge with defaults for any missing keys (forward compatibility)
    cache = { ...defaultContent, ...parsed } as Content;
    return cache;
  } catch {
    cache = defaultContent;
    return cache;
  }
}

export async function saveContent(next: Content): Promise<void> {
  await ensureDir();
  const tmp = CONTENT_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE);
  cache = next;
}

export async function patchContent<K extends keyof Content>(
  key: K,
  value: Content[K]
): Promise<Content> {
  const current = await getContent();
  const next: Content = { ...current, [key]: value };
  await saveContent(next);
  return next;
}

export function bustCache() {
  cache = null;
}
