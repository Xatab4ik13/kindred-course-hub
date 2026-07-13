import { motion } from "motion/react";
import { Mascot, type MascotPose } from "@/components/site/Mascot";
import { cn } from "@/lib/utils";

/**
 * Empty state with mascot — use in schedule/admin/teacher lists when no data.
 */
export function EmptyState({
  title,
  description,
  pose = "sad",
  action,
  className,
}: {
  title: string;
  description?: string;
  pose?: MascotPose;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/70 bg-surface/60 px-6 py-12 text-center",
        className,
      )}
    >
      <Mascot pose={pose} size={140} breathe />
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
