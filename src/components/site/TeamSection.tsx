import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import type { DictKey } from "@/i18n/dict";
import { cn } from "@/lib/utils";
import teacher1 from "@/assets/teachers/teacher-1.jpg";
import teacher2 from "@/assets/teachers/teacher-2.jpg";
import teacher3 from "@/assets/teachers/teacher-3.jpg";

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
];

const LEADERSHIP: Person[] = [
  {
    photo: teacher2,
    nameKey: "team.l1.name",
    roleKey: "team.l1.role",
    bioKey: "team.l1.bio",
  },
];

export function TeamSection() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("teachers");
  const list = tab === "teachers" ? TEACHERS : LEADERSHIP;

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

          {/* Tabs */}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 10 }}
            variants={stagger(0.1)}
            className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((p) => (
              <motion.article
                key={p.nameKey}
                variants={fadeUp}
                className="group flex flex-col"
              >
                {/* Curved organic frame */}
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-brand-soft shadow-soft"
                  style={{
                    borderRadius:
                      "58% 42% 55% 45% / 45% 40% 60% 55%",
                  }}
                >
                  <img
                    src={p.photo}
                    alt={t(p.nameKey)}
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
                    {t(p.nameKey)}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">
                    {t(p.bioKey)}
                  </p>

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
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
