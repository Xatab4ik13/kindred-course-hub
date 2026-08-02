import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EnrollModal } from "@/components/site/EnrollModal";
import {
  DayPlaque,
  LessonCard,
  DAY_KEYS,
  MASCOT_POOL,
  ScheduleFilters,
} from "@/components/site/SchedulePreviewSection";
import { dateKey, dayLessons, EMPTY_FILTER, type ScheduleFilter } from "@/lib/schedule-view";
import { usePublicContent } from "@/lib/public-content";
import { useI18n } from "@/providers/i18n";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Расписание — CHINAR" },
      {
        name: "description",
        content:
          "Расписание групповых и индивидуальных занятий CHINAR на текущую и следующую неделю.",
      },
      { property: "og:title", content: "Расписание — CHINAR" },
      {
        property: "og:description",
        content: "Расписание занятий CHINAR на две недели. Записывайтесь на любой урок.",
      },
    ],
  }),
  component: SchedulePage,
});

function startOfWeek(d: Date) {
  const day = (d.getDay() + 6) % 7;
  const r = new Date(d);
  r.setDate(d.getDate() - day);
  r.setHours(0, 0, 0, 0);
  return r;
}

function SchedulePage() {
  const { t, lang } = useI18n();
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  const start = useMemo(() => startOfWeek(new Date()), []);
  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      }),
    [start],
  );

  const [enrollGoal, setEnrollGoal] = useState<string | null>(null);
  const [filter, setFilter] = useState<ScheduleFilter>(EMPTY_FILTER);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const todayRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const tol = 4;
    setCanLeft(el.scrollLeft > tol);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tol);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector("[data-day-col]") as HTMLElement | null;
    const gap = 24;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    const today = todayRef.current;
    if (today) {
      const left = today.offsetLeft - 16;
      el.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    }
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);

  const todayStr = new Date().toDateString();
  const todayTime = new Date(todayStr).getTime();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-[110rem] px-4 pb-24 pt-10 md:px-8 md:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              {t("nav.schedule")}
            </span>
            <h1 className="mt-4 font-display text-[2.25rem] font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              <span className="block">{t("schedule.pageTitle.1")}</span>
              <span className="block text-brand">{t("schedule.pageTitle.2")}</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {t("schedule.pageLead")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Arrow direction="left" disabled={!canLeft} onClick={() => scroll("left")} />
            <Arrow direction="right" disabled={!canRight} onClick={() => scroll("right")} />
          </div>
        </div>

        <div className="mt-8">
          <ScheduleFilters value={filter} onChange={setFilter} showQuery />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10"
        >
          <div
            ref={trackRef}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 pt-2 sm:mx-0 sm:gap-6 sm:px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {days.map((d, idx) => {
              const dow = (d.getDay() + 6) % 7;
              const dayKey = DAY_KEYS[dow]!;
              const lessons = WEEK_TEMPLATE[dow]!;
              const filtered = filterDayLessons(lessons, dow, filter);
              const isToday = d.toDateString() === todayStr;
              const isPast = d.getTime() < todayTime;
              const mascot = MASCOT_POOL[idx % MASCOT_POOL.length]!;
              const monthShort = d.toLocaleString(locale, { month: "long" });
              const dowShort = d.toLocaleString(locale, { weekday: "short" });
              const label = isToday ? t("schedule.today") : t(dayKey);

              return (
                <div
                  key={idx}
                  data-day-col
                  ref={isToday ? todayRef : undefined}
                  className={cn(
                    "flex w-[82vw] max-w-[340px] shrink-0 snap-start flex-col gap-4 sm:w-[290px] xl:w-[310px]",
                    isPast && "opacity-55",
                  )}
                >
                  <DayPlaque
                    day={d.getDate()}
                    label={label}
                    monthShort={monthShort}
                    dowShort={dowShort}
                    isToday={isToday}
                    isPast={isPast}
                    mascot={mascot}
                  />
                  <div className="flex flex-col gap-3">
                    {filtered.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-border/60 bg-surface/60 p-5 text-center text-xs font-semibold text-muted-foreground">
                        {t("schedule.filter.noResults")}
                      </div>
                    ) : (
                      filtered.map(({ lesson, no }) => (
                        <LessonCard
                          key={no}
                          lesson={lesson}
                          groupNo={no}
                          disabled={isPast}
                          onClick={() => !isPast && setEnrollGoal(lesson.goalId)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
      <Footer />

      <EnrollModal
        open={enrollGoal !== null}
        onClose={() => setEnrollGoal(null)}
        defaultGoal={enrollGoal ?? undefined}
      />
    </div>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "←" : "→"}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-surface text-foreground shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)] transition-opacity",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-glow",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}
