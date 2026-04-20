"use client";
import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save, Terminal, Folder, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const meta: Record<
  string,
  { title: string; desc: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; tint: string }
> = {
  claude_command_template: {
    title: "Claude command template",
    desc: "When you press c in the inbox, we build a shell command you can paste into your terminal. Placeholders: {repo_dir} {repo_name} {kind} {number} {title}.",
    Icon: Terminal,
    tint: "var(--coral)",
  },
  repo_dir_root: {
    title: "Local repo root",
    desc: "Where your repos live on disk. The {repo_dir} placeholder expands to this + the repo name.",
    Icon: Folder,
    tint: "var(--ocean)",
  },
};

export default function SettingsPage() {
  const { data, mutate } = useSWR<{ settings: Record<string, string> }>(
    "/api/settings",
    fetcher,
  );
  const [form, setForm] = React.useState<Record<string, string>>({});
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
      setDirty(false);
    }
  }, [data?.settings]);

  async function save() {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    toast.success("Settings saved ✓");
    setDirty(false);
    mutate();
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-8 py-8">
        <div className="card-soft p-20 text-center text-muted-foreground">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-8 space-y-6">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SettingsIcon className="h-4 w-4" strokeWidth={2.25} />
            Settings
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Make it yours
          </h1>
          <p className="text-muted-foreground">
            Tiny knobs that shape how GitShipRoom behaves.
          </p>
        </div>
        <button
          onClick={save}
          disabled={!dirty}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
            dirty
              ? "bg-coral text-white shadow-lift hover:-translate-y-px hover:shadow-float"
              : "border border-border text-muted-foreground",
          )}
        >
          {dirty ? (
            <>
              <Save className="h-4 w-4" strokeWidth={2.5} />
              Save
            </>
          ) : (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              All saved
            </>
          )}
        </button>
      </header>

      <div className="space-y-4">
        {Object.keys(data.settings).map((k) => {
          const m = meta[k] ?? {
            title: k,
            desc: "Custom setting.",
            Icon: SettingsIcon,
            tint: "var(--ocean)",
          };
          const Icon = m.Icon;
          return (
            <div key={k} className="card-soft p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${m.tint} 12%, transparent)`,
                    color: m.tint,
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.25} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg font-semibold">
                    {m.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {k}
                  </div>
                </div>
              </div>
              <Input
                value={form[k] ?? ""}
                onChange={(e) => {
                  setForm({ ...form, [k]: e.target.value });
                  setDirty(true);
                }}
                className="!bg-background/60 font-mono text-sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
