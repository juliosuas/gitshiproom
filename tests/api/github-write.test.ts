import { beforeEach, describe, expect, test, vi } from "vitest";

describe("GitHub write routes", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "ghp_fake";
    vi.resetModules();
  });

  test("POST review returns id", async () => {
    const { POST } = await import(
      "@/app/api/prs/[owner]/[repo]/[number]/review/route"
    );
    const res = await POST(
      new Request("http://t/", {
        method: "POST",
        body: JSON.stringify({ event: "APPROVE", body: "LGTM" }),
        headers: { "content-type": "application/json" },
      }),
      { params: Promise.resolve({ owner: "acme", repo: "web", number: "42" }) },
    );
    const data = await res.json();
    expect(data.id).toBe(999);
  });

  test("POST merge returns merged=true", async () => {
    const { POST } = await import(
      "@/app/api/prs/[owner]/[repo]/[number]/merge/route"
    );
    const res = await POST(
      new Request("http://t/", {
        method: "POST",
        body: JSON.stringify({ method: "squash" }),
        headers: { "content-type": "application/json" },
      }),
      { params: Promise.resolve({ owner: "acme", repo: "web", number: "42" }) },
    );
    const data = await res.json();
    expect(data.merged).toBe(true);
  });
});
