import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InboxItem } from "@/lib/github/inbox";

const reasonColor: Record<string, string> = {
  "review-requested": "var(--ocean)",
  assigned: "var(--sun)",
  authored: "var(--coral)",
};

const reasonLabel: Record<string, string> = {
  "review-requested": "Needs your review",
  assigned: "Assigned to you",
  authored: "Your PR",
};

export function QuickPrCard({ item }: { item: InboxItem }) {
  const tint = reasonColor[item.reason] ?? "var(--coral)";
  return (
    <Link
      href={`/pr/${item.repo}/${item.number}`}
      className="group flex flex-col gap-2 rounded-xl border border-border bg-surface-raised p-4 transition-all hover:border-coral/30 hover:shadow-soft"
    >
      <div className="flex items-center gap-2 text-[11px] font-medium">
        <span
          className="dot"
          style={{
            backgroundColor: tint,
            boxShadow: `0 0 0 3px color-mix(in oklab, ${tint} 20%, transparent)`,
          }}
        />
        <span style={{ color: tint }}>{reasonLabel[item.reason]}</span>
        <span className="text-muted-foreground">· {item.repo}</span>
      </div>
      <div className="font-display text-lg font-medium leading-tight">
        {item.title}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-mono">#{item.number}</span> · @{item.author}
        </span>
        <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
