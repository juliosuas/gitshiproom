"use client";
import useSWR from "swr";
import { CircleDot, RefreshCw } from "lucide-react";
import type { IssueItem } from "@/lib/github/issues";
import { IssueRow } from "@/components/issue-row";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function IssuesPage() {
  const { data, mutate, isValidating } = useSWR<{ items: IssueItem[] }>(
    "/api/issues",
    fetcher,
    { refreshInterval: 60_000 },
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8 space-y-6">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-sun">
            <CircleDot className="h-4 w-4" strokeWidth={2.25} />
            Issues
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {data ? data.items.length : "—"} open signals
          </h1>
          <p className="text-muted-foreground">
            Things assigned or authored by you, across every repo.
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RefreshCw
            className={cn("h-4 w-4", isValidating && "animate-spin")}
            strokeWidth={2.25}
          />
          Refresh
        </button>
      </header>

      <div className="card-soft">
        {!data ? (
          <div className="flex items-center justify-center gap-2 px-6 py-20 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Scanning the fleet…
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            title="Clear seas."
            hint="No open issues assigned or authored by you."
            icon={<CircleDot className="h-7 w-7" strokeWidth={2} />}
          />
        ) : (
          <div className="space-y-1 p-3">
            {data.items.map((it) => (
              <IssueRow key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
