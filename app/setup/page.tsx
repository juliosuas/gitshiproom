import Link from "next/link";
import { Ship, KeyRound, Rocket, ExternalLink, Check } from "lucide-react";

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-14 space-y-10">
      <div className="space-y-4 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl gradient-coral text-white shadow-float">
          <Ship className="h-7 w-7" strokeWidth={2.25} />
        </div>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance">
          Let&apos;s get your ship-room online
        </h1>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground text-pretty">
          Just one token — your GitHub stays on this machine, your PRs show up
          in the dashboard, and Claude can start drafting comments for you.
        </p>
      </div>

      <div className="space-y-3">
        <Step
          index={1}
          icon={<KeyRound className="h-5 w-5" strokeWidth={2.25} />}
          title="Create a token"
          tint="var(--coral)"
        >
          <p className="text-[15px] text-muted-foreground">
            Open{" "}
            <a
              className="text-foreground underline decoration-coral decoration-2 underline-offset-4 hover:decoration-[3px]"
              href="https://github.com/settings/tokens/new?scopes=repo,read:org,read:user&description=GitShipRoom"
              target="_blank"
              rel="noreferrer"
            >
              the GitHub token page
            </a>
            . These three scopes are already pre-selected for you:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {["repo", "read:org", "read:user"].map((s) => (
              <div
                key={s}
                className="inline-flex items-center gap-2 rounded-xl border border-meadow/30 bg-meadow/10 px-3 py-2 text-[12px] font-mono"
                style={{ color: "var(--meadow)" }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                {s}
              </div>
            ))}
          </div>
        </Step>

        <Step
          index={2}
          icon={<ExternalLink className="h-5 w-5" strokeWidth={2.25} />}
          title="Paste it in .env"
          tint="var(--ocean)"
        >
          <p className="text-[15px] text-muted-foreground">
            At the repo root, drop the token into the{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[13px]">
              .env
            </code>{" "}
            file:
          </p>
          <pre className="card-soft overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
            <span className="text-muted-foreground"># .env</span>
            {"\n"}
            <span style={{ color: "var(--ocean)" }}>GITHUB_TOKEN</span>
            <span className="text-muted-foreground">=</span>
            <span style={{ color: "var(--coral)" }}>ghp_yourtokenhere</span>
          </pre>
        </Step>

        <Step
          index={3}
          icon={<Rocket className="h-5 w-5" strokeWidth={2.25} />}
          title="Restart the server"
          tint="var(--meadow)"
        >
          <p className="text-[15px] text-muted-foreground">
            Stop dev with{" "}
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-px font-mono text-[11px]">
              Ctrl
            </kbd>
            <kbd className="ml-1 rounded-md border border-border bg-muted px-1.5 py-px font-mono text-[11px]">
              C
            </kbd>
            , then:
          </p>
          <pre className="card-soft overflow-x-auto p-4 font-mono text-[13px]">
            <span style={{ color: "var(--meadow)" }}>$</span> bun run dev
          </pre>
          <p className="text-[15px] text-muted-foreground">
            The amber banner disappears and{" "}
            <Link
              href="/"
              className="text-foreground underline decoration-coral decoration-2 underline-offset-4"
            >
              your dashboard
            </Link>{" "}
            goes live.
          </p>
        </Step>
      </div>

      <div className="rounded-2xl border border-coral/30 bg-coral/10 p-5 text-center text-sm text-muted-foreground">
        Nothing you paste here ever leaves this machine. No server calls, no
        telemetry. The token sits in a local{" "}
        <code className="font-mono text-foreground">.env</code>.
      </div>
    </div>
  );
}

function Step({
  index,
  icon,
  title,
  tint,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-soft p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in oklab, ${tint} 15%, transparent)`,
            color: tint,
          }}
        >
          {icon}
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Step {index}
          </div>
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
