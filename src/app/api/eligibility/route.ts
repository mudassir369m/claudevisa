import { NextResponse } from "next/server";
import { addLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.name || !b?.phone) {
      return NextResponse.json({ error: "Missing contact" }, { status: 400 });
    }
    const lead = await addLead({
      source: "eligibility",
      name: String(b.name).slice(0, 120),
      phone: String(b.phone).slice(0, 40),
      email: b.email ? String(b.email).slice(0, 160) : undefined,
      answers: b.answers && typeof b.answers === "object" ? b.answers : undefined,
      score: typeof b.score === "number" ? b.score : undefined,
    });
    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
