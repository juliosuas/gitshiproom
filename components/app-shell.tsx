"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import {
  LayoutDashboard,
  Inbox,
  CircleDot,
  ListTodo,
  Settings,
  Ship,
  Sparkles,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TokenStatus } from "./token-status";
import { ShortcutsCheatsheet } from "./shortcuts-cheatsheet";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const links = [
  {
    href: "/",
    label: "Home",
    Icon: LayoutDashboard,
    tint: "var(--coral)",
    match: (p: string) => p === "/",
  },
  {
    href: "/inbox",
    label: "Pull requests",
    Icon: Inbox,
    tint: "var(--ocean)",
    match: (p: string) => p.startsWith("/inbox") || p.startsWith("/pr/"),
  },
  {
    href: "/issues",
    label: "Issues",
    Icon: CircleDot,
    tint: "var(--sun)",
    match: (p: string) => p.startsWith("/issues"),
  },
  {
    href: "/pendientes",
    label: "Pendientes",
    Icon: ListTodo,
    tint: "var(--meadow)",
    match: (p: string) => p.startsWith("/pendientes"),
  },
  {
    href: "/settings",
    label: "Settings",
    Icon: Settings,
    tint: "color-mix(in oklab, var(--foreground) 50%, transparent)",
    match: (p: string) => p.startsWith("/settings"),
  },
];

function UserBadge() {
  const { data } = useSWR<{ hasToken: boolean; user?: { login: string; avatar_url: string; name?: string | null } }>(
    "/api/health",
    fetcher,
    { refreshInterval: 120_000 },
  );
  const ok = data?.hasToken ?? false;
  const user = data?.user;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-raised/80 p-2.5">
      {user?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar_url}
          alt={user.login}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-coral text-sm font-semibold text-white">
          J
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="truncate text-[13px] font-semibold">
          {user?.name || user?.login || "Ship captain"}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            className="dot"
            style={{
              width: 6,
              height: 6,
              backgroundColor: ok ? "var(--meadow)" : "var(--rose)",
              boxShadow: ok
                ? "0 0 0 3px color-mix(in oklab, var(--meadow) 25%, transparent)"
                : "0 0 0 3px color-mix(in oklab, var(--rose) 25%, transparent)",
            }}
          />
          {ok ? "Connected to GitHub" : "Offline"}
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  return (
    <div className="grid h-dvh grid-cols-[260px_1fr]">
      <aside
        className="flex h-full flex-col gap-6 border-r border-border px-5 py-6"
        style={{ backgroundColor: "var(--sidebar)" }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-coral text-white shadow-lift"
          >
            <Ship className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <div className="font-display text-lg font-semibold leading-none tracking-tight">
              GitShipRoom
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              v0.1 · local
            </div>
          </div>
        </Link>

        <UserBadge />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ href, label, Icon, tint, match }) => {
            const active = match(path);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-surface text-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    active ? "text-white" : "group-hover:bg-accent",
                  )}
                  style={
                    active
                      ? { backgroundColor: tint }
                      : { color: tint }
                  }
                >
                  <Icon className="h-4 w-4" strokeWidth={2.25} />
                </div>
                <span className={cn("font-medium", active && "text-foreground")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer — AI + cheatsheet */}
        <div className="space-y-2">
          <div
            className="flex items-center gap-2.5 rounded-xl border border-coral/30 bg-coral/10 px-3 py-2.5 text-[12px]"
            style={{ color: "var(--coral)" }}
          >
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2.25} />
            <span className="font-medium">
              Claude is your co-pilot
            </span>
          </div>
          <button
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
          >
            <span className="flex items-center gap-2">
              <Keyboard className="h-3.5 w-3.5" />
              Shortcuts
            </span>
            <kbd className="rounded border border-border bg-accent/40 px-1.5 py-px font-mono text-[10px]">
              ?
            </kbd>
          </button>
        </div>
      </aside>

      <main className="flex min-h-0 flex-col overflow-hidden">
        <TokenStatus />
        <ShortcutsCheatsheet />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
