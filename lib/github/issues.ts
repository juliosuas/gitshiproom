import { getOctokit, githubCache } from "./client";

export type IssueItem = {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  state: "open" | "closed";
  author: string;
  labels: { name: string; color: string }[];
  updated_at: string;
};

export async function listIssues(): Promise<IssueItem[]> {
  return githubCache.getOrSet("issues:mine", async () => {
    const o = getOctokit();
    const { data } = await o.request("GET /search/issues", {
      q: "is:issue is:open assignee:@me OR is:issue is:open author:@me",
      per_page: 50,
      sort: "updated",
      order: "desc",
    });
    return data.items.map((it) => ({
      id: it.id,
      number: it.number,
      title: it.title,
      url: it.html_url,
      repo: (it.repository_url.match(/repos\/([^/]+\/[^/]+)$/) ?? [
        "",
        "unknown/unknown",
      ])[1],
      state: it.state as "open" | "closed",
      author: it.user?.login ?? "unknown",
      labels: (it.labels ?? []).map((l) => ({
        name: typeof l === "string" ? l : l.name ?? "",
        color: typeof l === "string" ? "888888" : l.color ?? "888888",
      })),
      updated_at: it.updated_at,
    }));
  }) as Promise<IssueItem[]>;
}
