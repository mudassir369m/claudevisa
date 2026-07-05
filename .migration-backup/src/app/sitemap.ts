import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://neweuroconsultants.com";
  const c = await getContent();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/about`, lastModified: now, priority: 0.7 },
    { url: `${base}/tours`, lastModified: now, priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, priority: 0.7 },
    { url: `${base}/eligibility`, lastModified: now, priority: 0.9 },
    ...c.countries.map((x) => ({ url: `${base}/visa/${x.slug}`, lastModified: now, priority: 0.85 })),
    ...c.tours.map((t) => ({ url: `${base}/tours#${t.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
