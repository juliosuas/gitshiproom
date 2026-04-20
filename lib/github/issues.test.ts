import { beforeEach, describe, expect, test } from "vitest";
import { listIssues } from "./issues";
import { githubCache } from "./client";

describe("listIssues", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "ghp_fake";
    githubCache.invalidateAll();
  });

  test("returns open issues across the user's repos", async () => {
    const items = await listIssues();
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].title).toBe("Bug: login broken");
  });
});
