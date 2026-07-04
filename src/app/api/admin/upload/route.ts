import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getSessionEmail } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_IMAGE = 15 * 1024 * 1024;   // 15MB
const MAX_VIDEO = 100 * 1024 * 1024;  // 100MB

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

function extFor(type: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
    "image/gif": "gif", "image/avif": "avif",
    "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
  };
  return map[type] || "bin";
}

export async function POST(req: Request) {
  if (!getSessionEmail()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const type = file.type;
  const isImage = IMAGE_TYPES.has(type);
  const isVideo = VIDEO_TYPES.has(type);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: `Unsupported type: ${type}` }, { status: 415 });
  }

  const limit = isImage ? MAX_IMAGE : MAX_VIDEO;
  if (file.size > limit) {
    return NextResponse.json(
      { error: `File too large. Max ${(limit / 1024 / 1024).toFixed(0)}MB for ${isImage ? "images" : "videos"}.` },
      { status: 413 }
    );
  }

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const id = crypto.randomBytes(8).toString("hex");
    const filename = `${Date.now().toString(36)}-${id}.${extFor(type)}`;
    const abs = path.join(UPLOAD_DIR, filename);
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(abs, buf);
    const url = `${PUBLIC_PREFIX}/${filename}`;
    return NextResponse.json({ ok: true, url, size: file.size, type, kind: isImage ? "image" : "video" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// list existing uploads (for reuse in admin)
export async function GET() {
  if (!getSessionEmail()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const entries = await fs.readdir(UPLOAD_DIR);
    const files = await Promise.all(
      entries.map(async (name) => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, name));
        return { url: `${PUBLIC_PREFIX}/${name}`, name, size: stat.size, mtime: stat.mtimeMs };
      })
    );
    files.sort((a, b) => b.mtime - a.mtime);
    return NextResponse.json({ files });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// delete a file
export async function DELETE(req: Request) {
  if (!getSessionEmail()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url).searchParams.get("name");
  if (!url) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  // basic path traversal defence
  if (url.includes("/") || url.includes("..") || url.includes("\\")) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  try {
    await fs.unlink(path.join(UPLOAD_DIR, url));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
