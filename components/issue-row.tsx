import Link from "next/link";
import { CircleDot, ExternalLink } from "lucide-react";
import type { IssueItem } from "@/lib/github/issues";

export function IssueRow({ item }: { item: IssueItem }) {
  return (
    <Link
      href={item.url}
      target="_blank"
      className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all hover:border-border hover:bg-surface/60"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun/15 text-sun"
        style={{ color: "var(--sun)" }}
      >
        <CircleDot className="h-4 w-4" strokeWidth={2.25} />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono">{item.repo}</span>
          <span className="opacity-40">·</span>
          <span className="font-mono">#{item.number}</span>
        </div>
        <div className="truncate text-[15px] font-medium text-foreground group-hover:text-coral">
          {item.title}
        </div>
        {item.labels.length > 0 ? (
          <div className="flex items-center gap-1.5">
            {item.labels.slice(0, 3).map((l) => (
              <span
                key={l.name}
                className="rounded-md border px-1.5 py-px text-[10px] font-medium"
                style={{
                  color: `#${l.color}`,
                  backgroundColor: `color-mix(in oklab, #${l.color} 10%, transparent)`,
                  borderColor: `color-mix(in oklab, #${l.color} 30%, transparent)`,
                }}
              >
                {l.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <ExternalLink className="h-4 w-4 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
