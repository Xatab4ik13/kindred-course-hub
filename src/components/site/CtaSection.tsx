import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/providers/i18n";
import { Mascot } from "@/components/site/Mascot";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function CtaSection() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative overflow-hidden rounded-4xl bg-brand text-brand-foreground p-8 md:p-14"
      >
        <div className="absolute inset-0 -z-10 bg-grain opacity-20" />
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-4xl font-extrabold md:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mt-3 max-w-lg text-brand-foreground/90">{t("cta.subtitle")}</p>
            <Link
              to="/contacts"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-background px-6 text-base font-semibold text-foreground hover:scale-[1.02] transition"
            >
              {t("cta.enroll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Mascot pose="wave" size={220} className="justify-self-end" />
        </div>
      </motion.div>
    </section>
  );
}
