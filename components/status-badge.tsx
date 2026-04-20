import { cn } from "@/lib/utils";

type Cfg = { label: string; accent: string; cls: string; pulse?: boolean };

const map: Record<string, Cfg> = {
  success: {
    label: "passing",
    accent: "var(--signal-green)",
    cls: "bg-signal-green/10 border-signal-green/30",
  },
  failure: {
    label: "failing",
    accent: "var(--signal-red)",
    cls: "bg-signal-red/10 border-signal-red/30",
  },
  cancelled: {
    label: "cancelled",
    accent: "var(--signal-red)",
    cls: "bg-signal-red/10 border-signal-red/30",
  },
  neutral: {
    label: "neutral",
    accent: "color-mix(in oklab, var(--foreground) 55%, transparent)",
    cls: "bg-muted/60 border-border",
  },
  skipped: {
    label: "skipped",
    accent: "color-mix(in oklab, var(--foreground) 55%, transparent)",
    cls: "bg-muted/60 border-border",
  },
};

export function StatusBadge({ conclusion }: { conclusion: string | null }) {
  const v: Cfg =
    map[conclusion ?? ""] ?? {
      label: conclusion ?? "pending",
      accent: "var(--signal-amber)",
      cls: "bg-signal-amber/10 border-signal-amber/30",
      pulse: true,
    };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-[1px] font-mono text-[10px] uppercase tracking-[0.14em]",
        v.cls,
      )}
      style={{ color: v.accent }}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        {v.pulse ? (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
            style={{ backgroundColor: v.accent }}
          />
        ) : null}
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: v.accent }}
        />
      </span>
      {v.label}
    </span>
  );
}
