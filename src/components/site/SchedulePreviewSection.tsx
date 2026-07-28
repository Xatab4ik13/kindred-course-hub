import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
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
import teacher1 from "@/assets/teachers/teacher-1.webp";
import teacher2 from "@/assets/teachers/teacher-2.webp";
import teacher3 from "@/assets/teachers/teacher-3.webp";
import teacher4 from "@/assets/teachers/teacher-4.webp";

// Mock-mapping инициалов на фото. В будущем фото придёт с бекенда.
export const TEACHER_PHOTOS: Record<string, string> = {
  ТБ: teacher1,
  НР: teacher2,
  ВГ: teacher3,
  АС: teacher4,
};

export const DAY_KEYS: DictKey[] = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
];

export const DAY_SHORT_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export type LevelTone = "hsk1" | "hsk2" | "hsk3" | "kids" | "speak" | "individual" | "ege";

export interface Lesson {
  time: string;
  duration: number;
  tone: LevelTone;
  levelKey: DictKey;
  teacherKey: DictKey;
  teacherInitials: string;
  goalId: string;
}

const CHIP: Record<LevelTone, string> = {
  hsk1: "bg-brand/10 text-brand",
  hsk2: "bg-coral-deep/10 text-coral-deep",
  hsk3: "bg-foreground/8 text-foreground",
  kids: "bg-accent/40 text-accent-foreground",
  speak: "bg-tiger/12 text-tiger",
  individual: "bg-muted text-muted-foreground",
  ege: "bg-tiger/15 text-tiger",
};

export const MASCOT_POOL = [mascotDay1, mascotDay2, mascotDay3, mascotDay4];

// Shortcuts for template
const TB = { teacherKey: "schedule.teacher.tb" as DictKey, teacherInitials: "ТБ" };
const NR = { teacherKey: "schedule.teacher.nr" as DictKey, teacherInitials: "НР" };
const VG = { teacherKey: "schedule.teacher.vg" as DictKey, teacherInitials: "ВГ" };

export interface TeacherOption {
  key: DictKey;
  initials: string;
}

export const TEACHERS: TeacherOption[] = [
  { key: "schedule.teacher.tb", initials: "ТБ" },
  { key: "schedule.teacher.nr", initials: "НР" },
  { key: "schedule.teacher.vg", initials: "ВГ" },
];

export interface ScheduleFilter {
  teacherKey: DictKey | null;
  query: string;
}

export const EMPTY_FILTER: ScheduleFilter = { teacherKey: null, query: "" };

export interface FilteredLesson {
  lesson: Lesson;
  no: string;
}

export function filterDayLessons(
  lessons: Lesson[],
  dow: number,
  filter: ScheduleFilter,
): FilteredLesson[] {
  const q = filter.query.trim().toLowerCase().replace(/^№|^#/, "");
  return lessons
    .map((lesson, i) => ({ lesson, no: groupNumber(dow, i) }))
    .filter(({ lesson, no }) => {
      if (filter.teacherKey && lesson.teacherKey !== filter.teacherKey) return false;
      if (q && !no.includes(q)) return false;
      return true;
    });
}

export const WEEK_TEMPLATE: Lesson[][] = [
  // Mon
  [
    { time: "09:00", duration: 90, tone: "hsk1", levelKey: "schedule.level.hsk1", ...TB, goalId: "hsk1" },
    { time: "11:00", duration: 60, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "13:30", duration: 90, tone: "hsk2", levelKey: "schedule.level.hsk2", ...VG, goalId: "hsk2" },
    { time: "17:00", duration: 60, tone: "speak", levelKey: "schedule.level.speak", ...TB, goalId: "group" },
    { time: "18:30", duration: 90, tone: "hsk1", levelKey: "schedule.level.hsk1", ...TB, goalId: "hsk1" },
    { time: "20:00", duration: 60, tone: "individual", levelKey: "schedule.level.individual", ...VG, goalId: "individual" },
  ],
  // Tue
  [
    { time: "10:00", duration: 60, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "12:00", duration: 90, tone: "hsk3", levelKey: "schedule.level.hsk3", ...VG, goalId: "hsk2" },
    { time: "16:00", duration: 60, tone: "speak", levelKey: "schedule.level.speak", ...TB, goalId: "group" },
    { time: "18:00", duration: 90, tone: "hsk2", levelKey: "schedule.level.hsk2", ...VG, goalId: "hsk2" },
    { time: "20:00", duration: 60, tone: "individual", levelKey: "schedule.level.individual", ...TB, goalId: "individual" },
  ],
  // Wed
  [
    { time: "09:00", duration: 90, tone: "hsk1", levelKey: "schedule.level.hsk1", ...TB, goalId: "hsk1" },
    { time: "11:00", duration: 60, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "14:00", duration: 60, tone: "individual", levelKey: "schedule.level.individual", ...VG, goalId: "individual" },
    { time: "17:30", duration: 90, tone: "hsk2", levelKey: "schedule.level.hsk2", ...VG, goalId: "hsk2" },
    { time: "19:30", duration: 60, tone: "speak", levelKey: "schedule.level.speak", ...TB, goalId: "group" },
  ],
  // Thu
  [
    { time: "10:00", duration: 90, tone: "hsk3", levelKey: "schedule.level.hsk3", ...VG, goalId: "hsk2" },
    { time: "12:00", duration: 60, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "15:00", duration: 60, tone: "ege", levelKey: "schedule.level.ege", ...VG, goalId: "ege" },
    { time: "18:00", duration: 90, tone: "hsk1", levelKey: "schedule.level.hsk1", ...TB, goalId: "hsk1" },
    { time: "19:30", duration: 90, tone: "hsk3", levelKey: "schedule.level.hsk3", ...VG, goalId: "hsk2" },
  ],
  // Fri
  [
    { time: "09:00", duration: 60, tone: "speak", levelKey: "schedule.level.speak", ...TB, goalId: "group" },
    { time: "11:00", duration: 90, tone: "hsk2", levelKey: "schedule.level.hsk2", ...VG, goalId: "hsk2" },
    { time: "14:00", duration: 60, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "17:00", duration: 90, tone: "hsk1", levelKey: "schedule.level.hsk1", ...TB, goalId: "hsk1" },
    { time: "19:00", duration: 60, tone: "individual", levelKey: "schedule.level.individual", ...VG, goalId: "individual" },
  ],
  // Sat
  [
    { time: "10:00", duration: 90, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "12:00", duration: 60, tone: "speak", levelKey: "schedule.level.speak", ...TB, goalId: "group" },
    { time: "14:00", duration: 90, tone: "hsk2", levelKey: "schedule.level.hsk2", ...VG, goalId: "hsk2" },
    { time: "16:00", duration: 60, tone: "ege", levelKey: "schedule.level.ege", ...VG, goalId: "ege" },
  ],
  // Sun
  [
    { time: "11:00", duration: 60, tone: "kids", levelKey: "schedule.level.kids", ...NR, goalId: "kids" },
    { time: "13:00", duration: 90, tone: "hsk1", levelKey: "schedule.level.hsk1", ...TB, goalId: "hsk1" },
    { time: "15:30", duration: 60, tone: "speak", levelKey: "schedule.level.speak", ...TB, goalId: "group" },
  ],
];

// Deterministic group number per (dayIndex, lessonIndex) — stable and readable.
export function groupNumber(dayIndex: number, lessonIndex: number) {
  return String(dayIndex * 10 + lessonIndex + 35).padStart(3, "0");
}

function startOfWeek(d: Date) {
  const day = (d.getDay() + 6) % 7;
  const r = new Date(d);
  r.setDate(d.getDate() - day);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function SchedulePreviewSection() {
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
    <section id="schedule" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader eyebrow={t("schedule.title")} title={t("schedule.subtitle")} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
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

      <div className="mt-8">
        <ScheduleFilters value={filter} onChange={setFilter} showQuery={false} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            const isPast = d.getTime() < todayTime;
            const mascot = MASCOT_POOL[idx % MASCOT_POOL.length]!;

            const monthShort = d.toLocaleString(locale, { month: "long" });
            const dowShort = d.toLocaleString(locale, { weekday: "short" });
            const dayLabel = isToday ? t("schedule.today") : t(dayKey);

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
                  label={dayLabel}
                  monthShort={monthShort}
                  dowShort={dowShort}
                  isToday={isToday}
                  isPast={isPast}
                  mascot={mascot}
                />

                <div className="flex flex-col gap-3">
                  {lessons.map((l, i) => (
                    <LessonCard
                      key={i}
                      lesson={l}
                      groupNo={groupNumber(dow, i)}
                      disabled={isPast}
                      onClick={() => !isPast && setEnrollGoal(l.goalId)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
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

export function DayPlaque({
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

export function LessonCard({
  lesson,
  groupNo,
  disabled,
  onClick,
}: {
  lesson: Lesson;
  groupNo: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const { t } = useI18n();
  const teacherName = t(lesson.teacherKey);
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
        <div className="min-w-0">
          <div className="font-heading text-2xl font-black tabular-nums leading-none text-foreground">
            {lesson.time}
          </div>
          <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
            {t("schedule.groupPrefix")}
            {groupNo}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider",
            CHIP[lesson.tone],
          )}
        >
          {t(lesson.levelKey)}
        </span>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">{t("schedule.duration")}</p>
        <p className="text-sm font-bold text-foreground">
          {lesson.duration} {t("schedule.minutes")}
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-border/50 pt-3">
        <TeacherAvatar initials={lesson.teacherInitials} name={teacherName} />

        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-medium text-muted-foreground">
            {t("schedule.teacherLabel")}
          </span>
          <span className="truncate text-sm font-bold text-foreground">{teacherName}</span>
        </div>
      </div>
    </motion.button>
  );
}

function TeacherAvatar({ initials, name }: { initials: string; name: string }) {
  const photo = TEACHER_PHOTOS[initials];
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        decoding="async"
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border/60"
      />
    );
  }
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/40 text-[11px] font-black text-accent-foreground">
      {initials}
    </div>
  );
}

function HeaderArrow({
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
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "←" : "→"}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface text-foreground shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)] transition-opacity",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-glow",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}
