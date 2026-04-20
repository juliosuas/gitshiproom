"use client";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, CheckCircle2, XCircle, AlertCircle, FileText, Circle } from "lucide-react";
import type { PrDetail } from "@/lib/github/pr-detail";
import { DiffView } from "./diff-view";
import { PrActionsBar } from "./pr-actions-bar";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function PrDetailView({
  owner,
  repo,
  number,
}: {
  owner: string;
  repo: string;
  number: number;
}) {
  const { data } = useSWR<{ detail: PrDetail }>(
    `/api/prs/${owner}/${repo}/${number}`,
    fetcher,
    { refreshInterval: 60_000 },
  );

  if (!data) return <PrLoading />;

  const pr = data.detail;
  const firstCheck = pr.checks[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8 space-y-6">
      {/* Back + breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/inbox"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inbox
        </Link>
        <a
          href={pr.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Open on GitHub <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Hero card */}
      <div className="card-soft overflow-hidden">
        <div className="gradient-coral h-1.5 w-full" />
        <div className="p-7 space-y-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="font-mono">
              {owner}/{repo}
            </span>
            <span className="opacity-40">·</span>
            <span className="text-coral font-mono">#{pr.number}</span>
            {pr.draft ? (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                Draft
              </span>
            ) : null}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-balance">
            {pr.title}
          </h1>

          {/* Avatar + author + meta */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://avatars.githubusercontent.com/${pr.author}`}
                alt={pr.author}
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
              <div>
                <div className="text-sm font-semibold">@{pr.author}</div>
                <div className="text-[11px] text-muted-foreground">
                  opened this pull request
                </div>
              </div>
            </div>

            <div className="mx-auto" />

            <MetaPill icon={<GitBranch className="h-3.5 w-3.5" />} tint="var(--ocean)">
              <span className="font-mono">{pr.head_ref}</span>
              <span className="mx-1 opacity-40">→</span>
              <span className="font-mono">{pr.base_ref}</span>
            </MetaPill>
            <MetaPill icon={<FileText className="h-3.5 w-3.5" />} tint="var(--sun)">
              <span className="font-mono text-meadow">+{pr.additions}</span>
              <span className="mx-0.5">·</span>
              <span className="font-mono text-rose">−{pr.deletions}</span>
              <span className="ml-1 text-muted-foreground">
                · {pr.changed_files} files
              </span>
            </MetaPill>
            {firstCheck ? (
              <CheckPill conclusion={firstCheck.conclusion} />
            ) : null}
            <MergeablePill mergeable={pr.mergeable} />
          </div>
        </div>
      </div>

      {/* Actions + AI */}
      <PrActionsBar
        owner={owner}
        repo={repo}
        number={pr.number}
        mergeable={Boolean(pr.mergeable)}
        pr={pr}
      />

      {/* Body */}
      {pr.body ? (
        <div className="card-soft p-6">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Description
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/85">
            {pr.body}
          </p>
        </div>
      ) : null}

      {/* Diff */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Changes</h2>
        <DiffView files={pr.files} />
      </div>
    </div>
  );
}

function MetaPill({
  children,
  icon,
  tint,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tint: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-1 text-[12px]"
      style={{ color: tint }}
    >
      {icon}
      <span className="text-foreground/85">{children}</span>
    </div>
  );
}

function CheckPill({ conclusion }: { conclusion: string | null }) {
  const map: Record<
    string,
    { label: string; tint: string; icon: React.ReactNode }
  > = {
    success: {
      label: "Checks passing",
      tint: "var(--meadow)",
      icon: <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.25} />,
    },
    failure: {
      label: "Checks failing",
      tint: "var(--rose)",
      icon: <XCircle className="h-3.5 w-3.5" strokeWidth={2.25} />,
    },
  };
  const v = map[conclusion ?? ""] ?? {
    label: conclusion ?? "Checks pending",
    tint: "var(--sun)",
    icon: <Circle className="h-3.5 w-3.5" strokeWidth={2.25} />,
  };
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium"
      style={{
        color: v.tint,
        borderColor: `color-mix(in oklab, ${v.tint} 30%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${v.tint} 10%, transparent)`,
      }}
    >
      {v.icon}
      {v.label}
    </div>
  );
}

function MergeablePill({ mergeable }: { mergeable: boolean | null }) {
  const ok = mergeable === true;
  const tint = ok ? "var(--meadow)" : "var(--rose)";
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium"
      style={{
        color: tint,
        borderColor: `color-mix(in oklab, ${tint} 30%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${tint} 10%, transparent)`,
      }}
    >
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.25} />
      ) : (
        <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
      )}
      {ok ? "Ready to merge" : "Merge blocked"}
    </div>
  );
}

function PrLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8 space-y-6">
      <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />
      <div className="card-soft p-7 space-y-4">
        <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="flex gap-3">
          <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-8 w-40 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
