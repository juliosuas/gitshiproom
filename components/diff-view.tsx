import type { PrFile } from "@/lib/github/pr-detail";

export function DiffView({ files }: { files: PrFile[] }) {
  return (
    <div className="space-y-4">
      {files.map((f) => (
        <div key={f.filename} className="rounded border">
          <div className="flex justify-between border-b bg-muted/50 px-3 py-1 text-sm">
            <span className="font-mono">{f.filename}</span>
            <span className="text-xs text-muted-foreground">
              +{f.additions} -{f.deletions}
            </span>
          </div>
          <pre className="overflow-x-auto bg-background p-3 text-xs">
            {f.patch ?? "(binary or too large)"}
          </pre>
        </div>
      ))}
    </div>
  );
}
