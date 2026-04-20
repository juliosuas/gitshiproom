import { NextResponse } from "next/server";
import { getOctokit, githubCache } from "@/lib/github/client";

export const runtime = "nodejs";

export async function GET() {
  const repos = await githubCache.getOrSet("repos:mine", async () => {
    const o = getOctokit();
    const { data } = await o.request("GET /user/repos", {
      per_page: 100,
      sort: "pushed",
      affiliation: "owner,organization_member",
    });
    return data.map((r) => ({
      full_name: r.full_name,
      name: r.name,
      owner: r.owner.login,
      private: r.private,
      pushed_at: r.pushed_at,
      default_branch: r.default_branch,
    }));
  });
  return NextResponse.json({ repos });
}
