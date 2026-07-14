import { motion } from "motion/react";

/**
 * Hero — тишина и имя. Только коралловый фон и wordmark CHINAR.
 * Никаких подписей, дат, ссылок, монограмм — чистая обложка.
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-coral text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_20%,color-mix(in_oklab,var(--coral-deep)_45%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_10%_90%,color-mix(in_oklab,var(--coral-deep)_25%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-64px)] max-w-[110rem] items-center justify-center px-6 pb-40 md:px-12 md:pb-56">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-none tracking-[-0.055em] text-black text-center"
          style={{ fontSize: "clamp(6rem, 22vw, 22rem)" }}
        >
          CHINAR
        </motion.h1>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-24 bg-background md:h-32"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 55%, 52% 0, 0 45%)" }}
      />
    </section>
  );
}
