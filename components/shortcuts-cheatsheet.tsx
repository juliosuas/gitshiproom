"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { SHORTCUTS } from "@/lib/shortcuts";
import { useShortcut } from "./shortcut-provider";

const scopeConfig: Record<string, { label: string; accent: string }> = {
  global: { label: "Anywhere", accent: "var(--signal-cyan)" },
  inbox: { label: "In the inbox", accent: "var(--signal-amber)" },
  "pr-detail": { label: "On a PR", accent: "var(--signal-green)" },
  issues: { label: "In issues", accent: "var(--signal-rose)" },
};

export function ShortcutsCheatsheet() {
  const [open, setOpen] = React.useState(false);
  useShortcut("?", () => setOpen(true), "global");

  const grouped = React.useMemo(() => {
    const g: Record<string, typeof SHORTCUTS[number][]> = {};
    for (const s of SHORTCUTS) {
      (g[s.scope] ??= []).push(s);
    }
    return g;
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-2xl !bg-card !border-border !p-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b border-hairline bg-background/40 px-6 py-4 !space-y-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span
                className="signal-dot"
                style={{
                  backgroundColor: "var(--signal-cyan)",
                  color: "var(--signal-cyan)",
                }}
              />
              Keyboard atlas
            </div>
            <DialogTitle className="font-display text-2xl italic !font-normal">
              Every move, one key.
            </DialogTitle>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <Kbd>esc</Kbd> close
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto px-6 py-5">
          {Object.entries(grouped).map(([scope, entries]) => {
            const cfg = scopeConfig[scope] ?? {
              label: scope,
              accent: "var(--foreground)",
            };
            return (
              <div key={scope} className="mb-5 last:mb-0">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span
                    className="signal-dot"
                    style={{
                      backgroundColor: cfg.accent,
                      color: cfg.accent,
                    }}
                  />
                  {cfg.label}
                </div>
                <div className="divide-y divide-hairline overflow-hidden rounded-md border border-hairline">
                  {entries.map((s) => (
                    <div
                      key={`${s.scope}-${s.key}`}
                      className="flex items-center justify-between px-4 py-2 text-sm"
                    >
                      <span className="text-foreground/85">{s.label}</span>
                      <span className="flex items-center gap-1">
                        {s.key.split(" ").map((k, i) => (
                          <Kbd key={i}>{k}</Kbd>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-hairline bg-background/40 px-6 py-2.5 text-center text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          ⌘ — muscle memory is the fastest interface
        </div>
      </DialogContent>
    </Dialog>
  );
}
