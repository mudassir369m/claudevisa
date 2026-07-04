import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const LEADS = path.join(DATA_DIR, "leads.json");

export type Lead = {
  id: string;
  createdAt: string;
  source: "contact" | "eligibility";
  name: string;
  phone: string;
  email?: string;
  country?: string;
  message?: string;
  answers?: Record<string, string>;
  score?: number;
};

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LEADS);
  } catch {
    await fs.writeFile(LEADS, "[]", "utf8");
  }
}

export async function readLeads(): Promise<Lead[]> {
  await ensure();
  try {
    const raw = await fs.readFile(LEADS, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function addLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  await ensure();
  const all = await readLeads();
  const entry: Lead = {
    ...lead,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  await fs.writeFile(LEADS, JSON.stringify(all.slice(0, 5000), null, 2), "utf8");
  return entry;
}

export async function deleteLead(id: string): Promise<void> {
  await ensure();
  const all = await readLeads();
  const next = all.filter((l) => l.id !== id);
  await fs.writeFile(LEADS, JSON.stringify(next, null, 2), "utf8");
}
