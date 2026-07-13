import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function SoftCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface text-surface-foreground border border-border/60 shadow-soft",
        className,
      )}
      {...rest}
    />
  );
}

export function Chip({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand px-3 py-1 text-xs font-medium",
        className,
      )}
      {...rest}
    />
  );
}
