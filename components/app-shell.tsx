"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { TokenStatus } from "./token-status";
import { ShortcutsCheatsheet } from "./shortcuts-cheatsheet";

type NavKey = "inbox" | "issues" | "pendientes" | "settings";

const links: { href: string; label: string; key: NavKey; accent: string }[] = [
  { href: "/inbox", label: "Inbox", key: "inbox", accent: "var(--signal-cyan)" },
  { href: "/issues", label: "Issues", key: "issues", accent: "var(--signal-amber)" },
  { href: "/pendientes", label: "Pendientes", key: "pendientes", accent: "var(--signal-violet)" },
  { href: "/settings", label: "Settings", key: "settings", accent: "var(--signal-rose)" },
];

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function ConnectionPulse() {
  const { data } = useSWR<{ hasToken: boolean }>("/api/health", fetcher, {
    refreshInterval: 60_000,
  });
  const ok = data?.hasToken ?? false;
  return (
    <div className="flex items-center gap-2 text-[11px] tracking-wide text-muted-foreground">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-60",
            ok ? "animate-ping bg-signal-green" : "bg-signal-red",
          )}
          style={{ backgroundColor: ok ? "var(--signal-green)" : "var(--signal-red)" }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: ok ? "var(--signal-green)" : "var(--signal-red)" }}
        />
      </span>
      <span className="font-mono uppercase">
        {ok ? "online" : "disconnected"}
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  return (
    <div className="grid h-dvh grid-cols-[232px_1fr] text-foreground">
      <aside
        className="relative flex h-full flex-col border-r border-hairline px-5 py-6"
        style={{ backgroundColor: "var(--sidebar)" }}
      >
        {/* Brand */}
        <Link href="/inbox" className="mb-8 block space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className="inline-block h-[1px] w-6"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--signal-cyan))",
              }}
            />
            v0.1 · ship room
          </div>
          <h1 className="font-display text-[28px] leading-none">
            <span className="italic">Git</span>
            <span
              className="italic"
              style={{
                color: "var(--signal-cyan)",
                textShadow: "0 0 18px color-mix(in oklab, var(--signal-cyan) 35%, transparent)",
              }}
            >
              Ship
            </span>
            <span className="italic">Room</span>
          </h1>
          <ConnectionPulse />
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
            Decks
          </div>
          {links.map((l) => {
            const active = path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "group relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "nav-rail-active text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
                style={active ? { backgroundColor: "color-mix(in oklab, var(--signal-cyan) 8%, transparent)" } : undefined}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="signal-dot"
                    style={{
                      backgroundColor: active ? l.accent : "color-mix(in oklab, var(--foreground) 20%, transparent)",
                      color: l.accent,
                    }}
                  />
                  <span className={cn(active && "font-medium")}>{l.label}</span>
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider",
                    active ? "text-foreground/60" : "text-muted-foreground/50",
                  )}
                >
                  {l.key === "pendientes" ? "todo" : l.key}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Quick actions footer */}
        <div className="mt-6 space-y-3 border-t border-hairline pt-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
            Bridge controls
          </div>
          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>New pendiente</span>
              <Kbd>n</Kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Shortcuts</span>
              <Kbd>?</Kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Copy Claude cmd</span>
              <Kbd>c</Kbd>
            </div>
          </div>
          <div className="pt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
            juliosuas / localhost
          </div>
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
