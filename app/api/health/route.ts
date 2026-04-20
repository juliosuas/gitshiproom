import { NextResponse } from "next/server";
import { hasToken } from "@/lib/github/client";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, hasToken: hasToken() });
}
