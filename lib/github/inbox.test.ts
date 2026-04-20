import { beforeEach, describe, expect, test } from "vitest";
import { getInbox } from "./inbox";
import { githubCache } from "./client";

describe("getInbox", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "ghp_fake";
    githubCache.invalidateAll();
  });

  test("returns PRs where the user is requested as reviewer", async () => {
    const items = await getInbox("julio");
    expect(items).toHaveLength(1);
    expect(items[0].number).toBe(42);
    expect(items[0].repo).toBe("acme/web");
    expect(items[0].reason).toBe("review-requested");
  });

  test("results are cached between calls", async () => {
    await getInbox("julio");
    const items = await getInbox("julio");
    expect(items[0].title).toBe("Fix flaky test");
  });
});
