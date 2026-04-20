import { getOctokit, githubCache } from "./client";

export type InboxReason = "review-requested" | "assigned" | "authored";

export type InboxItem = {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string; // "owner/name"
  state: "open" | "closed";
  draft: boolean;
  author: string;
  labels: { name: string; color: string }[];
  updated_at: string;
  reason: InboxReason;
};

function parseRepoFromUrl(repositoryUrl: string): string {
  const m = repositoryUrl.match(/repos\/([^/]+\/[^/]+)$/);
  return m ? m[1] : "unknown/unknown";
}

async function search(q: string) {
  const o = getOctokit();
  const { data } = await o.request("GET /search/issues", {
    q,
    per_page: 50,
    sort: "updated",
    order: "desc",
  });
  return data;
}

export async function getInbox(username: string): Promise<InboxItem[]> {
  return githubCache.getOrSet(`inbox:${username}`, async () => {
    const queries: { q: string; reason: InboxReason }[] = [
      { q: `is:pr is:open review-requested:@me archived:false`, reason: "review-requested" },
      { q: `is:pr is:open assignee:@me archived:false`, reason: "assigned" },
      { q: `is:pr is:open author:@me archived:false`, reason: "authored" },
    ];
    const results: InboxItem[] = [];
    const seen = new Set<number>();
    for (const { q, reason } of queries) {
      const data = await search(q);
      for (const it of data.items) {
        if (seen.has(it.id)) continue;
        seen.add(it.id);
        results.push({
          id: it.id,
          number: it.number,
          title: it.title,
          url: it.html_url,
          repo: parseRepoFromUrl(it.repository_url),
          state: it.state as "open" | "closed",
          draft: Boolean(it.draft),
          author: it.user?.login ?? "unknown",
          labels: (it.labels ?? []).map((l) => ({
            name: typeof l === "string" ? l : l.name ?? "",
            color: typeof l === "string" ? "888888" : l.color ?? "888888",
          })),
          updated_at: it.updated_at,
          reason,
        });
      }
    }
    results.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    return results;
  }) as Promise<InboxItem[]>;
}
