"use client";
import useSWR from "swr";
import Link from "next/link";
import {
  ArrowRight,
  GitPullRequest,
  CircleDot,
  ListTodo,
  FolderGit2,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { InboxItem } from "@/lib/github/inbox";
import type { IssueItem } from "@/lib/github/issues";
import type { Pendiente } from "@/lib/db/pendientes";
import { Sparkline } from "@/components/sparkline";
import { QuickPrCard } from "@/components/quick-pr-card";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

type Health = {
  hasToken: boolean;
  user?: { login: string; name: string | null; avatar_url: string };
};

export default function HomePage() {
  const { data: health } = useSWR<Health>("/api/health", fetcher);
  const { data: inbox } = useSWR<{ items: InboxItem[] }>(
    "/api/prs/inbox",
    fetcher,
    { refreshInterval: 60_000 },
  );
  const { data: issues } = useSWR<{ items: IssueItem[] }>(
    "/api/issues",
    fetcher,
    { refreshInterval: 60_000 },
  );
  const { data: pendientes } = useSWR<{ items: Pendiente[] }>(
    "/api/pendientes",
    fetcher,
  );
  const { data: repos } = useSWR<{ repos: { full_name: string }[] }>(
    "/api/repos",
    fetcher,
  );

  const prCount = inbox?.items.length ?? 0;
  const reviewCount =
    inbox?.items.filter((i) => i.reason === "review-requested").length ?? 0;
  const assignedCount =
    inbox?.items.filter((i) => i.reason === "assigned").length ?? 0;
  const authoredCount =
    inbox?.items.filter((i) => i.reason === "authored").length ?? 0;
  const issueCount = issues?.items.length ?? 0;
  const pendientesOpen = pendientes?.items.filter((p) => !p.done).length ?? 0;
  const pendientesDone = pendientes?.items.filter((p) => p.done).length ?? 0;
  const repoCount = repos?.repos.length ?? 0;

  // Build sparkline data from PR updated_at (last 14 days)
  const prActivity = activityByDay(
    [...(inbox?.items.map((i) => i.updated_at) ?? []),
      ...(issues?.items.map((i) => i.updated_at) ?? [])],
    14,
  );

  const firstName =
    health?.user?.name?.split(" ")[0] || health?.user?.login || "there";
  const topPr = inbox?.items[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-10 space-y-10">
      {/* Hero */}
      <section className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium text-coral">
            <Sparkles className="h-4 w-4" />
            {greeting()}, {firstName}
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance">
            {heroLine(prCount, reviewCount)}
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            {subLine(prCount, pendientesOpen)}
          </p>
        </div>
        {health?.user?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={health.user.avatar_url}
            alt={health.user.login}
            className="h-20 w-20 rounded-2xl border border-border object-cover shadow-lift"
          />
        ) : null}
      </section>

      {/* Stats grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          href="/inbox"
          label="Pull requests"
          value={prCount}
          icon={<GitPullRequest className="h-5 w-5" strokeWidth={2.25} />}
          tint="var(--ocean)"
          sub={`${reviewCount} review · ${assignedCount} assigned · ${authoredCount} yours`}
        />
        <StatCard
          href="/issues"
          label="Issues"
          value={issueCount}
          icon={<CircleDot className="h-5 w-5" strokeWidth={2.25} />}
          tint="var(--sun)"
          sub="Open across your repos"
        />
        <StatCard
          href="/pendientes"
          label="Pendientes"
          value={pendientesOpen}
          icon={<ListTodo className="h-5 w-5" strokeWidth={2.25} />}
          tint="var(--meadow)"
          sub={`${pendientesDone} done · local only`}
        />
        <StatCard
          label="Repos"
          value={repoCount}
          icon={<FolderGit2 className="h-5 w-5" strokeWidth={2.25} />}
          tint="var(--coral)"
          sub="Watched by this dashboard"
        />
      </section>

      {/* Activity + Next action */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Activity, last 14 days
              </div>
              <div className="mt-1 font-display text-2xl font-semibold">
                {prActivity.reduce((a, b) => a + b, 0)}{" "}
                <span className="text-lg text-muted-foreground font-sans font-normal">
                  events
                </span>
              </div>
            </div>
            <Legend />
          </div>
          <Sparkline values={prActivity} height={90} />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>14d ago</span>
            <span>today</span>
          </div>
        </div>

        <div className="card-soft p-6 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Most recent PR
            </div>
            <div className="mt-1 font-display text-2xl font-semibold">
              Jump back in
            </div>
          </div>
          {topPr ? (
            <QuickPrCard item={topPr} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Nothing pressing right now. Enjoy the calm.
            </div>
          )}
          <Link
            href="/inbox"
            className="mt-auto flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-coral transition-colors hover:bg-coral/10"
          >
            See all {prCount} pull requests
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quick launch */}
      <section className="grid gap-3 md:grid-cols-3">
        <LaunchCard
          href="/inbox"
          title="Review a PR"
          desc="Approve, request changes, merge — or let Claude draft the comment."
          tint="var(--ocean)"
          icon={<GitPullRequest className="h-6 w-6" strokeWidth={2.25} />}
        />
        <LaunchCard
          href="/pendientes"
          title="Capture an idea"
          desc="Add a pendiente in two keystrokes. Stays on your machine."
          tint="var(--meadow)"
          icon={<ListTodo className="h-6 w-6" strokeWidth={2.25} />}
        />
        <LaunchCard
          href="/issues"
          title="Triage issues"
          desc="See what's open across every repo you touch."
          tint="var(--sun)"
          icon={<CircleDot className="h-6 w-6" strokeWidth={2.25} />}
        />
      </section>
    </div>
  );
}

function StatCard({
  href,
  label,
  value,
  icon,
  tint,
  sub,
}: {
  href?: string;
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tint: string;
  sub: string;
}) {
  const body = (
    <div className="card-lift p-5 h-full">
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in oklab, ${tint} 12%, transparent)`,
            color: tint,
          }}
        >
          {icon}
        </div>
        {href ? (
          <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-coral" />
        ) : null}
      </div>
      <div className="mt-4 space-y-0.5">
        <div className="font-display text-4xl font-semibold leading-none tracking-tight">
          {value}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
      <div className="mt-3 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
  return href ? (
    <Link href={href} className="group block">
      {body}
    </Link>
  ) : (
    body
  );
}

function LaunchCard({
  href,
  title,
  desc,
  tint,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  tint: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="card-lift group block p-5">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `color-mix(in oklab, ${tint} 15%, transparent)`,
          color: tint,
        }}
      >
        {icon}
      </div>
      <div className="mt-4 font-display text-xl font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground text-pretty">{desc}</div>
      <div className="mt-4 flex items-center text-sm font-medium text-coral opacity-0 transition-opacity group-hover:opacity-100">
        Open <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--coral)" }}
        />
        activity
      </div>
    </div>
  );
}

function activityByDay(timestamps: string[], days: number): number[] {
  const buckets = new Array(days).fill(0);
  const dayMs = 86400_000;
  const now = Date.now();
  for (const ts of timestamps) {
    if (!ts) continue;
    const t = new Date(ts).getTime();
    const ago = Math.floor((now - t) / dayMs);
    if (ago >= 0 && ago < days) {
      buckets[days - 1 - ago] += 1;
    }
  }
  return buckets;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function heroLine(prs: number, reviews: number): string {
  if (prs === 0) return "You're all caught up. Clear skies ahead.";
  if (reviews > 0) {
    return `${reviews} ${reviews === 1 ? "PR" : "PRs"} need your review.`;
  }
  return `${prs} pull ${prs === 1 ? "request" : "requests"} on deck.`;
}

function subLine(prs: number, pendientes: number): string {
  if (prs === 0 && pendientes === 0)
    return "Nothing's queued. Capture an idea with n, or add a new pendiente.";
  if (pendientes > 0)
    return `And ${pendientes} ${pendientes === 1 ? "pendiente" : "pendientes"} in your logbook. You've got this.`;
  return "One click and Claude can draft the review for you.";
}
