import Link from "next/link";
import type { InboxItem } from "@/lib/github/inbox";
import { ReasonBadge } from "./reason-badge";
import { cn } from "@/lib/utils";

function relativeTime(iso: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d}d`;
  const w = Math.round(d / 7);
  if (w < 10) return `${w}w`;
  return `${Math.round(d / 30)}mo`;
}

export function PrRow({
  item,
  focused,
  onFocus,
}: {
  item: InboxItem;
  focused: boolean;
  onFocus: () => void;
}) {
  return (
    <Link
      href={`/pr/${item.repo}/${item.number}`}
      onMouseEnter={onFocus}
      className={cn(
        "group relative flex items-center gap-3 border-b border-hairline px-5 py-3 text-sm transition-all duration-150",
        focused ? "row-focus" : "hover:bg-accent/25",
      )}
    >
      <ReasonBadge reason={item.reason} />

      <span className="font-mono text-[11px] text-muted-foreground">
        #{item.number}
      </span>

      <span className="flex-1 truncate">
        <span
          className={cn(
            "text-foreground/90 group-hover:text-foreground",
            focused && "text-foreground",
          )}
        >
          {item.title}
        </span>
        {item.draft ? (
          <span
            className="ml-2 inline-flex items-center rounded border border-hairline bg-muted/50 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
            title="Draft"
          >
            draft
          </span>
        ) : null}
      </span>

      {item.labels.length > 0 ? (
        <span className="hidden items-center gap-1 md:inline-flex">
          {item.labels.slice(0, 2).map((l) => (
            <span
              key={l.name}
              className="rounded border border-hairline px-1.5 py-[1px] font-mono text-[9px] tracking-wide"
              style={{
                color: `#${l.color}`,
                backgroundColor: `color-mix(in oklab, #${l.color} 12%, transparent)`,
                borderColor: `color-mix(in oklab, #${l.color} 35%, transparent)`,
              }}
            >
              {l.name}
            </span>
          ))}
          {item.labels.length > 2 ? (
            <span className="font-mono text-[10px] text-muted-foreground">
              +{item.labels.length - 2}
            </span>
          ) : null}
        </span>
      ) : null}

      <span className="w-44 truncate text-right font-mono text-[11px] text-muted-foreground">
        {item.repo}
      </span>

      <span className="w-20 text-right font-mono text-[11px] text-muted-foreground">
        @{item.author}
      </span>

      <span className="w-10 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
        {relativeTime(item.updated_at)}
      </span>
    </Link>
  );
}
