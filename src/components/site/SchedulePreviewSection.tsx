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
import { usePublicContent } from "@/lib/public-content";
import type { Teacher } from "@/lib/admin-data";
import {
  dateKey,
  dayLessons,
  EMPTY_FILTER,
  type LessonView,
  type LevelTone,
  type ScheduleFilter,
} from "@/lib/schedule-view";
import mascotDay1 from "@/assets/mascot/day-1.png";
import mascotDay2 from "@/assets/mascot/day-2.png";
import mascotDay3 from "@/assets/mascot/day-3.png";
import mascotDay4 from "@/assets/mascot/day-4.png";

export { EMPTY_FILTER, dayLessons, dateKey };
export type { ScheduleFilter, LessonView };

export const DAY_KEYS: DictKey[] = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
];

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
  const { lessons, teachers } = usePublicContent();
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
        <ScheduleFilters value={filter} onChange={setFilter} teachers={teachers} showQuery={false} />
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
            const filtered = dayLessons(lessons, teachers, dateKey(d), filter);
            const isToday = d.toDateString() === todayStr;
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
                  {filtered.length === 0 ? (
                    <EmptyDay text={t("schedule.filter.noResults")} />
                  ) : (
                    filtered.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
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
  disabled,
  onClick,
}: {
  lesson: LessonView;
  disabled: boolean;
  onClick: () => void;
}) {
  const { t } = useI18n();
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
            {lesson.group}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider",
            CHIP[lesson.tone],
          )}
        >
          {lesson.level}
        </span>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">{t("schedule.duration")}</p>
        <p className="text-sm font-bold text-foreground">
          {lesson.duration} {t("schedule.minutes")}
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-border/50 pt-3">
        <TeacherAvatar
          initials={lesson.teacherInitials}
          name={lesson.teacherName}
          photo={lesson.teacherPhoto}
        />

        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-medium text-muted-foreground">
            {t("schedule.teacherLabel")}
          </span>
          <span className="truncate text-sm font-bold text-foreground">{lesson.teacherName}</span>
        </div>
      </div>
    </motion.button>
  );
}

function TeacherAvatar({
  initials,
  name,
  photo,
}: {
  initials: string;
  name: string;
  photo?: string;
}) {
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

export function ScheduleFilters({
  value,
  onChange,
  teachers,
  showQuery = true,
}: {
  value: ScheduleFilter;
  onChange: (next: ScheduleFilter) => void;
  teachers: Teacher[];
  showQuery?: boolean;
}) {
  const { t } = useI18n();
  const mode: "all" | "byTeacher" = value.teacherId ? "byTeacher" : "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Mode segments */}
      <div className="inline-flex rounded-full bg-muted/60 p-1 text-sm font-bold self-start">
        <button
          type="button"
          onClick={() => onChange({ ...value, teacherId: null })}
          className={cn(
            "rounded-full px-4 py-1.5 transition",
            mode === "all"
              ? "bg-surface text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t("schedule.filter.all")}
        </button>
        <button
          type="button"
          disabled={teachers.length === 0}
          onClick={() => onChange({ ...value, teacherId: teachers[0]?.id ?? null })}
          className={cn(
            "rounded-full px-4 py-1.5 transition disabled:opacity-40",
            mode === "byTeacher"
              ? "bg-surface text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t("schedule.filter.byTeacher")}
        </button>
      </div>

      {/* Teacher chips */}
      {mode === "byTeacher" && (
        <div className="flex flex-wrap items-center gap-2">
          {teachers.map((teacher) => {
            const active = value.teacherId === teacher.id;
            return (
              <button
                key={teacher.id}
                type="button"
                onClick={() => onChange({ ...value, teacherId: teacher.id })}
                className={cn(
                  "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-bold transition",
                  active
                    ? "border-brand bg-brand text-brand-foreground shadow-soft"
                    : "border-border/60 bg-surface text-foreground hover:border-brand/60",
                )}
              >
                {teacher.photo ? (
                  <img
                    src={teacher.photo}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-white/40"
                  />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/40 text-[10px] font-black text-accent-foreground">
                    {teacher.initials}
                  </span>
                )}
                <span className="truncate">{teacher.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Group number search */}
      {showQuery && (
        <div className="sm:ml-auto">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground">
              №
            </span>
            <input
              inputMode="numeric"
              value={value.query}
              onChange={(e) => onChange({ ...value, query: e.target.value })}
              placeholder={t("schedule.filter.searchByNo")}
              className="h-11 w-full rounded-full border border-border/60 bg-surface pl-9 pr-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 sm:w-56"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function EmptyDay({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border/60 bg-surface/60 p-5 text-center text-xs font-semibold text-muted-foreground">
      {text}
    </div>
  );
}
