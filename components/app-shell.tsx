"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TokenStatus } from "./token-status";

const links = [
  { href: "/inbox", label: "Inbox" },
  { href: "/issues", label: "Issues" },
  { href: "/pendientes", label: "Pendientes" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  return (
    <div className="grid h-dvh grid-cols-[200px_1fr]">
      <aside className="border-r bg-muted/40 p-4">
        <h1 className="mb-6 text-lg font-bold">GitShipRoom</h1>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded px-2 py-1 text-sm hover:bg-accent",
                path.startsWith(l.href) && "bg-accent font-medium",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="overflow-auto">
        <TokenStatus />
        {children}
      </main>
    </div>
  );
}
