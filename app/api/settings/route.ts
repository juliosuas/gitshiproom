import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { getAllSettings, setSetting } from "@/lib/db/settings";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ settings: getAllSettings(getDb()) });
}

export async function PATCH(req: Request) {
  const body = (await req.json()) as Record<string, string>;
  const db = getDb();
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string") setSetting(db, k, v);
  }
  return NextResponse.json({ ok: true });
}
