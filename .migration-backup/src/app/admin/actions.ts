"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth";
import { saveContent, getContent, type Content } from "@/lib/content";
import { deleteLead } from "@/lib/leads";

function assertAuth() {
  if (!getSessionEmail()) {
    redirect("/admin/login");
  }
}

export async function saveContentAction(json: string): Promise<{ ok: boolean; error?: string }> {
  assertAuth();
  let parsed: Content;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { ok: false, error: "Invalid JSON: " + (e as Error).message };
  }
  // basic shape validation
  const required: (keyof Content)[] = [
    "announcement", "hero", "trustBadges", "stats", "countries",
    "services", "processSteps", "tours", "testimonials", "videos",
    "gallery", "faqs", "contact",
  ];
  for (const k of required) {
    if (!(k in parsed)) return { ok: false, error: `Missing top-level key: ${k}` };
  }
  try {
    await saveContent(parsed);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  // revalidate all public routes so changes appear instantly
  revalidatePath("/", "layout");
  revalidatePath("/tours");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/eligibility");
  revalidatePath("/visa/[slug]", "page");
  return { ok: true };
}

export async function resetContentAction(): Promise<{ ok: boolean }> {
  assertAuth();
  const { defaultContent } = await import("@/lib/default-content");
  await saveContent(defaultContent);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function exportContentAction(): Promise<string> {
  assertAuth();
  const c = await getContent();
  return JSON.stringify(c, null, 2);
}

export async function deleteLeadAction(id: string): Promise<{ ok: boolean }> {
  assertAuth();
  await deleteLead(id);
  revalidatePath("/admin/leads");
  return { ok: true };
}
