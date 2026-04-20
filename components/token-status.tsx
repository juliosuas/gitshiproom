"use client";
import useSWR from "swr";
import Link from "next/link";

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
      className="block bg-destructive px-4 py-2 text-center text-sm text-destructive-foreground"
    >
      GITHUB_TOKEN missing — click to fix
    </Link>
  );
}
