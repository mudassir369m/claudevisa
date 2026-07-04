import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  const c = await getContent();
  return NextResponse.json(c.contact);
}
