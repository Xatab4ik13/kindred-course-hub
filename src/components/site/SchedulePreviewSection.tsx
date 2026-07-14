import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Users, Clock } from "lucide-react";
import { SectionHeader } from "@/components/site/FeaturesSection";
import { useI18n } from "@/providers/i18n";
import type { DictKey } from "@/i18n/dict";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { EnrollModal } from "@/components/site/EnrollModal";
import mascotHello from "@/assets/mascot/hello.png";
import mascotWave from "@/assets/mascot/wave.png";
import mascotSmile from "@/assets/mascot/smile.png";

const DAY_KEYS: DictKey[] = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
];

type LevelTone = "hsk1" | "hsk2" | "hsk3" | "kids" | "speak" | "individual";

interface Lesson {
  time: string;
  duration: number; // minutes
  level: string;
  tone: LevelTone;
  teacher: string;
  seatsLeft: number;
  goalId: string;
}

// Tone → color lives ONLY in chip + dot + hover wash. No colored borders.
const TONE: Record<
  LevelTone,
  { dot: string; chip: string; gradient: string; soft: string; glow: string }
> = {
  hsk1: {
    dot: "bg-brand",
    chip: "bg-brand/90 text-brand-foreground",
    gradient: "from-brand/18",
    soft: "bg-brand/12 text-brand",
    glow: "shadow-[0_24px_60px_-20px_var(--brand)]",
  },
  hsk2: {
    dot: "bg-coral-deep",
    chip: "bg-coral-deep/90 text-brand-foreground",
    gradient: "from-coral-deep/18",
    soft: "bg-coral-deep/12 text-coral-deep",
    glow: "shadow-[0_24px_60px_-20px_var(--coral-deep)]",
  },
  hsk3: {
    dot: "bg-foreground",
    chip: "bg-foreground/90 text-background",
    gradient: "from-foreground/14",
    soft: "bg-foreground/10 text-foreground",
    glow: "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]",
  },
  kids: {
    dot: "bg-accent",
    chip: "bg-accent/90 text-accent-foreground",
    gradient: "from-accent/22",
    soft: "bg-accent/16 text-accent-foreground",
    glow: "shadow-[0_24px_60px_-20px_var(--accent)]",
  },
  speak: {
    dot: "bg-tiger",
    chip: "bg-tiger/90 text-brand-foreground",
    gradient: "from-tiger/18",
    soft: "bg-tiger/12 text-tiger",
    glow: "shadow-[0_24px_60px_-20px_var(--tiger)]",
  },
  individual: {
    dot: "bg-muted-foreground/70",
    chip: "bg-white/60 text-foreground",
    gradient: "from-muted-foreground/10",
    soft: "bg-muted/60 text-muted-foreground",
    glow: "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.2)]",
  },
};

// Mascot watermark for the first 3 visible day columns
const MASCOT_WATERMARKS = [mascotHello, mascotWave, mascotSmile];

// Rich sample: 4–8 lessons per weekday, fewer on weekends
const WEEK_TEMPLATE: Lesson[][] = [
  // Mon
  [
    { time: "09:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "Т", seatsLeft: 2, goalId: "hsk1" },
    { time: "11:00", duration: 60, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 3, goalId: "kids" },
    { time: "13:30", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "В", seatsLeft: 1, goalId: "hsk2" },
    { time: "17:00", duration: 60, level: "Speak", tone: "speak", teacher: "Т", seatsLeft: 4, goalId: "group" },
    { time: "18:30", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "Т", seatsLeft: 2, goalId: "hsk1" },
    { time: "20:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "В", seatsLeft: 1, goalId: "individual" },
  ],
  // Tue
  [
    { time: "10:00", duration: 60, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 2, goalId: "kids" },
    { time: "12:00", duration: 90, level: "HSK 3", tone: "hsk3", teacher: "В", seatsLeft: 2, goalId: "hsk2" },
    { time: "16:00", duration: 60, level: "Speak", tone: "speak", teacher: "Т", seatsLeft: 5, goalId: "group" },
    { time: "18:00", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "В", seatsLeft: 3, goalId: "hsk2" },
    { time: "20:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "Т", seatsLeft: 1, goalId: "individual" },
  ],
  // Wed
  [
    { time: "09:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "Т", seatsLeft: 1, goalId: "hsk1" },
    { time: "11:00", duration: 60, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 4, goalId: "kids" },
    { time: "14:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "В", seatsLeft: 2, goalId: "individual" },
    { time: "17:30", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "В", seatsLeft: 2, goalId: "hsk2" },
    { time: "19:30", duration: 60, level: "Speak", tone: "speak", teacher: "Т", seatsLeft: 6, goalId: "group" },
  ],
  // Thu
  [
    { time: "10:00", duration: 90, level: "HSK 3", tone: "hsk3", teacher: "В", seatsLeft: 1, goalId: "hsk2" },
    { time: "12:00", duration: 60, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 3, goalId: "kids" },
    { time: "15:00", duration: 60, level: "ЕГЭ", tone: "individual", teacher: "В", seatsLeft: 2, goalId: "ege" },
    { time: "18:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "Т", seatsLeft: 2, goalId: "hsk1" },
    { time: "19:30", duration: 90, level: "HSK 3", tone: "hsk3", teacher: "В", seatsLeft: 3, goalId: "hsk2" },
  ],
  // Fri
  [
    { time: "09:00", duration: 60, level: "Speak", tone: "speak", teacher: "Т", seatsLeft: 5, goalId: "group" },
    { time: "11:00", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "В", seatsLeft: 2, goalId: "hsk2" },
    { time: "14:00", duration: 60, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 3, goalId: "kids" },
    { time: "17:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "Т", seatsLeft: 1, goalId: "hsk1" },
    { time: "19:00", duration: 60, level: "Индивид.", tone: "individual", teacher: "В", seatsLeft: 1, goalId: "individual" },
  ],
  // Sat
  [
    { time: "10:00", duration: 90, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 2, goalId: "kids" },
    { time: "12:00", duration: 60, level: "Speak", tone: "speak", teacher: "Т", seatsLeft: 6, goalId: "group" },
    { time: "14:00", duration: 90, level: "HSK 2", tone: "hsk2", teacher: "В", seatsLeft: 2, goalId: "hsk2" },
    { time: "16:00", duration: 60, level: "ЕГЭ", tone: "individual", teacher: "В", seatsLeft: 3, goalId: "ege" },
  ],
  // Sun
  [
    { time: "11:00", duration: 60, level: "Kids", tone: "kids", teacher: "Н", seatsLeft: 4, goalId: "kids" },
    { time: "13:00", duration: 90, level: "HSK 1", tone: "hsk1", teacher: "Т", seatsLeft: 2, goalId: "hsk1" },
    { time: "15:30", duration: 60, level: "Speak", tone: "speak", teacher: "Т", seatsLeft: 5, goalId: "group" },
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
    const gap = 20;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    // Center today column on mount
    const today = todayRef.current;
    if (today) {
      const left = today.offsetLeft - el.clientWidth / 2 + today.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    }
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);

  const todayStr = new Date().toDateString();
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toDateString();
  }, []);

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10"
      >
        <div className="relative">
          {/* Gradient edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ willChange: "scroll-position" }}
          >
            {days.map((d, idx) => {
              const dow = (d.getDay() + 6) % 7;
              const dayKey = DAY_KEYS[dow]!;
              const lessons = WEEK_TEMPLATE[dow]!;
              const isToday = d.toDateString() === todayStr;
              const isTomorrow = d.toDateString() === tomorrowStr;
              const isPast = d.getTime() < new Date(todayStr).getTime();
              const mascotIndex = isToday ? 0 : isTomorrow ? 1 : idx <= 2 ? 2 : -1;

              return (
                <div
                  key={idx}
                  data-day-col
                  ref={isToday ? todayRef : undefined}
                  className={cn(
                    "relative w-[260px] shrink-0 snap-start sm:w-[280px]",
                    isPast && "opacity-55",
                  )}
                >
                  {/* Ambient glow behind glass */}
                  {!isPast && (
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -inset-2 rounded-[2.5rem] blur-2xl transition-opacity",
                        isToday
                          ? "bg-brand/25 opacity-100"
                          : isTomorrow
                            ? "bg-tiger/20 opacity-80"
                            : mascotIndex === 2
                              ? "bg-accent/25 opacity-70"
                              : "bg-foreground/5 opacity-60",
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      "relative flex h-full flex-col gap-4 overflow-hidden rounded-[2rem] p-5 transition-all",
                      // Base glass
                      "border border-white/60 bg-white/45 backdrop-blur-2xl",
                      // Deep layered shadow + inner highlight ring
                      "shadow-[0_30px_60px_-24px_rgba(30,20,15,0.25),0_2px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(255,255,255,0.4)_inset]",
                      isPast && "bg-white/25 shadow-none",
                    )}
                  >
                    {/* Top glass sheen */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/70 to-transparent"
                    />
                    {/* Subtle tint layer for special days */}
                    {(isToday || isTomorrow || mascotIndex === 2) && (
                      <div
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-0",
                          isToday
                            ? "bg-gradient-to-br from-brand/20 via-brand/8 to-transparent"
                            : isTomorrow
                              ? "bg-gradient-to-br from-tiger/16 via-tiger/6 to-transparent"
                              : "bg-gradient-to-br from-accent/18 via-accent/6 to-transparent",
                        )}
                      />
                    )}

                    {/* Mascot watermark for first 3 day columns */}
                    {mascotIndex >= 0 && (
                      <img
                        src={MASCOT_WATERMARKS[mascotIndex]}
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 select-none object-contain opacity-30 mix-blend-luminosity"
                        loading="lazy"
                      />
                    )}

                    {/* Day header */}
                    <div className="relative flex items-baseline justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/60">
                          {isToday && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                            </span>
                          )}
                          {isToday ? "Сегодня" : isTomorrow ? "Завтра" : t(dayKey)}
                        </div>
                        <div className="font-heading text-4xl font-black leading-none text-foreground">
                          {d.getDate()}
                        </div>
                      </div>
                      <div className="text-right text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                        <div>{lessons.length} занятий</div>
                        <div className="mt-0.5">
                          {d.toLocaleString("ru-RU", { month: "short" })}
                        </div>
                      </div>
                    </div>


                    {/* Lessons */}
                    <div className="relative flex flex-col gap-3">
                      {lessons.map((l, i) => (
                        <LessonCapsule
                          key={i}
                          lesson={l}
                          disabled={isPast}
                          onClick={() => !isPast && setEnrollGoal(l.goalId)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {canLeft && <ScrollArrow direction="left" onClick={() => scroll("left")} />}
          </AnimatePresence>
          <AnimatePresence>
            {canRight && <ScrollArrow direction="right" onClick={() => scroll("right")} />}
          </AnimatePresence>
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center md:hidden">
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

function LessonCapsule({
  lesson,
  disabled,
  onClick,
}: {
  lesson: Lesson;
  disabled: boolean;
  onClick: () => void;
}) {
  const tone = TONE[lesson.tone];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -3 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-4 text-left shadow-[0_12px_30px_-12px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all",
        tone.border,
        "border-b-4",
        !disabled && "hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]",
        disabled && "cursor-not-allowed",
      )}
    >
      {/* Subtle tone gradient wash */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100",
          tone.gradient,
        )}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div className="font-heading text-lg font-black tabular-nums leading-none text-foreground">
            {lesson.time}
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
              tone.chip,
            )}
          >
            {lesson.level}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-foreground/80">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
            <Clock className="h-3.5 w-3.5" />
            {lesson.duration} мин
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full text-[9px] font-black text-background",
                tone.dot,
              )}
              aria-hidden
            >
              {lesson.teacher}
            </span>
          </span>
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1",
              lesson.seatsLeft <= 1 ? tone.soft : "bg-muted text-muted-foreground",
            )}
          >
            <Users className="h-3 w-3" />
            {lesson.seatsLeft} мест
          </span>
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
