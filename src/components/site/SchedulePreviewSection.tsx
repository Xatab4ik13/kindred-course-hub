import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/site/FeaturesSection";
import { useI18n } from "@/providers/i18n";
import type { DictKey } from "@/i18n/dict";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { EnrollModal } from "@/components/site/EnrollModal";
import mascotDay1 from "@/assets/mascot/day-1.png";
import mascotDay2 from "@/assets/mascot/day-2.png";
import mascotDay3 from "@/assets/mascot/day-3.png";
import mascotDay4 from "@/assets/mascot/day-4.png";

const DAY_KEYS: DictKey[] = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
];

const DAY_SHORT_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

type LevelTone = "hsk1" | "hsk2" | "hsk3" | "kids" | "speak" | "individual";

interface Lesson {
  time: string;
  duration: number;
  level: string;
  tone: LevelTone;
  teacher: string;
  teacherName: string;
  goalId: string;
}

// Chip color per level — soft tinted bg + strong text
const CHIP: Record<LevelTone, string> = {
  hsk1: "bg-brand/10 text-brand",
  hsk2: "bg-coral-deep/10 text-coral-deep",
  hsk3: "bg-foreground/8 text-foreground",
  kids: "bg-accent/40 text-accent-foreground",
  speak: "bg-tiger/12 text-tiger",
  individual: "bg-muted text-muted-foreground",
};

// Mascot rotation for the days: today, tomorrow, +2 highlighted; rest muted
const MASCOT_POOL = [mascotDay1, mascotDay2, mascotDay3, mascotDay4];

const WEEK_TEMPLATE: Lesson[][] = [
  // Mon
  [
    { time: "09:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "hsk1" },
    { time: "11:00", duration: 60, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "13:30", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "17:00", duration: 60, level: "Speak", tone: "speak", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "group" },
    { time: "18:30", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "hsk1" },
    { time: "20:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "individual" },
  ],
  // Tue
  [
    { time: "10:00", duration: 60, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "12:00", duration: 90, level: "HSK 3", tone: "hsk3", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "16:00", duration: 60, level: "Speak", tone: "speak", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "group" },
    { time: "18:00", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "20:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "individual" },
  ],
  // Wed
  [
    { time: "09:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "hsk1" },
    { time: "11:00", duration: 60, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "14:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "individual" },
    { time: "17:30", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "19:30", duration: 60, level: "Speak", tone: "speak", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "group" },
  ],
  // Thu
  [
    { time: "10:00", duration: 90, level: "HSK 3", tone: "hsk3", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "12:00", duration: 60, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "15:00", duration: 60, level: "ЕГЭ", tone: "individual", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "ege" },
    { time: "18:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "hsk1" },
    { time: "19:30", duration: 90, level: "HSK 3", tone: "hsk3", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
  ],
  // Fri
  [
    { time: "09:00", duration: 60, level: "Speak", tone: "speak", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "group" },
    { time: "11:00", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "14:00", duration: 60, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "17:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "hsk1" },
    { time: "19:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "individual" },
  ],
  // Sat
  [
    { time: "10:00", duration: 90, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "12:00", duration: 60, level: "Speak", tone: "speak", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "group" },
    { time: "14:00", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "hsk2" },
    { time: "16:00", duration: 60, level: "ЕГЭ", tone: "individual", teacher: "ВГ", teacherName: "Вадим Г.", goalId: "ege" },
  ],
  // Sun
  [
    { time: "11:00", duration: 60, level: "Kids", tone: "kids", teacher: "НР", teacherName: "Николай Р.", goalId: "kids" },
    { time: "13:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "hsk1" },
    { time: "15:30", duration: 60, level: "Speak", tone: "speak", teacher: "ТБ", teacherName: "Тимофей Б.", goalId: "group" },
  ],
];

function startOfWeek(d: Date) {
  const day = (d.getDay() + 6) % 7;
  const r = new Date(d);
  r.setDate(d.getDate() - day);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function SchedulePreviewSection() {
  const { t } = useI18n();
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
      const left = today.offsetLeft - 24;
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
    <section id="schedule" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader eyebrow={t("schedule.title")} title={t("schedule.subtitle")} />
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <HeaderArrow direction="left" disabled={!canLeft} onClick={() => scroll("left")} />
            <HeaderArrow direction="right" disabled={!canRight} onClick={() => scroll("right")} />
          </div>
          <Link
            to="/schedule"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            {t("schedule.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10"
      >
        <div className="relative">
          {/* Narrow fades — only hint at more content, never cover it */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-background to-transparent sm:w-6" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-background to-transparent sm:w-6" />

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 pb-6 pt-2 sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {days.map((d, idx) => {
              const dow = (d.getDay() + 6) % 7;
              const dayKey = DAY_KEYS[dow]!;
              const lessons = WEEK_TEMPLATE[dow]!;
              const isToday = d.toDateString() === todayStr;
              const isPast = d.getTime() < todayTime;
              const mascot = MASCOT_POOL[idx % MASCOT_POOL.length]!;

              const monthShort = d.toLocaleString("ru-RU", { month: "long" });
              const dayLabel = isToday ? "Сегодня" : t(dayKey);

              return (
                <div
                  key={idx}
                  data-day-col
                  ref={isToday ? todayRef : undefined}
                  className={cn(
                    "flex w-[calc(100vw-3rem)] max-w-[340px] shrink-0 snap-start flex-col gap-4 sm:w-[290px] xl:w-[310px]",
                    isPast && "opacity-55",
                  )}
                >
                  <DayPlaque
                    day={d.getDate()}
                    label={dayLabel}
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
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 sm:hidden">
          <div className="flex items-center gap-2">
            <HeaderArrow direction="left" disabled={!canLeft} onClick={() => scroll("left")} />
            <HeaderArrow direction="right" disabled={!canRight} onClick={() => scroll("right")} />
          </div>
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            {t("schedule.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <EnrollModal
        open={enrollGoal !== null}
        onClose={() => setEnrollGoal(null)}
        defaultGoal={enrollGoal ?? undefined}
      />
    </section>
  );
}

function DayPlaque({
  day,
  label,
  monthShort,
  dowShort,
  isToday,
  isPast,
  mascot,
}: {
  day: number;
  label: string;
  monthShort: string;
  dowShort: string;
  isToday: boolean;
  isPast: boolean;
  mascot: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[32px] p-6 transition-transform",
        isToday
          ? "bg-brand text-brand-foreground shadow-[0_24px_60px_-20px_var(--brand)]"
          : "border border-border/60 bg-surface text-foreground shadow-[0_12px_30px_-18px_rgba(0,0,0,0.15)]",
      )}
    >
      <div className="relative z-10">
        <div
          className={cn(
            "text-xs font-extrabold uppercase tracking-[0.2em]",
            isToday ? "text-brand-foreground/80" : "text-muted-foreground",
          )}
        >
          {label}
        </div>
        <div className="font-heading text-6xl font-black leading-none mt-2">{day}</div>
        <div
          className={cn(
            "mt-2 text-base font-bold",
            isToday ? "text-brand-foreground/90" : "text-muted-foreground",
          )}
        >
          {monthShort}, {dowShort}
        </div>
      </div>

      <motion.img
        src={mascot}
        alt=""
        aria-hidden
        loading="lazy"
        className={cn(
          "pointer-events-none absolute -bottom-3 -right-3 h-40 w-40 select-none object-contain",
          isPast && "grayscale opacity-60",
        )}
        style={{ transform: isToday ? "rotate(-8deg)" : "rotate(0deg)" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function LessonCard({
  lesson,
  disabled,
  onClick,
}: {
  lesson: Lesson;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -3 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex flex-col gap-4 rounded-3xl border border-border/60 bg-surface p-5 text-left shadow-[0_8px_24px_-16px_rgba(0,0,0,0.15)] transition-shadow",
        !disabled && "hover:shadow-[0_18px_36px_-18px_rgba(0,0,0,0.2)]",
        disabled && "cursor-not-allowed",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-heading text-2xl font-black tabular-nums leading-none text-foreground">
          {lesson.time}
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider",
            CHIP[lesson.tone],
          )}
        >
          {lesson.level}
        </span>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">Длительность</p>
        <p className="text-sm font-bold text-foreground">{lesson.duration} минут</p>
      </div>

      <div className="flex items-center gap-3 border-t border-border/50 pt-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/40 text-[11px] font-black text-accent-foreground">
          {lesson.teacher}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-muted-foreground">Преподаватель</span>
          <span className="text-sm font-bold text-foreground">{lesson.teacherName}</span>
        </div>
      </div>
    </motion.button>
  );
}

function ScrollArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const xOffset = direction === "left" ? -20 : 20;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: xOffset, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: xOffset, scale: 0.9 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={direction === "left" ? "Назад" : "Вперёд"}
      className={cn(
        "absolute top-1/2 z-20 -translate-y-1/2",
        "flex h-12 w-12 items-center justify-center rounded-full",
        "bg-surface text-foreground shadow-float border border-border/60",
        "transition-shadow hover:shadow-glow",
        direction === "left" ? "left-2" : "right-2",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}
