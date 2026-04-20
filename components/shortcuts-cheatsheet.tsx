"use client";
import * as React from "react";
import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SHORTCUTS } from "@/lib/shortcuts";
import { useShortcut } from "./shortcut-provider";

const scopeConfig: Record<string, { label: string; tint: string }> = {
  global: { label: "Anywhere", tint: "var(--coral)" },
  inbox: { label: "In the inbox", tint: "var(--ocean)" },
  "pr-detail": { label: "On a PR", tint: "var(--meadow)" },
  issues: { label: "In issues", tint: "var(--sun)" },
};

export function ShortcutsCheatsheet() {
  const [open, setOpen] = React.useState(false);
  useShortcut("?", () => setOpen(true), "global");

  const grouped = React.useMemo(() => {
    const g: Record<string, typeof SHORTCUTS[number][]> = {};
    for (const s of SHORTCUTS) (g[s.scope] ??= []).push(s);
    return g;
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-2xl !bg-surface !border-border !rounded-2xl !p-0 overflow-hidden !shadow-float">
        <DialogHeader className="flex flex-row items-start justify-between gap-3 border-b border-border px-6 py-5 !space-y-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-coral text-white shadow-lift">
              <Keyboard className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div>
              <DialogTitle className="font-display text-2xl font-semibold !font-sans">
                Keyboard shortcuts
              </DialogTitle>
              <div className="text-[12px] text-muted-foreground">
                Muscle memory is the fastest interface.
              </div>
            </div>
          </div>
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto px-6 py-5 space-y-5">
          {Object.entries(grouped).map(([scope, entries]) => {
            const cfg = scopeConfig[scope] ?? {
              label: scope,
              tint: "var(--foreground)",
            };
            return (
              <div key={scope}>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest">
                  <span
                    className="dot"
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: cfg.tint,
                      boxShadow: `0 0 0 3px color-mix(in oklab, ${cfg.tint} 22%, transparent)`,
                    }}
                  />
                  <span style={{ color: cfg.tint }}>{cfg.label}</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-border divide-y divide-border">
                  {entries.map((s) => (
                    <div
                      key={`${s.scope}-${s.key}`}
                      className="flex items-center justify-between px-4 py-2.5 text-[14px]"
                    >
                      <span>{s.label}</span>
                      <span className="flex items-center gap-1">
                        {s.key.split(" ").map((k, i) => (
                          <kbd
                            key={i}
                            className="rounded-md border border-border bg-muted px-1.5 py-px font-mono text-[11px] font-medium"
                          >
                            {k}
                          </kbd>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
