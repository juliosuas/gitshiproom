import type { PrFile } from "@/lib/github/pr-detail";

const statusAccent: Record<string, string> = {
  added: "var(--signal-green)",
  modified: "var(--signal-amber)",
  removed: "var(--signal-red)",
  renamed: "var(--signal-violet)",
};

export function DiffView({ files }: { files: PrFile[] }) {
  if (files.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="h-[1px] flex-1 bg-hairline" />
        {files.length} file{files.length === 1 ? "" : "s"} changed
        <span className="h-[1px] flex-1 bg-hairline" />
      </div>
      {files.map((f) => {
        const accent = statusAccent[f.status] ?? "var(--signal-cyan)";
        return (
          <div
            key={f.filename}
            className="overflow-hidden rounded-lg border border-hairline bg-card/40"
          >
            <div
              className="flex items-center justify-between border-b border-hairline px-4 py-2 text-sm"
              style={{
                background: `color-mix(in oklab, ${accent} 6%, transparent)`,
              }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="signal-dot shrink-0"
                  style={{ backgroundColor: accent, color: accent }}
                />
                <span className="truncate font-mono text-[13px] text-foreground/90">
                  {f.filename}
                </span>
                <span
                  className="ml-1 rounded border border-hairline px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider"
                  style={{ color: accent }}
                >
                  {f.status}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span style={{ color: "var(--signal-green)" }}>
                  +{f.additions}
                </span>
                <span style={{ color: "var(--signal-red)" }}>
                  −{f.deletions}
                </span>
              </div>
            </div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-relaxed">
              {(f.patch ?? "(binary or too large)")
                .split("\n")
                .map((line, i) => (
                  <div
                    key={i}
                    className="whitespace-pre"
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
    return { color: "color-mix(in oklab, var(--foreground) 45%, transparent)" };
  }
  if (line.startsWith("+")) return { color: "var(--signal-green)" };
  if (line.startsWith("-")) return { color: "var(--signal-red)" };
  if (line.startsWith("@@")) {
    return {
      color: "var(--signal-cyan)",
      background:
        "color-mix(in oklab, var(--signal-cyan) 10%, transparent)",
      padding: "1px 6px",
      margin: "2px -6px",
      borderRadius: "3px",
    };
  }
  return undefined;
}
