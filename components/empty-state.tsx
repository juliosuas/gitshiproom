import type * as React from "react";

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-hairline"
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--signal-cyan) 6%, transparent)",
          boxShadow:
            "inset 0 0 30px color-mix(in oklab, var(--signal-cyan) 10%, transparent)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--signal-cyan) 18%, transparent) 0%, transparent 70%)",
          }}
        />
        {icon ?? <ShipAnchor />}
      </div>
      <div className="space-y-1">
        <div className="font-display text-xl italic text-foreground/90">
          {title}
        </div>
        {hint ? (
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ShipAnchor() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--signal-cyan)" }}
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v14" />
      <path d="M8 10h8" />
      <path d="M5 15a7 7 0 0 0 14 0" />
    </svg>
  );
}
