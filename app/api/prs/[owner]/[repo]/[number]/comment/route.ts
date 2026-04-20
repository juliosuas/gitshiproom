import { NextResponse } from "next/server";
import { postComment } from "@/lib/github/actions";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ owner: string; repo: string; number: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { owner, repo, number } = await ctx.params;
  const body = (await req.json()) as { body: string };
  if (!body.body?.trim()) {
    return NextResponse.json({ error: "body required" }, { status: 400 });
  }
  await postComment(owner, repo, Number(number), body.body);
  return NextResponse.json({ ok: true });
}
