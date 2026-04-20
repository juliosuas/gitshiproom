import { NextResponse } from "next/server";
import { mergePr } from "@/lib/github/actions";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ owner: string; repo: string; number: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { owner, repo, number } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as {
    method?: "merge" | "squash" | "rebase";
  };
  const result = await mergePr(
    owner,
    repo,
    Number(number),
    body.method ?? "squash",
  );
  return NextResponse.json(result);
}
