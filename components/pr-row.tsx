import Link from "next/link";
import { MessageSquare, User, Crown } from "lucide-react";
import type { InboxItem } from "@/lib/github/inbox";
import { cn } from "@/lib/utils";

function relativeTime(iso: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d}d ago`;
  const w = Math.round(d / 7);
  if (w < 10) return `${w}w ago`;
  return `${Math.round(d / 30)}mo ago`;
}

const reasonConfig: Record<
  InboxItem["reason"],
  { label: string; tint: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }
> = {
  "review-requested": { label: "Review", tint: "var(--ocean)", Icon: MessageSquare },
  assigned: { label: "Assigned", tint: "var(--sun)", Icon: User },
  authored: { label: "Yours", tint: "var(--coral)", Icon: Crown },
};

export function PrRow({
  item,
  focused,
  onFocus,
}: {
  item: InboxItem;
  focused: boolean;
  onFocus: () => void;
}) {
  const cfg = reasonConfig[item.reason];
  const Icon = cfg.Icon;
  return (
    <Link
      href={`/pr/${item.repo}/${item.number}`}
      onMouseEnter={onFocus}
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all",
        focused
          ? "border-coral/30 bg-surface shadow-lift"
          : "border-transparent hover:border-border hover:bg-surface/60",
      )}
    >
      {/* Reason indicator */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `color-mix(in oklab, ${cfg.tint} 12%, transparent)`,
          color: cfg.tint,
        }}
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </div>

      {/* Avatar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://avatars.githubusercontent.com/${item.author}`}
        alt={item.author}
        className="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-semibold"
            style={{ color: cfg.tint }}
          >
            {cfg.label}
          </span>
          <span className="text-[11px] text-muted-foreground">·</span>
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {item.repo}
          </span>
          <span className="text-[11px] text-muted-foreground">·</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            #{item.number}
          </span>
          {item.draft ? (
            <span className="rounded-md bg-muted px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              draft
            </span>
          ) : null}
        </div>
        <div className="truncate text-[15px] font-medium leading-snug text-foreground group-hover:text-coral">
          {item.title}
        </div>
        {item.labels.length > 0 ? (
          <div className="flex items-center gap-1.5 pt-0.5">
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

      <div className="hidden shrink-0 text-right md:block">
        <div className="text-[11px] text-muted-foreground">@{item.author}</div>
        <div className="text-[11px] text-muted-foreground/70">
          {relativeTime(item.updated_at)}
        </div>
      </div>
    </Link>
  );
}
