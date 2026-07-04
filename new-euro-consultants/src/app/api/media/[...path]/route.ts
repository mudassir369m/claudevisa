import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
};

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const name = params.path.join("/");
  if (name.includes("..") || name.includes("\\")) {
    return new NextResponse("bad request", { status: 400 });
  }
  try {
    const abs = path.join(UPLOAD_DIR, name);
    const buf = await fs.readFile(abs);
    const ext = name.split(".").pop()?.toLowerCase() || "";
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(buf.length),
      },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
