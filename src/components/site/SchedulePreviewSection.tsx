import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/site/FeaturesSection";
import { SoftCard } from "@/components/site/SoftCard";
import { useI18n } from "@/providers/i18n";
import type { DictKey } from "@/i18n/dict";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DAY_KEYS: DictKey[] = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
];

// Deterministic sample lessons for preview
const SAMPLE: Record<number, { time: string; label: string; tone: "brand" | "accent" | "muted" }[]> = {
  0: [{ time: "18:00", label: "HSK 1", tone: "brand" }],
  1: [{ time: "10:00", label: "Kids", tone: "accent" }],
  3: [{ time: "19:30", label: "HSK 3", tone: "brand" }],
  5: [{ time: "12:00", label: "Speak", tone: "muted" }],
  8: [{ time: "18:00", label: "HSK 1", tone: "brand" }],
  10: [{ time: "19:30", label: "HSK 3", tone: "brand" }],
  12: [{ time: "11:00", label: "Kids", tone: "accent" }],
};

function startOfWeek(d: Date) {
  const day = (d.getDay() + 6) % 7; // Mon=0
  const r = new Date(d);
  r.setDate(d.getDate() - day);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function SchedulePreviewSection() {
  const { t } = useI18n();
  const start = startOfWeek(new Date());
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader eyebrow={t("schedule.title")} title={t("schedule.subtitle")} />
        <Link
          to="/schedule"
          className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          {t("schedule.cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mt-12"
      >
        <SoftCard className="overflow-hidden p-4 md:p-6">
          {[0, 1].map((week) => (
            <div key={week} className={week === 1 ? "mt-4" : ""}>
              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {days.slice(week * 7, week * 7 + 7).map((d, i) => {
                  const idx = week * 7 + i;
                  const dayKey = DAY_KEYS[i]!;
                  const items = SAMPLE[idx] ?? [];
                  const isToday = d.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "min-h-28 rounded-2xl border border-border/70 bg-background/60 p-2.5 md:p-3",
                        isToday && "border-brand/60 bg-brand-soft/40",
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t(dayKey)}
                        </span>
                        <span className={cn("text-sm font-bold", isToday && "text-brand")}>
                          {d.getDate()}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {items.map((it, j) => (
                          <div
                            key={j}
                            className={cn(
                              "rounded-lg px-2 py-1 text-[11px] font-semibold",
                              it.tone === "brand" && "bg-brand text-brand-foreground",
                              it.tone === "accent" && "bg-accent text-accent-foreground",
                              it.tone === "muted" && "bg-muted text-foreground",
                            )}
                          >
                            <div>{it.time}</div>
                            <div className="opacity-90">{it.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </SoftCard>
      </motion.div>
    </section>
  );
}
