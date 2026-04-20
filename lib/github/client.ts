import { Octokit } from "@octokit/rest";
import { TtlCache } from "@/lib/cache";

let singleton: Octokit | null = null;

export class MissingTokenError extends Error {
  constructor() {
    super(
      "GITHUB_TOKEN is missing. Add it to .env (scopes: repo, read:org, read:user).",
    );
    this.name = "MissingTokenError";
  }
}

export function getOctokit(freshForTest = false): Octokit {
  if (freshForTest) singleton = null;
  if (singleton) return singleton;
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new MissingTokenError();
  singleton = new Octokit({ auth: token, userAgent: "orchestrator-v0.1" });
  return singleton;
}

export function hasToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

export const githubCache = new TtlCache<unknown>(30_000);
