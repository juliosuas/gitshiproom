"use client";
import useSWR from "swr";
import { RefreshCw, Inbox as InboxIcon } from "lucide-react";
import { PrInboxList } from "@/components/pr-inbox-list";
import type { InboxItem } from "@/lib/github/inbox";
import { cn } from "@/lib/utils";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function InboxPage() {
  const { data, mutate, isLoading, isValidating } = useSWR<{
    items: InboxItem[];
  }>("/api/prs/inbox", fetcher, { refreshInterval: 60_000 });

  const counts = countByReason(data?.items ?? []);

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8 space-y-6">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-ocean">
            <InboxIcon className="h-4 w-4" strokeWidth={2.25} />
            Pull requests
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {data ? data.items.length : "—"} on your deck
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <FilterChip label="Review" count={counts["review-requested"]} tint="var(--ocean)" />
          <FilterChip label="Assigned" count={counts.assigned} tint="var(--sun)" />
          <FilterChip label="Yours" count={counts.authored} tint="var(--coral)" />
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
        </div>
      </header>

      <div className="card-soft">
        {isLoading || !data ? (
          <SkeletonRows />
        ) : (
          <PrInboxList items={data.items} />
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono">j</kbd>
        <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono">k</kbd>
        to navigate
        <span className="opacity-40">·</span>
        <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono">Enter</kbd>
        to open
        <span className="opacity-40">·</span>
        <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono">c</kbd>
        to copy a Claude command
        <span className="ml-auto">Auto-refresh 60s</span>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  tint,
}: {
  label: string;
  count: number;
  tint: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-surface-raised border border-border px-3 py-1 text-[12px]">
      <span
        className="dot"
        style={{
          width: 6,
          height: 6,
          backgroundColor: tint,
          boxShadow: `0 0 0 3px color-mix(in oklab, ${tint} 22%, transparent)`,
        }}
      />
      <span className="font-semibold text-foreground">{count}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function countByReason(items: InboxItem[]) {
  const c = { "review-requested": 0, assigned: 0, authored: 0 };
  for (const it of items) c[it.reason] += 1;
  return c;
}

function SkeletonRows() {
  return (
    <div className="space-y-1.5 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface/40 px-4 py-3"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
