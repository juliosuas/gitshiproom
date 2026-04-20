import Link from "next/link";
import type { IssueItem } from "@/lib/github/issues";

export function IssueRow({ item }: { item: IssueItem }) {
  return (
    <Link
      href={item.url}
      target="_blank"
      className="group flex items-center gap-4 border-b border-hairline px-5 py-3 text-sm transition-colors hover:bg-accent/25"
    >
      <span
        className="signal-dot shrink-0"
        style={{
          backgroundColor: "var(--signal-amber)",
          color: "var(--signal-amber)",
        }}
      />

      <span className="font-mono text-[11px] text-muted-foreground">
        #{item.number}
      </span>

      <span className="flex-1 truncate text-foreground/90 group-hover:text-foreground">
        {item.title}
      </span>

      {item.labels.length > 0 ? (
        <span className="hidden items-center gap-1 md:inline-flex">
          {item.labels.slice(0, 3).map((l) => (
            <span
              key={l.name}
              className="rounded border px-1.5 py-[1px] font-mono text-[9px] tracking-wide"
              style={{
                color: `#${l.color}`,
                backgroundColor: `color-mix(in oklab, #${l.color} 12%, transparent)`,
                borderColor: `color-mix(in oklab, #${l.color} 35%, transparent)`,
              }}
            >
              {l.name}
            </span>
          ))}
          {item.labels.length > 3 ? (
            <span className="font-mono text-[10px] text-muted-foreground">
              +{item.labels.length - 3}
            </span>
          ) : null}
        </span>
      ) : null}

      <span className="w-48 truncate text-right font-mono text-[11px] text-muted-foreground">
        {item.repo}
      </span>

      <span className="font-mono text-[11px] text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
        ↗
      </span>
    </Link>
  );
}
