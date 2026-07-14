import { motion } from "motion/react";

/**
 * Hero — тишина и имя.
 * Под персиковым градиентом течёт абстрактное видео в китайской манере.
 * Текст остаётся на сплошном градиенте, видео лишь едва проступает сквозь него.
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden text-brand-foreground">
      {/* Видео-фон */}
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover"
        src="/hero-bg.mp4"
      />

      {/* Персиковый градиент поверх видео — как раньше, видео едва проступает */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.82 0.10 62 / 0.92) 0%, oklch(0.76 0.13 52 / 0.9) 35%, oklch(0.68 0.15 42 / 0.88) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_20%,oklch(0.62_0.16_35/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_10%_90%,oklch(0.58_0.14_30/0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-[110rem] flex-col items-center justify-center px-4 pb-32 md:px-12 md:pb-56">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center font-display font-black text-black leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: "clamp(3.5rem, 18vw, 20rem)" }}
        >
          CHINAR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 md:mt-5 text-center font-display font-black uppercase leading-[1.05] tracking-[0.01em]"
          style={{ fontSize: "clamp(1.35rem, 5.5vw, 5.5rem)" }}
        >
          <span className="text-brand-foreground">Онлайн школа</span>
          <br />
          <span className="text-brand">китайского языка</span>
        </motion.p>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-24 bg-background md:h-32"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 55%, 52% 0, 0 45%)" }}
      />
    </section>
  );
}
