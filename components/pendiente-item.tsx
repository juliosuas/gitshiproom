"use client";
import { Trash2, ExternalLink } from "lucide-react";
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
        "group flex items-start gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-border hover:bg-surface/60",
        p.done && "opacity-60",
      )}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={p.done}
          onCheckedChange={onToggle}
          className="h-5 w-5 data-[state=checked]:!bg-meadow data-[state=checked]:!border-meadow"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div
          className={cn(
            "text-[15px] leading-snug text-foreground",
            p.done && "line-through text-muted-foreground",
          )}
        >
          {p.title}
        </div>
        {p.body ? (
          <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground">
            {p.body}
          </div>
        ) : null}
        {p.linked_url ? (
          <a
            href={p.linked_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-ocean/30 bg-ocean/10 px-2 py-0.5 text-[11px] font-medium transition-colors hover:border-ocean/50"
            style={{ color: "var(--ocean)" }}
          >
            <ExternalLink className="h-3 w-3" />
            {shortenUrl(p.linked_url)}
          </a>
        ) : null}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>{formatCreated(p.created_at)}</span>
        <button
          onClick={onDelete}
          className="opacity-0 transition-all hover:text-rose group-hover:opacity-100"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function shortenUrl(u: string): string {
  try {
    const url = new URL(u);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname}`.slice(0, 48);
  } catch {
    return u.slice(0, 48);
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
