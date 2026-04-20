import type * as React from "react";
import { Sparkles } from "lucide-react";

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
        className="flex h-16 w-16 items-center justify-center rounded-3xl gradient-coral text-white shadow-lift"
      >
        {icon ?? <Sparkles className="h-7 w-7" strokeWidth={2} />}
      </div>
      <div className="space-y-1 max-w-sm">
        <div className="font-display text-2xl font-semibold tracking-tight text-balance">
          {title}
        </div>
        {hint ? (
          <div className="text-sm text-muted-foreground text-pretty">
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  );
}
