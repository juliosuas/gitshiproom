"use client";
import useSWR from "swr";
import { PrInboxList } from "@/components/pr-inbox-list";
import type { InboxItem } from "@/lib/github/inbox";
import { Kbd } from "@/components/ui/kbd";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function InboxPage() {
  const { data, mutate, isLoading, isValidating } = useSWR<{
    items: InboxItem[];
  }>("/api/prs/inbox", fetcher, { refreshInterval: 60_000 });

  const counts = countByReason(data?.items ?? []);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className="signal-dot"
              style={{
                backgroundColor: "var(--signal-cyan)",
                color: "var(--signal-cyan)",
              }}
            />
            PR Inbox
          </div>
          <h2 className="font-display text-3xl italic leading-none">
            {data ? data.items.length : "—"}{" "}
            <span className="text-foreground/70">pull requests</span>
            <span className="text-muted-foreground"> awaiting</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 text-[11px] font-mono tracking-wide md:flex">
            <Stat label="review" count={counts["review-requested"]} color="var(--signal-violet)" />
            <Stat label="assigned" count={counts.assigned} color="var(--signal-amber)" />
            <Stat label="yours" count={counts.authored} color="var(--signal-cyan)" />
          </div>
          <button
            onClick={() => mutate()}
            className="group flex items-center gap-2 rounded-md border border-hairline bg-card/50 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-signal-cyan/30 hover:text-foreground"
          >
            <span
              className={isValidating ? "animate-spin" : ""}
              style={{ display: "inline-block" }}
            >
              ↻
            </span>
            refresh
            <Kbd>r</Kbd>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {isLoading || !data ? (
          <SkeletonRows />
        ) : (
          <PrInboxList items={data.items} />
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-hairline px-6 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-3">
          <Kbd>j</Kbd><Kbd>k</Kbd> navigate
          <span className="opacity-30">·</span>
          <Kbd>↵</Kbd> open
          <span className="opacity-30">·</span>
          <Kbd>c</Kbd> copy claude cmd
        </span>
        <span>auto-refresh 60s</span>
      </footer>
    </div>
  );
}

function Stat({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="signal-dot"
        style={{ backgroundColor: color, color }}
      />
      <span className="text-foreground">{count}</span>
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
    <div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-hairline px-5 py-3.5"
          style={{ opacity: 1 - i * 0.12 }}
        >
          <div className="h-4 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-8 animate-pulse rounded bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
