"use client";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function TokenStatus() {
  const { data } = useSWR<{ hasToken: boolean }>("/api/health", fetcher, {
    refreshInterval: 60_000,
  });
  if (!data) return null;
  if (data.hasToken) return null;
  return (
    <Link
      href="/setup"
      className="group flex items-center justify-between gap-4 border-b border-signal-amber/30 px-6 py-2.5 text-sm transition-colors hover:bg-signal-amber/15"
      style={{
        backgroundColor:
          "color-mix(in oklab, var(--signal-amber) 12%, transparent)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="signal-dot"
          style={{
            backgroundColor: "var(--signal-amber)",
            color: "var(--signal-amber)",
          }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] signal-amber">
          No signal
        </span>
        <span className="text-foreground/85">
          GITHUB_TOKEN missing — ship can&apos;t reach the fleet
        </span>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
        Open setup →
      </span>
    </Link>
  );
}
