"use client";
import * as React from "react";
import { ListTodo, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="!max-w-lg !bg-surface !border-border !rounded-2xl !p-0 overflow-hidden !shadow-float">
        <DialogHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-4 !space-y-0">
          <DialogTitle className="flex items-center gap-2.5 !font-sans !font-semibold text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-meadow/15" style={{ color: "var(--meadow)" }}>
              <ListTodo className="h-4 w-4" strokeWidth={2.25} />
            </div>
            Capture a pendiente
          </DialogTitle>
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono text-[10px] text-muted-foreground">
            n
          </kbd>
        </DialogHeader>

        <div className="px-5 py-5">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="What's on your mind?"
            className="w-full border-0 bg-transparent font-display text-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-5 py-3 text-[11px] text-muted-foreground">
          <span>Stored locally in SQLite · never leaves this machine</span>
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-coral px-3 py-1.5 text-[12px] font-semibold text-white shadow-soft transition-all hover:shadow-lift disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
