import { NextResponse } from "next/server";
import { hasToken, getOctokit, githubCache } from "@/lib/github/client";

export const runtime = "nodejs";

type User = { login: string; avatar_url: string; name: string | null };

export async function GET() {
  if (!hasToken()) {
    return NextResponse.json({ ok: true, hasToken: false });
  }
  try {
    const user = await githubCache.getOrSet("me", async () => {
      const o = getOctokit();
      const { data } = await o.request("GET /user");
      return {
        login: data.login,
        avatar_url: data.avatar_url,
        name: data.name ?? null,
      } satisfies User;
    });
    return NextResponse.json({ ok: true, hasToken: true, user });
  } catch {
    return NextResponse.json({ ok: true, hasToken: true });
  }
}
