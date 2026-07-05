import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "neweuro_admin";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production-please-32b";

function sign(v: string) {
  return crypto.createHmac("sha256", SECRET).update(v).digest("hex");
}

export function makeToken(email: string): string {
  const payload = `${email}.${Date.now()}`;
  const b64 = Buffer.from(payload).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

export function verifyToken(token?: string | null): string | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  if (sign(b64) !== sig) return null;
  try {
    const decoded = Buffer.from(b64, "base64url").toString("utf8");
    const [email, tsStr] = decoded.split(".");
    const ts = Number(tsStr);
    if (!email || !ts) return null;
    // 7-day session
    if (Date.now() - ts > 7 * 864e5) return null;
    return email;
  } catch {
    return null;
  }
}

export function checkCredentials(email: string, password: string): boolean {
  const okEmail = (process.env.ADMIN_EMAIL || "admin@neweuroconsultants.com").toLowerCase();
  const okPass = process.env.ADMIN_PASSWORD || "ChangeMe!Strong2026";
  return email.toLowerCase() === okEmail && password === okPass;
}

export function getCookieName() {
  return COOKIE;
}

export function getSessionEmail(): string | null {
  const c = cookies().get(COOKIE)?.value;
  return verifyToken(c);
}
