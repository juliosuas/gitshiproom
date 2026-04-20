import { NextResponse } from "next/server";
import { spawn } from "node:child_process";

export const runtime = "nodejs";

type Kind = "approve" | "request-changes" | "comment";

type Body = {
  intent: string;
  kind: Kind;
  pr: {
    title: string;
    body?: string | null;
    files?: { filename: string; additions: number; deletions: number }[];
    repo: string;
    number: number;
  };
};

export async function POST(req: Request) {
  const data = (await req.json()) as Body;
  const prompt = buildPrompt(data);

  try {
    const draft = await runSmartLlm(prompt);
    return NextResponse.json({ draft });
  } catch (e) {
    const msg = (e as Error).message ?? "LLM call failed";
    return NextResponse.json(
      {
        error: msg,
        hint: "Make sure `smart-llm` is on your PATH and Ollama is running.",
      },
      { status: 500 },
    );
  }
}

function buildPrompt({ intent, kind, pr }: Body): string {
  const tone: Record<Kind, string> = {
    approve:
      "Write a brief, warm approval comment. 1-3 sentences. Call out 1 specific thing you liked.",
    "request-changes":
      "Write a kind but direct 'request changes' comment. Explain the concern in 1-3 sentences. Suggest a concrete next step. Never condescend.",
    comment:
      "Write a thoughtful review comment. 1-4 sentences. Clear, helpful, no filler.",
  };

  const fileList =
    pr.files
      ?.slice(0, 10)
      .map((f) => `  - ${f.filename} (+${f.additions} -${f.deletions})`)
      .join("\n") ?? "(no file list)";

  return `You are drafting a GitHub pull-request review comment for Julio. Respond with ONLY the comment text — no preamble, no markdown headers, no quotes, no signature. Write directly to the PR author.

Tone: ${tone[kind]}
Style: clear, human, short. Use plain English unless the PR body is in Spanish — then mirror that language. Never say "As an AI" or similar. Never apologise. Never hedge more than once.

--- PR metadata ---
Repo: ${pr.repo}
PR: #${pr.number} — ${pr.title}
Files changed:
${fileList}

--- PR description ---
${pr.body?.slice(0, 1500) || "(no description provided)"}

--- Julio's intent for this comment ---
${intent.slice(0, 800)}

Now write the comment:`;
}

function cleanDraft(raw: string): string {
  let s = raw.trim();
  // Strip <think>…</think> blocks (qwen reasoning models emit them)
  s = s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  // Strip leading/trailing wrapping quotes
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  // Strip leading "Comment:" / "Review:" labels the model sometimes adds
  s = s.replace(/^(comment|review|draft)\s*:\s*/i, "");
  return s;
}

function runSmartLlm(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "smart-llm",
      ["--task", "copy", "--max-tokens", "400", "--temp", "0.6"],
      { stdio: ["pipe", "pipe", "pipe"] },
    );

    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error("smart-llm timed out after 90s"));
    }, 90_000);

    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (err += d.toString()));
    proc.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`smart-llm not found or failed to start: ${e.message}`));
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`smart-llm exited ${code}: ${err.slice(0, 300)}`));
        return;
      }
      resolve(cleanDraft(out));
    });

    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}
