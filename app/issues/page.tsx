"use client";
import useSWR from "swr";
import type { IssueItem } from "@/lib/github/issues";
import { IssueRow } from "@/components/issue-row";
import { EmptyState } from "@/components/empty-state";
import { Kbd } from "@/components/ui/kbd";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function IssuesPage() {
  const { data, mutate, isValidating } = useSWR<{ items: IssueItem[] }>(
    "/api/issues",
    fetcher,
    { refreshInterval: 60_000 },
  );

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className="signal-dot"
              style={{
                backgroundColor: "var(--signal-amber)",
                color: "var(--signal-amber)",
              }}
            />
            Open issues
          </div>
          <h2 className="font-display text-3xl italic leading-none">
            {data ? data.items.length : "—"}{" "}
            <span className="text-foreground/70">signals</span>
            <span className="text-muted-foreground"> to triage</span>
          </h2>
        </div>

        <button
          onClick={() => mutate()}
          className="group flex items-center gap-2 rounded-md border border-hairline bg-card/50 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-signal-amber/30 hover:text-foreground"
        >
          <span
            className={isValidating ? "animate-spin" : ""}
            style={{ display: "inline-block" }}
          >
            ↻
          </span>
          refresh
        </button>
      </header>

      <div className="flex-1 overflow-auto">
        {!data ? (
          <LoadingState />
        ) : data.items.length === 0 ? (
          <EmptyState
            title="No signals in the water"
            hint="No open issues assigned or authored by you."
          />
        ) : (
          data.items.map((it) => <IssueRow key={it.id} item={it} />)
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-hairline px-6 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          <Kbd>↵</Kbd> open on github
        </span>
        <span>auto-refresh 60s</span>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
      <span className="relative mr-3 inline-flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
          style={{ backgroundColor: "var(--signal-amber)" }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--signal-amber)" }}
        />
      </span>
      scanning the fleet
    </div>
  );
}
