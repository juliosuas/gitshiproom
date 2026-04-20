"use client";
import useSWR from "swr";
import type { PrDetail } from "@/lib/github/pr-detail";
import { DiffView } from "./diff-view";
import { PrActionsBar } from "./pr-actions-bar";
import { StatusBadge } from "./status-badge";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function PrDetailView({
  owner,
  repo,
  number,
}: {
  owner: string;
  repo: string;
  number: number;
}) {
  const { data } = useSWR<{ detail: PrDetail }>(
    `/api/prs/${owner}/${repo}/${number}`,
    fetcher,
    { refreshInterval: 60_000 },
  );
  if (!data) return <div className="p-8">Loading…</div>;
  const pr = data.detail;
  return (
    <div className="space-y-4 p-6">
      <header className="space-y-2">
        <div className="text-xs text-muted-foreground">
          {owner}/{repo}
        </div>
        <h1 className="text-xl font-semibold">
          <span className="text-muted-foreground">#{pr.number}</span> {pr.title}
        </h1>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>@{pr.author}</span>
          <span>
            {pr.head_ref} → {pr.base_ref}
          </span>
          <span>
            +{pr.additions} -{pr.deletions} ({pr.changed_files} files)
          </span>
          {pr.checks.length > 0 && (
            <StatusBadge conclusion={pr.checks[0].conclusion} />
          )}
        </div>
      </header>
      <PrActionsBar
        owner={owner}
        repo={repo}
        number={pr.number}
        mergeable={Boolean(pr.mergeable)}
      />
      {pr.body ? (
        <p className="whitespace-pre-wrap text-sm">{pr.body}</p>
      ) : null}
      <DiffView files={pr.files} />
    </div>
  );
}
