"use client";
import useSWR from "swr";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function TokenStatus() {
  const { data } = useSWR<{ hasToken: boolean }>("/api/health", fetcher, {
    refreshInterval: 60_000,
  });
  if (!data) return null;
  if (data.hasToken) return null;
  return (
    <Link
      href="/setup"
      className="group flex items-center justify-between gap-4 border-b border-sun/40 bg-sun/15 px-6 py-3 text-sm transition-colors hover:bg-sun/25"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-sun text-white shadow-soft"
        >
          <AlertTriangle className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <div>
          <div className="font-semibold text-foreground">
            Connect your GitHub to light this up
          </div>
          <div className="text-[12px] text-muted-foreground">
            Add a token to .env — takes 30 seconds, nothing leaves your machine.
          </div>
        </div>
      </div>
      <div className="inline-flex items-center gap-1 text-sm font-semibold text-coral">
        Open setup <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
