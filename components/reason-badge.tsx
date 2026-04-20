import type { InboxReason } from "@/lib/github/inbox";
import { cn } from "@/lib/utils";

const config: Record<
  InboxReason,
  { label: string; accent: string; className: string }
> = {
  "review-requested": {
    label: "review",
    accent: "var(--signal-violet)",
    className: "bg-signal-violet/10 border-signal-violet/30",
  },
  assigned: {
    label: "assigned",
    accent: "var(--signal-amber)",
    className: "bg-signal-amber/10 border-signal-amber/30",
  },
  authored: {
    label: "yours",
    accent: "var(--signal-cyan)",
    className: "bg-signal-cyan/10 border-signal-cyan/30",
  },
};

export function ReasonBadge({ reason }: { reason: InboxReason }) {
  const c = config[reason];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-[1px] font-mono text-[10px] uppercase tracking-[0.14em]",
        c.className,
      )}
      style={{ color: c.accent }}
    >
      <span
        className="signal-dot"
        style={{ backgroundColor: c.accent, color: c.accent }}
      />
      {c.label}
    </span>
  );
}
