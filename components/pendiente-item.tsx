"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { Pendiente } from "@/lib/db/pendientes";
import { cn } from "@/lib/utils";

export function PendienteItem({
  p,
  onToggle,
  onDelete,
}: {
  p: Pendiente;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 border-b border-hairline px-5 py-3 text-sm transition-colors hover:bg-accent/25",
        p.done && "opacity-60",
      )}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={p.done}
          onCheckedChange={onToggle}
          className="data-[state=checked]:!bg-[var(--signal-cyan)] data-[state=checked]:!border-[var(--signal-cyan)]"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div
          className={cn(
            "leading-snug text-foreground/90",
            p.done && "text-muted-foreground line-through decoration-signal-cyan decoration-1",
          )}
        >
          {p.title}
        </div>
        {p.body ? (
          <div className="whitespace-pre-wrap text-[12px] leading-relaxed text-muted-foreground">
            {p.body}
          </div>
        ) : null}
        {p.linked_url ? (
          <a
            className="inline-flex items-center gap-1 rounded border border-signal-violet/30 bg-signal-violet/10 px-1.5 py-[1px] font-mono text-[10px] transition-colors hover:border-signal-violet/60"
            style={{ color: "var(--signal-violet)" }}
            href={p.linked_url}
            target="_blank"
            rel="noreferrer"
          >
            {p.linked_kind ?? "link"} ↗ {shortenUrl(p.linked_url)}
          </a>
        ) : null}
      </div>

      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
        <span className="text-muted-foreground/60">
          {formatCreated(p.created_at)}
        </span>
        <button
          onClick={onDelete}
          className="text-muted-foreground/60 opacity-0 transition-opacity hover:text-signal-red group-hover:opacity-100"
          style={{ color: undefined }}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function shortenUrl(u: string): string {
  try {
    const url = new URL(u);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname}`.slice(0, 50);
  } catch {
    return u.slice(0, 50);
  }
}

function formatCreated(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
