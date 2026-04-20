"use client";
import useSWR from "swr";
import type { PrDetail } from "@/lib/github/pr-detail";
import { DiffView } from "./diff-view";
import { PrActionsBar } from "./pr-actions-bar";
import { StatusBadge } from "./status-badge";

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

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ backgroundColor: "var(--signal-cyan)" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--signal-cyan)" }}
            />
          </span>
          fetching pull request
        </div>
      </div>
    );
  }

  const pr = data.detail;

  return (
    <div className="flex h-full flex-col">
      {/* Sticky bridge header */}
      <header
        className="sticky top-0 z-10 border-b border-hairline backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in oklab, var(--background) 85%, transparent)",
        }}
      >
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <a
              href={pr.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {owner}/{repo}
            </a>
            <span className="opacity-40">/</span>
            <span style={{ color: "var(--signal-cyan)" }}>#{pr.number}</span>
            {pr.draft ? (
              <span className="ml-2 rounded border border-hairline px-1.5 py-[1px] text-[9px] text-muted-foreground">
                DRAFT
              </span>
            ) : null}
          </div>

          <h1 className="font-display text-3xl italic leading-tight text-balance">
            {pr.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <Meta label="by">@{pr.author}</Meta>
            <Sep />
            <Meta label="branch">
              <span className="text-foreground/80">{pr.head_ref}</span>
              <span className="mx-1.5 text-muted-foreground">→</span>
              <span className="text-foreground/80">{pr.base_ref}</span>
            </Meta>
            <Sep />
            <Meta label="delta">
              <span style={{ color: "var(--signal-green)" }}>
                +{pr.additions}
              </span>{" "}
              <span style={{ color: "var(--signal-red)" }}>
                −{pr.deletions}
              </span>{" "}
              <span className="text-muted-foreground">
                · {pr.changed_files} files
              </span>
            </Meta>
            {pr.checks.length > 0 ? (
              <>
                <Sep />
                <div className="flex items-center gap-1.5">
                  {pr.checks.slice(0, 3).map((c, i) => (
                    <StatusBadge key={i} conclusion={c.conclusion} />
                  ))}
                </div>
              </>
            ) : null}
            <Sep />
            <Meta label="mergeable">
              <span
                className={
                  pr.mergeable
                    ? "signal-green"
                    : "signal-red"
                }
                style={{
                  color: pr.mergeable
                    ? "var(--signal-green)"
                    : "var(--signal-red)",
                }}
              >
                {pr.mergeable ? "✓ clean" : "✗ blocked"}
              </span>
            </Meta>
          </div>

          <PrActionsBar
            owner={owner}
            repo={repo}
            number={pr.number}
            mergeable={Boolean(pr.mergeable)}
          />
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {pr.body ? (
          <div className="rounded-lg border border-hairline bg-card/40 p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Description
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
              {pr.body}
            </p>
          </div>
        ) : null}
        <DiffView files={pr.files} />
      </div>
    </div>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      {children}
    </span>
  );
}

function Sep() {
  return <span className="text-muted-foreground/40">·</span>;
}
