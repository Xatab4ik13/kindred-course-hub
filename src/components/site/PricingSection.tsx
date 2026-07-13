import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SoftCard } from "@/components/site/SoftCard";
import { SectionHeader } from "@/components/site/FeaturesSection";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Plan = {
  name: { ru: string; en: string };
  price: string;
  perks: { ru: string; en: string }[];
  special?: boolean;
};

const PLANS: Plan[] = [
  {
    name: { ru: "Индивидуально", en: "One-to-one" },
    price: "1 800 ₽",
    perks: [
      { ru: "Персональная программа", en: "Personal programme" },
      { ru: "Свободный график", en: "Flexible schedule" },
      { ru: "Онлайн или офлайн", en: "Online or offline" },
    ],
  },
  {
    name: { ru: "Группа до 6", en: "Group up to 6" },
    price: "12 000 ₽",
    special: true,
    perks: [
      { ru: "2 занятия в неделю", en: "2 lessons a week" },
      { ru: "Носитель + методист", en: "Native + methodist" },
      { ru: "Клуб общения включён", en: "Speaking club included" },
    ],
  },
  {
    name: { ru: "Детская группа", en: "Kids group" },
    price: "8 900 ₽",
    perks: [
      { ru: "Игровой формат", en: "Playful format" },
      { ru: "От 6 лет", en: "Age 6+" },
      { ru: "Открытые уроки", en: "Open lessons" },
    ],
  },
];

export function PricingSection() {
  const { t, lang } = useI18n();
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
        variants={stagger(0.1)}
        className="mt-12 grid gap-5 md:grid-cols-3"
      >
        {PLANS.map((p) => (
          <motion.div key={p.name.en} variants={fadeUp}>
            <SoftCard
              className={cn(
                "relative p-7 h-full flex flex-col",
                p.special && "bg-brand text-brand-foreground border-brand shadow-float",
              )}
            >
              {p.special && (
                <div className="absolute -top-3 right-6 rounded-full bg-foreground text-background px-3 py-1 text-xs font-semibold">
                  {t("pricing.special")}
                </div>
              )}
              <div className={cn("text-sm font-semibold uppercase tracking-wider", p.special ? "text-brand-foreground/80" : "text-muted-foreground")}>
                {p.name[lang]}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="font-display text-4xl font-extrabold">{p.price}</div>
                <div className={cn("text-sm", p.special ? "text-brand-foreground/80" : "text-muted-foreground")}>
                  {t("pricing.perMonth")}
                </div>
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk.en} className="flex items-start gap-2 text-sm">
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.special ? "text-brand-foreground" : "text-brand")} />
                    {perk[lang]}
                  </li>
                ))}
              </ul>
              <Link
                to="/pricing"
                className={cn(
                  "mt-7 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition",
                  p.special
                    ? "bg-background text-foreground hover:opacity-90"
                    : "bg-brand text-brand-foreground hover:opacity-90",
                )}
              >
                {t("cta.enroll")}
              </Link>
            </SoftCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
