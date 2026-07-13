import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Mascot } from "@/components/site/Mascot";
import { Chip } from "@/components/site/SoftCard";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, pop, viewportOnce } from "@/lib/motion";

export function HeroSection() {
  const { t } = useI18n();
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const glyphY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={sceneRef} className="relative overflow-hidden">
      {/* Warm backdrop */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full bg-brand-soft blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute inset-0 bg-grain opacity-40" />
      </motion.div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[1.05fr_1fr] md:px-8 md:py-24">
        {/* Left: copy */}
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

        {/* Right: mascot arch scene */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={pop}
          className="relative mx-auto aspect-[4/5] w-full max-w-md"
        >
          {/* Red seal 印 far background */}
          <motion.div
            style={{ y: glyphY }}
            className="absolute -right-4 top-6 z-0 flex h-28 w-28 items-center justify-center rounded-md bg-brand text-brand-foreground font-hanzi text-5xl font-black shadow-float rotate-[8deg]"
            aria-hidden
          >
            印
          </motion.div>

          {/* Floating hanzi */}
          <motion.div
            style={{ y: glyphY }}
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 top-12 font-hanzi text-4xl font-bold text-brand/25"
            >
              你好
            </motion.span>
            <motion.span
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-2 bottom-24 font-hanzi text-5xl font-bold text-brand/20"
            >
              学
            </motion.span>
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute left-6 bottom-10 font-hanzi text-3xl font-bold text-foreground/15"
            >
              茶
            </motion.span>
          </motion.div>

          {/* Arch (门) — moon gate shaped card */}
          <div
            className="relative z-10 h-full w-full overflow-hidden border border-border/70 bg-gradient-to-b from-brand-soft to-surface shadow-float"
            style={{
              borderTopLeftRadius: "9999px",
              borderTopRightRadius: "9999px",
              borderBottomLeftRadius: "32px",
              borderBottomRightRadius: "32px",
            }}
          >
            {/* Inner light */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_60%)]" />

            {/* Top badge */}
            <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full bg-foreground text-background px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase shadow-soft">
              {t("hero.card.badge")}
            </div>

            {/* Big hanzi greeting */}
            <div className="absolute inset-x-0 top-20 z-10 text-center">
              <div className="font-hanzi text-[88px] leading-none font-black text-brand/90">
                {t("hero.card.hi")}
              </div>
              <div className="mt-1 text-[11px] tracking-[0.35em] text-muted-foreground">
                {t("hero.card.pinyin")}
              </div>
            </div>

            {/* Mascot standing at the bottom of the arch, with parallax */}
            <motion.div
              style={{ y: parallaxY }}
              className="absolute inset-x-0 bottom-0 z-20 flex justify-center"
            >
              <Mascot pose="hello" size={300} interactive />
            </motion.div>

            {/* Ground shadow */}
            <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 h-4 w-40 -translate-x-1/2 rounded-full bg-foreground/25 blur-lg" />
          </div>

          {/* Floating HSK chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-4 bottom-16 z-20 rounded-2xl bg-surface border border-border/70 px-4 py-3 shadow-float"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("hero.card.native")}
            </div>
            <div className="mt-1 flex gap-1.5">
              {["HSK 1", "HSK 3", "HSK 6"].map((l) => (
                <span
                  key={l}
                  className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand"
                >
                  {l}
                </span>
              ))}
            </div>
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
