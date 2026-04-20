import { NextResponse } from "next/server";
import { listIssues } from "@/lib/github/issues";

export const runtime = "nodejs";

export async function GET() {
  const items = await listIssues();
  return NextResponse.json({ items });
}
