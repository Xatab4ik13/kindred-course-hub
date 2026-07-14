import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import type { DictKey } from "@/i18n/dict";
import { cn } from "@/lib/utils";
import teacher1 from "@/assets/teachers/teacher-1.webp";
import teacher2 from "@/assets/teachers/teacher-2.webp";
import teacher3 from "@/assets/teachers/teacher-3.webp";
import teacher4 from "@/assets/teachers/teacher-4.webp";
import lead1 from "@/assets/leadership/timofey.jpg";
import lead2 from "@/assets/leadership/nikolay.jpg";
import lead3 from "@/assets/leadership/vadim.jpg";

type Tab = "teachers" | "leadership";

type Person = {
  photo: string;
  nameKey: DictKey;
  roleKey: DictKey;
  bioKey: DictKey;
};

const TEACHERS: Person[] = [
  {
    photo: teacher1,
    nameKey: "team.t1.name",
    roleKey: "team.t1.role",
    bioKey: "team.t1.bio",
  },
  {
    photo: teacher2,
    nameKey: "team.t2.name",
    roleKey: "team.t2.role",
    bioKey: "team.t2.bio",
  },
  {
    photo: teacher3,
    nameKey: "team.t3.name",
    roleKey: "team.t3.role",
    bioKey: "team.t3.bio",
  },
  {
    photo: teacher4,
    nameKey: "team.t4.name",
    roleKey: "team.t4.role",
    bioKey: "team.t4.bio",
  },
];

const LEADERSHIP: Person[] = [
  {
    photo: lead1,
    nameKey: "team.l1.name",
    roleKey: "team.l1.role",
    bioKey: "team.l1.bio",
  },
  {
    photo: lead2,
    nameKey: "team.l2.name",
    roleKey: "team.l2.role",
    bioKey: "team.l2.bio",
  },
  {
    photo: lead3,
    nameKey: "team.l3.name",
    roleKey: "team.l3.role",
    bioKey: "team.l3.bio",
  },
];

function PersonCard({
  person,
  showSchedule,
}: {
  person: Person;
  showSchedule: boolean;
}) {
  const { t } = useI18n();

  return (
    <article className="group flex h-full flex-col">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-brand-soft shadow-soft"
        style={{
          borderRadius: "58% 42% 55% 45% / 45% 40% 60% 55%",
        }}
      >
        <img
          src={person.photo}
          alt={t(person.nameKey)}
          loading="lazy"
          width={768}
          height={1024}
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--brand) 25%, transparent) 100%)",
          }}
        />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <h3 className="font-display text-2xl font-bold leading-tight">
          {t(person.nameKey)}
        </h3>
        <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">
          {t(person.bioKey)}
        </p>

        {showSchedule && (
          <Link
            to="/schedule"
            className="relative mt-6 inline-flex w-fit items-center gap-3 overflow-hidden px-8 py-4 text-base font-semibold text-brand-foreground shadow-soft transition hover:shadow-float"
            style={{
              borderRadius: "62% 38% 58% 42% / 50% 55% 45% 50%",
              backgroundColor: "var(--brand)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden font-display text-[4rem] font-black leading-none tracking-tighter text-white/15"
              style={{ letterSpacing: "-0.05em" }}
            >
              学习汉语
            </span>
            <CalendarDays className="relative h-5 w-5" />
            <span className="relative">{t("team.cta.schedule")}</span>
          </Link>
        )}
      </div>
    </article>
  );
}

function TeamSlider({
  people,
  showSchedule,
}: {
  people: Person[];
  showSchedule: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const tolerance = 4;
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance,
    );
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector("[data-team-card]") as HTMLElement | null;
    const gap = 32;
    const step = firstCard ? firstCard.offsetWidth + gap : el.clientWidth * 0.85;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div className="relative -mx-6 px-6 md:mx-0 md:px-12">
      <motion.div
        ref={trackRef}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ willChange: "scroll-position" }}
      >
        {people.map((person) => (
          <motion.div
            key={person.nameKey}
            data-team-card
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="w-[calc(100vw-3rem)] shrink-0 snap-center sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
          >
            <PersonCard person={person} showSchedule={showSchedule} />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {canScrollLeft && (
          <ScrollArrow direction="left" onClick={() => scroll("left")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canScrollRight && (
          <ScrollArrow direction="right" onClick={() => scroll("right")} />
        )}
      </AnimatePresence>
    </div>
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
        "absolute top-1/2 z-10 -translate-y-1/2",
        "flex h-12 w-12 items-center justify-center rounded-full",
        "bg-surface text-foreground shadow-float backdrop-blur-sm",
        "border border-border/60 transition-shadow hover:shadow-glow",
        direction === "left" ? "left-0" : "right-0",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}

export function TeamSection() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("teachers");
  const isTeachers = tab === "teachers";

  return (
    <section
      id="team"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-[110rem] px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.08)}
          className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              {t("team.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              <span className="block">{t("team.title.1")}</span>
              <span className="block text-brand">{t("team.title.2")}</span>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="inline-flex rounded-full border border-border/70 bg-surface p-1 shadow-soft"
          >
            {(["teachers", "leadership"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "relative rounded-full px-6 py-3 text-base font-semibold transition-colors",
                  tab === k
                    ? "text-brand-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === k && (
                  <motion.span
                    layoutId="team-tab-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  {t(k === "teachers" ? "team.tab.teachers" : "team.tab.leadership")}
                </span>
              </button>
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <TeamSlider
                people={isTeachers ? TEACHERS : LEADERSHIP}
                showSchedule={isTeachers}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
