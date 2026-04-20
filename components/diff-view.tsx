import type { PrFile } from "@/lib/github/pr-detail";
import { cn } from "@/lib/utils";

const statusAccent: Record<string, string> = {
  added: "var(--meadow)",
  modified: "var(--sun)",
  removed: "var(--rose)",
  renamed: "var(--ocean)",
};

export function DiffView({ files }: { files: PrFile[] }) {
  if (files.length === 0) return null;
  return (
    <div className="space-y-3">
      {files.map((f) => {
        const accent = statusAccent[f.status] ?? "var(--coral)";
        return (
          <div
            key={f.filename}
            className="card-soft overflow-hidden"
          >
            <div
              className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5"
              style={{
                backgroundColor: `color-mix(in oklab, ${accent} 5%, transparent)`,
              }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="dot"
                  style={{
                    backgroundColor: accent,
                    width: 7,
                    height: 7,
                    boxShadow: `0 0 0 3px color-mix(in oklab, ${accent} 22%, transparent)`,
                  }}
                />
                <span className="truncate font-mono text-[13px] font-medium">
                  {f.filename}
                </span>
                <span
                  className="rounded-md border px-1.5 py-px text-[10px] font-medium uppercase tracking-wider"
                  style={{
                    color: accent,
                    borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
                  }}
                >
                  {f.status}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span style={{ color: "var(--meadow)" }}>+{f.additions}</span>
                <span style={{ color: "var(--rose)" }}>−{f.deletions}</span>
              </div>
            </div>
            <pre className="overflow-x-auto bg-surface-raised/50 px-4 py-3 font-mono text-[12px] leading-[1.55]">
              {(f.patch ?? "(binary or too large to display)")
                .split("\n")
                .map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "whitespace-pre",
                      line.startsWith("+") && !line.startsWith("+++") && "bg-meadow/10",
                      line.startsWith("-") && !line.startsWith("---") && "bg-rose/10",
                    )}
                    style={lineStyle(line)}
                  >
                    {line || " "}
                  </div>
                ))}
            </pre>
          </div>
        );
      })}
    </div>
  );
}

function lineStyle(line: string): React.CSSProperties | undefined {
  if (line.startsWith("+++") || line.startsWith("---")) {
    return { color: "color-mix(in oklab, var(--foreground) 40%, transparent)" };
  }
  if (line.startsWith("+")) return { color: "var(--meadow)" };
  if (line.startsWith("-")) return { color: "var(--rose)" };
  if (line.startsWith("@@")) {
    return {
      color: "var(--ocean)",
      background: "color-mix(in oklab, var(--ocean) 8%, transparent)",
      padding: "1px 6px",
      margin: "2px -6px",
      borderRadius: "4px",
      fontWeight: 500,
    };
  }
  return undefined;
}
