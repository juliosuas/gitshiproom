import { cn } from "@/lib/utils";
import * as React from "react";

export function Kbd({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("kbd-key", className)} {...props} />;
}
