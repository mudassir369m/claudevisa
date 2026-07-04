import { NextResponse } from "next/server";
import { checkCredentials, makeToken, getCookieName } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b?.email || !b?.password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  if (!checkCredentials(b.email, b.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = makeToken(b.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
