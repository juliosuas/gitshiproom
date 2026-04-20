export default function SetupPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">Setup</h1>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          1. Create a Personal Access Token
        </h2>
        <p>
          Visit{" "}
          <a
            className="underline"
            href="https://github.com/settings/tokens/new"
            target="_blank"
            rel="noreferrer"
          >
            github.com/settings/tokens/new
          </a>{" "}
          and create a classic token with these scopes:
        </p>
        <ul className="list-disc pl-6 text-sm">
          <li><code>repo</code></li>
          <li><code>read:org</code></li>
          <li><code>read:user</code></li>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. Paste it into .env</h2>
        <pre className="rounded bg-muted p-3 text-sm">
{`# .env (at the repo root)
GITHUB_TOKEN=ghp_your_token_here`}
        </pre>
        <p>
          Then restart the dev server: <code>Ctrl+C</code>,{" "}
          <code>bun run dev</code>.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. Verify</h2>
        <p>
          After restart, this banner should disappear. Go back to{" "}
          <a className="underline" href="/inbox">
            the inbox
          </a>
          .
        </p>
      </section>
    </div>
  );
}
