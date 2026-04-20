"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShortcut, useScope } from "./shortcut-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  owner: string;
  repo: string;
  number: number;
  mergeable: boolean;
};

export function PrActionsBar({ owner, repo, number, mergeable }: Props) {
  useScope("pr-detail");
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [reqOpen, setReqOpen] = React.useState(false);
  const [body, setBody] = React.useState("");

  async function post(path: string, payload?: object) {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/prs/${owner}/${repo}/${number}/${path}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload ? JSON.stringify(payload) : undefined,
        },
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success(`${path} ok`);
      router.push("/inbox");
    } catch (e) {
      toast.error(`Failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  useShortcut(
    "a",
    () => post("review", { event: "APPROVE" }),
    "pr-detail",
  );
  useShortcut("R", () => setReqOpen(true), "pr-detail");
  useShortcut(
    "m",
    () => {
      if (mergeable) post("merge", { method: "squash" });
      else toast.error("PR not mergeable");
    },
    "pr-detail",
  );
  useShortcut("Escape", () => router.push("/inbox"), "pr-detail");

  return (
    <div className="flex gap-2">
      <Button
        disabled={busy}
        onClick={() => post("review", { event: "APPROVE" })}
      >
        Approve (a)
      </Button>
      <Button disabled={busy} variant="outline" onClick={() => setReqOpen(true)}>
        Request changes (R)
      </Button>
      <Button
        disabled={busy || !mergeable}
        onClick={() => post("merge", { method: "squash" })}
      >
        Merge (m)
      </Button>

      <Dialog open={reqOpen} onOpenChange={setReqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request changes</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What needs changing?"
          />
          <DialogFooter>
            <Button
              onClick={async () => {
                await post("review", { event: "REQUEST_CHANGES", body });
                setReqOpen(false);
                setBody("");
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
