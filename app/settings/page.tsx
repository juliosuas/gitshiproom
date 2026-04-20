"use client";
import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const descriptions: Record<string, { title: string; desc: string }> = {
  claude_command_template: {
    title: "Claude command template",
    desc: "Template used when you press c to copy a handoff command. Placeholders: {repo_dir} {repo_name} {kind} {number} {title}.",
  },
  repo_dir_root: {
    title: "Local repo root",
    desc: "Where your repos live on disk. The {repo_dir} placeholder expands to this root + the repo name.",
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
    toast.success("Settings saved.");
    setDirty(false);
    mutate();
  }

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        loading settings
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className="signal-dot"
              style={{
                backgroundColor: "var(--signal-rose)",
                color: "var(--signal-rose)",
              }}
            />
            Settings
          </div>
          <h2 className="font-display text-3xl italic leading-none">
            Ship <span className="text-foreground/70">calibration</span>
          </h2>
        </div>
        <button
          onClick={save}
          disabled={!dirty}
          className="flex items-center gap-2 rounded-md border px-3.5 py-2 text-[11px] font-mono uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            borderColor:
              "color-mix(in oklab, var(--signal-cyan) 35%, transparent)",
            color: "var(--signal-cyan)",
            backgroundColor:
              "color-mix(in oklab, var(--signal-cyan) 12%, transparent)",
          }}
        >
          <span
            className="signal-dot"
            style={{
              backgroundColor: "var(--signal-cyan)",
              color: "var(--signal-cyan)",
            }}
          />
          {dirty ? "Save changes" : "All saved"}
        </button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-5">
          {Object.keys(data.settings).map((k) => {
            const meta = descriptions[k] ?? {
              title: k,
              desc: "Custom setting.",
            };
            return (
              <div
                key={k}
                className="space-y-2 rounded-lg border border-hairline bg-card/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium text-foreground">
                      {meta.title}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k}
                    </div>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {meta.desc}
                </p>
                <Input
                  value={form[k] ?? ""}
                  onChange={(e) => update(k, e.target.value)}
                  className="!bg-background/50 !border-hairline font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-hairline px-6 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span>stored on this machine · sqlite</span>
        <span>
          {dirty ? "unsaved" : "in sync"} ·{" "}
          <Kbd>enter</Kbd> to save
        </span>
      </footer>
    </div>
  );
}
