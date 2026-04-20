"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShortcut, useScope } from "./shortcut-provider";
import { PrRow } from "./pr-row";
import { EmptyState } from "./empty-state";
import type { InboxItem } from "@/lib/github/inbox";
import { buildClaudeCommand } from "./claude-command-copy";
import { useSettings } from "@/hooks/use-settings";

export function PrInboxList({ items }: { items: InboxItem[] }) {
  useScope("inbox");
  const router = useRouter();
  const [focus, setFocus] = React.useState(0);
  const settings = useSettings();

  useShortcut(
    "j",
    () => setFocus((i) => Math.min(items.length - 1, i + 1)),
    "inbox",
  );
  useShortcut("k", () => setFocus((i) => Math.max(0, i - 1)), "inbox");
  useShortcut(
    "Enter",
    () => {
      const it = items[focus];
      if (it) router.push(`/pr/${it.repo}/${it.number}`);
    },
    "inbox",
  );
  useShortcut(
    "c",
    async () => {
      const it = items[focus];
      if (!it || !settings) return;
      const cmd = buildClaudeCommand({
        template:
          settings.claude_command_template ??
          'cd {repo_dir} && claude "Work on {kind} #{number}: {title}"',
        repo_dir_root: settings.repo_dir_root ?? "~/Projects/github",
        repo_name: it.repo.split("/")[1],
        kind: "pr",
        number: it.number,
        title: it.title,
      });
      await navigator.clipboard.writeText(cmd);
      toast.success("Claude command copied.");
    },
    "inbox",
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="All hands on deck — inbox is clear"
        hint="No PRs waiting on you. Press n to queue a pendiente."
      />
    );
  }

  return (
    <div>
      {items.map((item, i) => (
        <PrRow
          key={item.id}
          item={item}
          focused={i === focus}
          onFocus={() => setFocus(i)}
        />
      ))}
    </div>
  );
}
