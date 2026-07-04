import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  const c = await getContent();
  // return minimal public shape needed by client-side pages
  return NextResponse.json({
    countries: c.countries.map((x) => ({ slug: x.slug, name: x.name, flag: x.flag })),
    contact: { whatsapp: c.contact.whatsapp, phone: c.contact.phone },
  });
}
