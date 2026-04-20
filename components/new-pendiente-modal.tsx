"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useShortcut } from "./shortcut-provider";

export function NewPendienteModal({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  useShortcut("n", () => setOpen(true), "global");

  async function submit() {
    if (!title.trim()) return;
    await fetch("/api/pendientes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-lg !bg-card !border-border !p-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b border-hairline bg-background/40 px-5 py-3 !space-y-0">
          <DialogTitle className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground !font-normal">
            <span
              className="signal-dot"
              style={{
                backgroundColor: "var(--signal-violet)",
                color: "var(--signal-violet)",
              }}
            />
            new pendiente
          </DialogTitle>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Kbd>esc</Kbd> cancel
          </div>
        </DialogHeader>

        <div className="px-5 py-5">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="What needs doing?"
            className="w-full border-0 bg-transparent font-display text-2xl italic text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between border-t border-hairline bg-background/40 px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          <span>local · sqlite</span>
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="flex items-center gap-2 rounded border px-2.5 py-1 transition-colors disabled:opacity-40"
            style={{
              borderColor:
                "color-mix(in oklab, var(--signal-violet) 30%, transparent)",
              color: "var(--signal-violet)",
              backgroundColor:
                "color-mix(in oklab, var(--signal-violet) 10%, transparent)",
            }}
          >
            log it <Kbd>↵</Kbd>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
