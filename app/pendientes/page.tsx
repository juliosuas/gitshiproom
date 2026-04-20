"use client";
import useSWR from "swr";
import { ListTodo, Plus } from "lucide-react";
import type { Pendiente } from "@/lib/db/pendientes";
import { PendienteItem } from "@/components/pendiente-item";
import { NewPendienteModal } from "@/components/new-pendiente-modal";
import { EmptyState } from "@/components/empty-state";

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

  const open = data?.items.filter((p) => !p.done) ?? [];
  const done = data?.items.filter((p) => p.done) ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8 space-y-6">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-meadow">
            <ListTodo className="h-4 w-4" strokeWidth={2.25} />
            Pendientes
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {open.length} {open.length === 1 ? "thing" : "things"} to do
          </h1>
          <p className="text-muted-foreground">
            Local to this machine. Never syncs, never leaves.
          </p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "n" }))}
          className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-px hover:shadow-float"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add pendiente
          <kbd className="rounded-md bg-white/25 px-1 py-px font-mono text-[10px]">n</kbd>
        </button>
      </header>

      <NewPendienteModal onCreated={() => mutate()} />

      {!data ? (
        <div className="card-soft flex items-center justify-center px-6 py-20 text-sm text-muted-foreground">
          Loading…
        </div>
      ) : open.length === 0 && done.length === 0 ? (
        <div className="card-soft">
          <EmptyState
            title="Logbook is empty."
            hint="Press n to add your first pendiente."
            icon={<ListTodo className="h-7 w-7" strokeWidth={2} />}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {open.length > 0 ? (
            <section className="card-soft">
              <div className="border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Open · {open.length}
              </div>
              <div className="space-y-1 p-3">
                {open.map((p) => (
                  <PendienteItem
                    key={p.id}
                    p={p}
                    onToggle={() => toggle(p.id)}
                    onDelete={() => del(p.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {done.length > 0 ? (
            <section className="card-soft">
              <div className="border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Done · {done.length}
              </div>
              <div className="space-y-1 p-3">
                {done.map((p) => (
                  <PendienteItem
                    key={p.id}
                    p={p}
                    onToggle={() => toggle(p.id)}
                    onDelete={() => del(p.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
