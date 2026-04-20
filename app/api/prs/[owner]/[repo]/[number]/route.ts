import { NextResponse } from "next/server";
import { getPrDetail } from "@/lib/github/pr-detail";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ owner: string; repo: string; number: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { owner, repo, number } = await ctx.params;
  const detail = await getPrDetail(owner, repo, Number(number));
  return NextResponse.json({ detail });
}
