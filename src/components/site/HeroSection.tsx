import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Mascot } from "@/components/site/Mascot";
import { Chip, SoftCard } from "@/components/site/SoftCard";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, pop, floatY, viewportOnce } from "@/lib/motion";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      {/* Warm backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full bg-brand-soft blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute inset-0 bg-grain opacity-40" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <motion.div initial="hidden" animate="show" variants={stagger(0.1)}>
          <motion.div variants={fadeUp}>
            <Chip>
              <Sparkles className="h-3.5 w-3.5" />
              {t("hero.eyebrow")}
            </Chip>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            {t("hero.title.1")}{" "}
            <span className="relative inline-block text-brand">
              {t("hero.title.2")}
              <svg
                aria-hidden
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 h-3 w-full text-brand/60"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 12 C 80 2, 200 22, 298 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            {t("hero.title.3")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contacts"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-brand-foreground shadow-float hover:scale-[1.02] transition"
            >
              {t("cta.enroll")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center rounded-full border border-border bg-surface px-6 text-base font-semibold text-foreground hover:bg-muted transition"
            >
              {t("cta.learnMore")}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 grid max-w-md grid-cols-3 gap-3">
            <StatBubble n="5+" label={t("hero.stat.teachers")} />
            <StatBubble n="200+" label={t("hero.stat.students")} />
            <StatBubble n="6" label={t("hero.stat.levels")} />
          </motion.div>
        </motion.div>

        {/* Right: mascot card */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={pop}
          className="relative mx-auto w-full max-w-md"
        >
          <motion.div animate={floatY.animate}>
            <SoftCard className="relative p-8 pt-12">
              <div className="absolute -top-4 left-6 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground shadow-soft">
                {t("hero.card.badge")}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="font-hanzi text-7xl font-bold text-brand leading-none">
                  {t("hero.card.hi")}
                </div>
                <div className="mt-2 text-sm tracking-widest text-muted-foreground">
                  {t("hero.card.pinyin")}
                </div>
                <Mascot pose="hello" size={220} className="mt-4" />
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["HSK 1", "HSK 3", "HSK 6"].map((l) => (
                    <Chip key={l}>{l}</Chip>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 right-6 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-semibold shadow-soft">
                {t("hero.card.native")}
              </div>
            </SoftCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatBubble({ n, label }: { n: string; label: string }) {
  return (
    <motion.div
      variants={pop}
      whileInView="show"
      viewport={viewportOnce}
      className="rounded-2xl bg-surface border border-border/70 p-3 text-center shadow-soft"
    >
      <div className="font-display text-2xl font-extrabold text-brand">{n}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </motion.div>
  );
}
