import { beforeEach, describe, expect, test, vi } from "vitest";
import { githubCache } from "@/lib/github/client";

describe("GitHub read routes", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "ghp_fake";
    githubCache.invalidateAll();
    vi.resetModules();
  });

  test("GET /api/prs/inbox returns items", async () => {
    const { GET } = await import("@/app/api/prs/inbox/route");
    const res = await GET(new Request("http://t/api/prs/inbox?me=julio"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.items.length).toBeGreaterThan(0);
  });

  test("GET /api/prs/:owner/:repo/:number returns detail", async () => {
    const { GET } = await import(
      "@/app/api/prs/[owner]/[repo]/[number]/route"
    );
    const res = await GET(new Request("http://t/"), {
      params: Promise.resolve({ owner: "acme", repo: "web", number: "42" }),
    });
    const data = await res.json();
    expect(data.detail.title).toBe("Fix flaky test");
  });

  test("GET /api/issues returns items", async () => {
    const { GET } = await import("@/app/api/issues/route");
    const res = await GET();
    const data = await res.json();
    expect(data.items.length).toBeGreaterThanOrEqual(1);
  });
});
