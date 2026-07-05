import { NextResponse } from "next/server";
import { addLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.name || !b?.phone) {
      return NextResponse.json({ error: "Missing name or phone" }, { status: 400 });
    }
    const lead = await addLead({
      source: "contact",
      name: String(b.name).slice(0, 120),
      phone: String(b.phone).slice(0, 40),
      email: b.email ? String(b.email).slice(0, 160) : undefined,
      country: b.country ? String(b.country).slice(0, 80) : undefined,
      message: b.message ? String(b.message).slice(0, 2000) : undefined,
    });
    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
