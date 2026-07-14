import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EnrollModal } from "@/components/site/EnrollModal";
import {
  DayPlaque,
  LessonCard,
  WEEK_TEMPLATE,
  DAY_KEYS,
  DAY_SHORT_RU,
  MASCOT_POOL,
} from "@/components/site/SchedulePreviewSection";
import { useI18n } from "@/providers/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Расписание — CHINAR" },
      {
        name: "description",
        content:
          "Полное расписание групповых и индивидуальных занятий CHINAR. Переключайтесь между неделями и записывайтесь на любое занятие.",
      },
      { property: "og:title", content: "Расписание — CHINAR" },
      {
        property: "og:description",
        content: "Полное расписание занятий школы CHINAR. Записывайтесь на любой урок.",
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

function formatRange(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  return `${fmt(start)} — ${fmt(end)}`;
}

function SchedulePage() {
  const { t } = useI18n();
  const baseWeek = useMemo(() => startOfWeek(new Date()), []);
  const [offset, setOffset] = useState(0);
  const [enrollGoal, setEnrollGoal] = useState<string | null>(null);

  const weekStart = useMemo(() => {
    const d = new Date(baseWeek);
    d.setDate(baseWeek.getDate() + offset * 7);
    return d;
  }, [baseWeek, offset]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart],
  );

  const todayStr = new Date().toDateString();
  const todayTime = new Date(todayStr).getTime();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-[110rem] px-4 pb-24 pt-12 md:px-8 md:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              {t("nav.schedule")}
            </span>
            <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              <span className="block">Расписание</span>
              <span className="block text-brand">на любую неделю</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              Выбирайте удобное время и записывайтесь в один клик. Групповые и индивидуальные
              занятия — онлайн и офлайн.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <WeekArrow
              direction="left"
              onClick={() => setOffset((o) => o - 1)}
              disabled={offset <= -4}
            />
            <div className="min-w-[220px] text-center">
              <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                {offset === 0 ? "Текущая неделя" : offset > 0 ? `+${offset} нед.` : `${offset} нед.`}
              </div>
              <div className="mt-1 font-heading text-lg font-black text-foreground">
                {formatRange(weekStart)}
              </div>
            </div>
            <WeekArrow
              direction="right"
              onClick={() => setOffset((o) => o + 1)}
              disabled={offset >= 8}
            />
          </div>
        </div>

        <motion.div
          key={offset}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7"
        >
          {days.map((d, idx) => {
            const dow = (d.getDay() + 6) % 7;
            const dayKey = DAY_KEYS[dow]!;
            const lessons = WEEK_TEMPLATE[dow]!;
            const isToday = d.toDateString() === todayStr;
            const isPast = d.getTime() < todayTime;
            const mascot = MASCOT_POOL[(offset * 7 + idx) % MASCOT_POOL.length]!;
            const monthShort = d.toLocaleString("ru-RU", { month: "long" });
            const label = isToday ? "Сегодня" : t(dayKey);

            return (
              <div
                key={idx}
                className={cn("flex flex-col gap-4", isPast && "opacity-55")}
              >
                <DayPlaque
                  day={d.getDate()}
                  label={label}
                  monthShort={monthShort}
                  dowShort={DAY_SHORT_RU[dow]!}
                  isToday={isToday}
                  isPast={isPast}
                  mascot={mascot}
                />
                <div className="flex flex-col gap-3">
                  {lessons.map((l, i) => (
                    <LessonCard
                      key={i}
                      lesson={l}
                      disabled={isPast}
                      onClick={() => !isPast && setEnrollGoal(l.goalId)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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

function WeekArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Предыдущая неделя" : "Следующая неделя"}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-surface text-foreground shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)] transition-opacity",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-glow",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}
