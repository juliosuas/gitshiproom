"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShortcut, useScope } from "./shortcut-provider";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  owner: string;
  repo: string;
  number: number;
  mergeable: boolean;
};

export function PrActionsBar({ owner, repo, number, mergeable }: Props) {
  useScope("pr-detail");
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [reqOpen, setReqOpen] = React.useState(false);
  const [body, setBody] = React.useState("");

  async function post(path: string, payload?: object) {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/prs/${owner}/${repo}/${number}/${path}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload ? JSON.stringify(payload) : undefined,
        },
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success(`${path} ok`);
      router.push("/inbox");
    } catch (e) {
      toast.error(`Failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  useShortcut("a", () => post("review", { event: "APPROVE" }), "pr-detail");
  useShortcut("R", () => setReqOpen(true), "pr-detail");
  useShortcut(
    "m",
    () => {
      if (mergeable) post("merge", { method: "squash" });
      else toast.error("PR not mergeable");
    },
    "pr-detail",
  );
  useShortcut("Escape", () => router.push("/inbox"), "pr-detail");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionButton
        onClick={() => post("review", { event: "APPROVE" })}
        disabled={busy}
        accent="var(--signal-green)"
        shortcut="a"
      >
        Approve
      </ActionButton>

      <ActionButton
        onClick={() => setReqOpen(true)}
        disabled={busy}
        accent="var(--signal-red)"
        variant="outline"
        shortcut="R"
      >
        Request changes
      </ActionButton>

      <ActionButton
        onClick={() => post("merge", { method: "squash" })}
        disabled={busy || !mergeable}
        accent="var(--signal-cyan)"
        shortcut="m"
      >
        {mergeable ? "Merge (squash)" : "Merge — blocked"}
      </ActionButton>

      <div className="ml-auto flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        back <Kbd>esc</Kbd>
      </div>

      <Dialog open={reqOpen} onOpenChange={setReqOpen}>
        <DialogContent className="!bg-card !border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl italic">
              Flag changes
            </DialogTitle>
          </DialogHeader>
          <p className="text-[12px] text-muted-foreground">
            The author will get your note and the PR stays blocked until resolved.
          </p>
          <Textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What needs changing?"
            className="font-mono text-sm"
          />
          <DialogFooter>
            <Button
              onClick={async () => {
                await post("review", { event: "REQUEST_CHANGES", body });
                setReqOpen(false);
                setBody("");
              }}
              className="font-mono uppercase tracking-wider"
              style={{
                backgroundColor: "var(--signal-red)",
                color: "white",
              }}
            >
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  accent,
  variant,
  shortcut,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  accent: string;
  variant?: "outline";
  shortcut: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "hover:shadow-[0_0_0_1px_var(--accent-glow),0_0_18px_-4px_var(--accent-glow)]",
        variant === "outline"
          ? "bg-transparent text-foreground/85 hover:text-foreground"
          : "text-foreground",
      )}
      style={
        {
          "--accent-glow": accent,
          borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
          backgroundColor:
            variant === "outline"
              ? "transparent"
              : `color-mix(in oklab, ${accent} 12%, transparent)`,
        } as React.CSSProperties
      }
    >
      <span
        className="signal-dot"
        style={{ backgroundColor: accent, color: accent }}
      />
      <span>{children}</span>
      <Kbd className="ml-1">{shortcut}</Kbd>
    </button>
  );
}
