import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

/**
 * Hero — Direction A ("Имя и тишина").
 * Coral background (referenced from chinar.base44.app), huge CHINAR wordmark,
 * minimal signature and one link. Diagonal cut into cream background at bottom.
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-coral text-brand-foreground">
      {/* Subtle warm gradient wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_20%,color-mix(in_oklab,var(--coral-deep)_45%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_10%_90%,color-mix(in_oklab,var(--coral-deep)_25%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay" />
      </div>

      {/* Content: 100vh minus header, generous negative space */}
      <div className="relative mx-auto flex min-h-[calc(100svh-64px)] max-w-[110rem] flex-col px-6 pt-16 pb-40 md:px-12 md:pt-24 md:pb-56">
        {/* Small brand monogram — top-left mark, echoes header logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-2xl border border-brand-foreground/25 font-hanzi text-lg font-bold text-brand-foreground/85"
          >
            中
          </span>
          <span className="font-display text-[11px] uppercase tracking-[0.35em] text-brand-foreground/70">
            с 2019
          </span>
        </motion.div>

        {/* Center wordmark */}
        <div className="flex flex-1 items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-none tracking-[-0.055em] text-brand-foreground text-center"
            style={{ fontSize: "clamp(6rem, 22vw, 22rem)" }}
          >
            CHINAR
          </motion.h1>
        </div>

        {/* Bottom row: signature left, quiet link right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6"
        >
          <div className="flex min-w-0 items-center gap-3 text-brand-foreground/80">
            <span className="h-px w-8 shrink-0 bg-brand-foreground/40" />
            <span className="truncate font-sans text-[11px] uppercase tracking-[0.35em]">
              китайский язык · Москва
            </span>
          </div>

          <Link
            to="/schedule"
            className="group inline-flex shrink-0 items-center gap-3 font-sans text-[11px] uppercase tracking-[0.35em] text-brand-foreground/85 hover:text-brand-foreground transition-colors"
          >
            расписание
            <span
              aria-hidden
              className="h-px w-8 bg-brand-foreground/60 transition-all duration-500 group-hover:w-14"
            />
          </Link>
        </motion.div>
      </div>

      {/* Diagonal cut transition into cream (page background) */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-24 bg-background md:h-32"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 55%, 52% 0, 0 45%)" }}
      />
    </section>
  );
}
