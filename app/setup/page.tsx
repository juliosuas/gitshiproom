import { Kbd } from "@/components/ui/kbd";

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-8 py-14">
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span
            className="signal-dot"
            style={{
              backgroundColor: "var(--signal-amber)",
              color: "var(--signal-amber)",
            }}
          />
          Setup · first boot
        </div>
        <h1 className="font-display text-4xl italic leading-tight text-balance">
          Wire the{" "}
          <span style={{ color: "var(--signal-cyan)" }}>signal</span> to your
          fleet
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          GitShipRoom needs a GitHub Personal Access Token to pull your PRs,
          issues, and reviews. Everything stays on this machine — your token
          lives in a local <code className="font-mono text-foreground">.env</code> file,
          never leaves localhost.
        </p>
      </div>

      <Step index="01" title="Create a classic PAT">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Open{" "}
          <a
            className="text-foreground underline decoration-signal-cyan decoration-1 underline-offset-2 hover:decoration-2"
            style={{
              textDecorationColor: "var(--signal-cyan)",
            }}
            href="https://github.com/settings/tokens/new?scopes=repo,read:org,read:user&description=GitShipRoom"
            target="_blank"
            rel="noreferrer"
          >
            github.com/settings/tokens/new ↗
          </a>{" "}
          and grant these scopes:
        </p>
        <ul className="grid grid-cols-3 gap-2 font-mono text-[11px]">
          {["repo", "read:org", "read:user"].map((s) => (
            <li
              key={s}
              className="flex items-center gap-2 rounded border border-hairline bg-card/40 px-3 py-2"
            >
              <span
                className="signal-dot"
                style={{
                  backgroundColor: "var(--signal-green)",
                  color: "var(--signal-green)",
                }}
              />
              {s}
            </li>
          ))}
        </ul>
      </Step>

      <Step index="02" title="Drop it in .env">
        <p className="text-sm text-muted-foreground">
          At the repo root, paste the token into <code className="font-mono text-foreground">.env</code>:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-hairline bg-card/60 p-4 font-mono text-[12px] leading-relaxed">
          <span className="text-muted-foreground"># .env</span>
          {"\n"}
          <span style={{ color: "var(--signal-violet)" }}>GITHUB_TOKEN</span>
          <span className="text-muted-foreground">=</span>
          <span style={{ color: "var(--signal-cyan)" }}>ghp_yourtokenhere</span>
        </pre>
      </Step>

      <Step index="03" title="Restart the ship">
        <p className="text-sm text-muted-foreground">
          Stop dev with <Kbd>ctrl</Kbd>
          <Kbd>c</Kbd>, then:
        </p>
        <pre className="rounded-lg border border-hairline bg-card/60 p-4 font-mono text-[12px]">
          <span style={{ color: "var(--signal-green)" }}>$</span> bun run dev
        </pre>
        <p className="pt-1 text-sm text-muted-foreground">
          The amber banner disappears and{" "}
          <a
            href="/inbox"
            className="text-foreground underline underline-offset-2"
            style={{ textDecorationColor: "var(--signal-cyan)" }}
          >
            the inbox
          </a>{" "}
          goes live.
        </p>
      </Step>
    </div>
  );
}

function Step({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-l border-hairline pl-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full border border-hairline font-mono text-[10px] font-medium"
          style={{
            color: "var(--signal-cyan)",
            backgroundColor:
              "color-mix(in oklab, var(--signal-cyan) 10%, transparent)",
            borderColor:
              "color-mix(in oklab, var(--signal-cyan) 30%, transparent)",
          }}
        >
          {index}
        </span>
        <h2 className="font-display text-xl italic">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
