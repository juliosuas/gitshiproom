"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ThumbsUp,
  MessageCircleWarning,
  GitMerge,
  Sparkles,
  Send,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useShortcut, useScope } from "./shortcut-provider";
import type { PrDetail } from "@/lib/github/pr-detail";
import { cn } from "@/lib/utils";

type Props = {
  owner: string;
  repo: string;
  number: number;
  mergeable: boolean;
  pr: PrDetail;
};

type Kind = "approve" | "request-changes" | "comment";

export function PrActionsBar({ owner, repo, number, mergeable, pr }: Props) {
  useScope("pr-detail");
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [intent, setIntent] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [drafting, setDrafting] = React.useState(false);
  const [kind, setKind] = React.useState<Kind>("comment");

  async function postReview(event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT", body?: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/prs/${owner}/${repo}/${number}/review`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event, body }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(
        event === "APPROVE"
          ? "Approved ✓"
          : event === "REQUEST_CHANGES"
            ? "Changes requested"
            : "Comment posted",
      );
      router.push("/inbox");
    } catch (e) {
      toast.error(`Failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function doMerge() {
    setBusy(true);
    try {
      const res = await fetch(`/api/prs/${owner}/${repo}/${number}/merge`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ method: "squash" }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Merged 🚢");
      router.push("/inbox");
    } catch (e) {
      toast.error(`Failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function generateDraft() {
    if (!intent.trim()) {
      toast.error("Tell Claude what you want to say first.");
      return;
    }
    setDrafting(true);
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          intent,
          kind,
          pr: {
            title: pr.title,
            body: pr.body,
            repo: `${owner}/${repo}`,
            number,
            files: pr.files.slice(0, 8).map((f) => ({
              filename: f.filename,
              additions: f.additions,
              deletions: f.deletions,
            })),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "draft failed");
      setDraft(data.draft);
    } catch (e) {
      toast.error(`Claude: ${(e as Error).message}`);
    } finally {
      setDrafting(false);
    }
  }

  function sendDraft() {
    const event =
      kind === "approve"
        ? "APPROVE"
        : kind === "request-changes"
          ? "REQUEST_CHANGES"
          : "COMMENT";
    postReview(event, draft);
  }

  useShortcut("a", () => postReview("APPROVE"), "pr-detail");
  useShortcut("m", () => (mergeable ? doMerge() : toast.error("PR not mergeable")), "pr-detail");
  useShortcut("Escape", () => router.push("/inbox"), "pr-detail");

  return (
    <div className="card-soft p-6 space-y-5">
      {/* Primary actions */}
      <div className="grid gap-3 md:grid-cols-3">
        <BigButton
          icon={<ThumbsUp className="h-5 w-5" strokeWidth={2.25} />}
          title="Approve"
          sub="LGTM — ship it"
          tint="var(--meadow)"
          onClick={() => postReview("APPROVE")}
          disabled={busy}
          kbd="a"
        />
        <BigButton
          icon={<MessageCircleWarning className="h-5 w-5" strokeWidth={2.25} />}
          title="Request changes"
          sub="Flag something first"
          tint="var(--rose)"
          onClick={() => {
            setKind("request-changes");
            document.getElementById("ai-intent")?.focus();
          }}
          disabled={busy}
        />
        <BigButton
          icon={<GitMerge className="h-5 w-5" strokeWidth={2.25} />}
          title={mergeable ? "Merge (squash)" : "Merge blocked"}
          sub={mergeable ? "One click, done" : "Fix the blockers first"}
          tint={mergeable ? "var(--coral)" : "var(--muted-foreground)"}
          onClick={doMerge}
          disabled={busy || !mergeable}
          kbd="m"
        />
      </div>

      {/* AI draft magic */}
      <div className="rounded-2xl border border-coral/30 bg-coral/10 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-coral text-white shadow-lift">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">
                Let Claude draft it for you
              </div>
              <div className="text-[12px] text-muted-foreground">
                Tell it what you want to say. It writes the comment. You
                approve, edit, or regenerate.
              </div>
            </div>
          </div>
          <KindPicker value={kind} onChange={setKind} />
        </div>

        <textarea
          id="ai-intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder={intentPlaceholder(kind)}
          rows={2}
          className="w-full resize-none rounded-xl border border-border bg-surface/90 px-4 py-3 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/40"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={generateDraft}
            disabled={drafting || !intent.trim()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition-all",
              "hover:-translate-y-px hover:shadow-float",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
            )}
          >
            {drafting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Claude is thinking…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                {draft ? "Regenerate" : "Draft it"}
              </>
            )}
          </button>
          {draft ? (
            <button
              onClick={() => {
                setDraft("");
                setIntent("");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
          ) : null}
        </div>

        {draft ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3 w-3 text-coral" />
              Draft · edit if you want
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(10, Math.max(4, draft.split("\n").length + 1))}
              className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-coral/40"
            />
            <button
              onClick={sendDraft}
              disabled={busy}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition-all",
                "hover:-translate-y-px hover:shadow-float",
                kind === "approve" && "bg-meadow",
                kind === "request-changes" && "bg-rose",
                kind === "comment" && "bg-ocean",
              )}
            >
              <Send className="h-4 w-4" />
              {kind === "approve" && "Approve with this comment"}
              {kind === "request-changes" && "Request changes with this"}
              {kind === "comment" && "Post comment"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BigButton({
  icon,
  title,
  sub,
  tint,
  onClick,
  disabled,
  kbd,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  tint: string;
  onClick: () => void;
  disabled?: boolean;
  kbd?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition-all",
        "hover:-translate-y-px hover:border-[color:var(--btn-tint)] hover:shadow-lift",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
      )}
      style={{ "--btn-tint": tint } as React.CSSProperties}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
        style={{
          backgroundColor: `color-mix(in oklab, ${tint} 15%, transparent)`,
          color: tint,
        }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-display text-lg font-semibold">{title}</div>
        <div className="text-[12px] text-muted-foreground">{sub}</div>
      </div>
      {kbd ? (
        <kbd className="absolute right-3 top-3 hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-block">
          {kbd}
        </kbd>
      ) : null}
    </button>
  );
}

function KindPicker({
  value,
  onChange,
}: {
  value: Kind;
  onChange: (k: Kind) => void;
}) {
  const opts: { key: Kind; label: string }[] = [
    { key: "comment", label: "Comment" },
    { key: "approve", label: "Approve" },
    { key: "request-changes", label: "Request" },
  ];
  return (
    <div className="flex rounded-xl border border-border bg-surface/80 p-0.5 text-[11px] font-medium">
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "rounded-lg px-2.5 py-1 transition-colors",
            value === o.key
              ? "bg-coral text-white shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function intentPlaceholder(kind: Kind): string {
  if (kind === "approve")
    return "e.g. 'looks great, love the refactor' — Claude will say it nicely.";
  if (kind === "request-changes")
    return "e.g. 'pide que agreguen un test para el timeout'";
  return "e.g. 'ask whether this handles the edge case of empty input'";
}
