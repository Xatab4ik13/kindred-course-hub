import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/site/FeaturesSection";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { DictKey } from "@/i18n/dict";

type Plan = {
  id: "p1" | "p2" | "p3";
  hanzi: string;
  special?: boolean;
};

const PLANS: Plan[] = [
  { id: "p1", hanzi: "一", special: true },
  { id: "p2", hanzi: "个" },
  { id: "p3", hanzi: "百" },
];

export function PricingSection() {
  const { t } = useI18n();
  const k = (id: Plan["id"], suffix: string) => `pricing.${id}.${suffix}` as DictKey;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader eyebrow={t("pricing.title")} title={t("pricing.subtitle")} />
        <Link
          to="/pricing"
          className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          {t("pricing.cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger(0.08)}
        className="mt-12 grid gap-6 md:grid-cols-3"
      >
        {PLANS.map((p) => {
          const isSpecial = p.special;
          return (
            <motion.article
              key={p.id}
              variants={fadeUp}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[2rem] p-8 border transition-shadow",
                isSpecial
                  ? "bg-ink text-cream border-ink shadow-float"
                  : "bg-surface text-surface-foreground border-border/60 shadow-soft",
              )}
            >
              {/* decorative hanzi */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-6 -top-10 font-hanzi text-[12rem] leading-none select-none",
                  isSpecial ? "text-cream/5" : "text-brand/5",
                )}
              >
                {p.hanzi}
              </div>

              {isSpecial && (
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-foreground">
                  {t("pricing.special")}
                </div>
              )}

              <h3
                className={cn(
                  "font-display text-2xl font-extrabold uppercase leading-tight mt-4",
                  isSpecial ? "text-cream" : "text-foreground",
                )}
              >
                {t(k(p.id, "name"))}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm font-semibold",
                  isSpecial ? "text-brand" : "text-brand",
                )}
              >
                {t(k(p.id, "tag"))}
              </p>

              <ul className="mt-6 space-y-3 flex-1">
                {(["b1", "b2", "b3"] as const).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                        isSpecial ? "bg-brand text-brand-foreground" : "bg-brand-soft text-brand",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={isSpecial ? "text-cream/85" : "text-surface-foreground/85"}>
                      {t(k(p.id, b))}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className={cn(
                  "mt-8 pt-6 border-t flex items-end justify-between gap-3",
                  isSpecial ? "border-cream/15" : "border-border/60",
                )}
              >
                <div className="flex items-baseline gap-2 whitespace-nowrap font-display text-[2.25rem] font-extrabold leading-none">
                  {t(k(p.id, "price"))}
                  <span
                    className={cn(
                      "text-xs uppercase tracking-wider",
                      isSpecial ? "text-cream/60" : "text-muted-foreground",
                    )}
                  >
                    {t(k(p.id, "unit"))}
                  </span>
                </div>
                <Link
                  to="/pricing"
                  className={cn(
                    "group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isSpecial
                      ? "bg-cream/10 text-cream hover:bg-cream/20"
                      : "bg-transparent text-brand hover:bg-brand-soft",
                  )}
                >
                  {t("pricing.more")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <Link
                to="/pricing"
                className={cn(
                  "mt-4 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90",
                  isSpecial
                    ? "bg-brand text-brand-foreground"
                    : "bg-ink text-cream",
                )}
              >
                {t("pricing.enroll")}
              </Link>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
