import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth";
import { getContent } from "@/lib/content";
import ContentEditor from "../ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  if (!getSessionEmail()) redirect("/admin/login");
  const content = await getContent();
  return <ContentEditor initial={content} />;
}
