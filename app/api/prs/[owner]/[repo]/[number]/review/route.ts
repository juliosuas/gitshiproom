import { NextResponse } from "next/server";
import { submitReview, type ReviewEvent } from "@/lib/github/actions";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ owner: string; repo: string; number: string }> };

const VALID: ReviewEvent[] = ["APPROVE", "REQUEST_CHANGES", "COMMENT"];

export async function POST(req: Request, ctx: Ctx) {
  const { owner, repo, number } = await ctx.params;
  const body = (await req.json()) as { event: ReviewEvent; body?: string };
  if (!VALID.includes(body.event)) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }
  const result = await submitReview(owner, repo, Number(number), body);
  return NextResponse.json(result);
}
