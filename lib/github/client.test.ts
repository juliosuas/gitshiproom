import { describe, expect, test } from "vitest";
import { getOctokit, githubCache } from "./client";

describe("getOctokit", () => {
  test("returns an Octokit instance when GITHUB_TOKEN is set", () => {
    process.env.GITHUB_TOKEN = "ghp_fake";
    const o = getOctokit();
    expect(o.request).toBeTypeOf("function");
  });

  test("throws a helpful error when GITHUB_TOKEN is missing", () => {
    delete process.env.GITHUB_TOKEN;
    expect(() => getOctokit(true)).toThrowError(/GITHUB_TOKEN/);
  });
});

describe("githubCache", () => {
  test("exports a TtlCache instance", () => {
    expect(typeof githubCache.get).toBe("function");
  });
});
