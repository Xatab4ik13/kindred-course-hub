import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Mascot, type MascotPose } from "@/components/site/Mascot";
import { useI18n } from "@/providers/i18n";

type SectionKey = "features" | "pricing" | "schedule" | "reviews" | "cta";

const POSE_BY_SECTION: Record<SectionKey, { pose: MascotPose; tipKey: string }> = {
  features: { pose: "point", tipKey: "companion.features" },
  pricing: { pose: "smile", tipKey: "companion.pricing" },
  schedule: { pose: "calm", tipKey: "companion.schedule" },
  reviews: { pose: "smile", tipKey: "companion.reviews" },
  cta: { pose: "wave", tipKey: "companion.cta" },
};

/**
 * Small sticky tiger that follows the user, changes pose per section,
 * and scrolls to top on click. Watches [data-companion-section] elements.
 */
export function MascotCompanion() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<SectionKey | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-companion-section]"),
    );
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the entry most in view
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const key = best.target.getAttribute("data-companion-section") as SectionKey;
          setActive(key);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -30% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const conf = active ? POSE_BY_SECTION[active] : null;
  const pose: MascotPose = conf?.pose ?? "hello";
  const tip = conf ? t(conf.tipKey) : "";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-6 right-6 z-40 flex items-end gap-3 group"
          aria-label="Scroll to top"
        >
          {/* Speech bubble */}
          <AnimatePresence>
            {tip && (hover || active) && (
              <motion.div
                key={tip}
                initial={{ opacity: 0, x: 8, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-4 max-w-[220px] rounded-2xl rounded-br-sm border border-border/70 bg-surface px-3 py-2 text-xs font-medium text-foreground shadow-float"
              >
                {tip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot bubble */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-brand/25 blur-xl" />
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-brand-soft shadow-float transition group-hover:scale-105">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pose}
                  initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 12 }}
                  transition={{ duration: 0.35 }}
                >
                  <Mascot pose={pose} size={80} breathe />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* scroll up hint on hover */}
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-soft opacity-0 group-hover:opacity-100 transition">
              <ArrowUp className="h-3.5 w-3.5" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
