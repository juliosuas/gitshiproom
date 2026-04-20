import { http, HttpResponse } from "msw";
export const handlers = [
  http.get("https://api.github.com/user/repos", () =>
    HttpResponse.json([]),
  ),
];

export const githubHandlers = [
  http.get("https://api.github.com/search/issues", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    if (q.includes("review-requested:@me")) {
      return HttpResponse.json({
        total_count: 1,
        items: [
          {
            id: 1,
            number: 42,
            title: "Fix flaky test",
            html_url: "https://github.com/acme/web/pull/42",
            repository_url: "https://api.github.com/repos/acme/web",
            state: "open",
            draft: false,
            user: { login: "alice" },
            labels: [],
            updated_at: "2026-04-18T10:00:00Z",
            pull_request: { url: "..." },
          },
        ],
      });
    }
    if (q.includes("is:issue")) {
      return HttpResponse.json({
        total_count: 1,
        items: [
          {
            id: 2,
            number: 7,
            title: "Bug: login broken",
            html_url: "https://github.com/acme/web/issues/7",
            repository_url: "https://api.github.com/repos/acme/web",
            state: "open",
            user: { login: "bob" },
            labels: [{ name: "bug", color: "d73a4a" }],
            updated_at: "2026-04-17T09:00:00Z",
          },
        ],
      });
    }
    return HttpResponse.json({ total_count: 0, items: [] });
  }),
];
