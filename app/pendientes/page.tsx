"use client";
import useSWR from "swr";
import type { Pendiente } from "@/lib/db/pendientes";
import { PendienteItem } from "@/components/pendiente-item";
import { NewPendienteModal } from "@/components/new-pendiente-modal";
import { EmptyState } from "@/components/empty-state";
import { Kbd } from "@/components/ui/kbd";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function PendientesPage() {
  const { data, mutate } = useSWR<{ items: Pendiente[] }>(
    "/api/pendientes",
    fetcher,
  );

  async function toggle(id: number) {
    await fetch(`/api/pendientes/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ toggle: true }),
    });
    mutate();
  }
  async function del(id: number) {
    await fetch(`/api/pendientes/${id}`, { method: "DELETE" });
    mutate();
  }

  const open = data?.items.filter((p) => !p.done).length ?? 0;
  const done = data?.items.filter((p) => p.done).length ?? 0;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className="signal-dot"
              style={{
                backgroundColor: "var(--signal-violet)",
                color: "var(--signal-violet)",
              }}
            />
            Pendientes
          </div>
          <h2 className="font-display text-3xl italic leading-none">
            {open} <span className="text-foreground/70">orders</span>
            <span className="text-muted-foreground"> in the log</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 font-mono text-[11px] md:flex">
            <div className="flex items-center gap-1.5">
              <span
                className="signal-dot"
                style={{
                  backgroundColor: "var(--signal-violet)",
                  color: "var(--signal-violet)",
                }}
              />
              <span className="text-foreground">{open}</span>
              <span className="text-muted-foreground">open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="signal-dot"
                style={{
                  backgroundColor: "var(--signal-green)",
                  color: "var(--signal-green)",
                }}
              />
              <span className="text-foreground">{done}</span>
              <span className="text-muted-foreground">done</span>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-md border border-hairline px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            press <Kbd>n</Kbd> to add
          </span>
        </div>
      </header>

      <NewPendienteModal onCreated={() => mutate()} />

      <div className="flex-1 overflow-auto">
        {!data ? (
          <div className="flex items-center justify-center py-20 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            loading log
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            title="Logbook is empty"
            hint="Press n to file your first order."
          />
        ) : (
          data.items.map((p) => (
            <PendienteItem
              key={p.id}
              p={p}
              onToggle={() => toggle(p.id)}
              onDelete={() => del(p.id)}
            />
          ))
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-hairline px-6 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span>stored on this machine · never syncs</span>
        <span>
          <Kbd>n</Kbd> new · click to toggle
        </span>
      </footer>
    </div>
  );
}
