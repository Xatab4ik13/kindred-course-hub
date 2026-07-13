import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n";
import { SoftCard } from "@/components/site/SoftCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Users, GraduationCap, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DictKey } from "@/i18n/dict";

export function FeaturesSection() {
  const { t } = useI18n();

  const items: { icon: LucideIcon; title: DictKey; text: DictKey }[] = [
    { icon: MessagesSquare, title: "features.1.title", text: "features.1.text" },
    { icon: GraduationCap, title: "features.2.title", text: "features.2.text" },
    { icon: Users, title: "features.3.title", text: "features.3.text" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <SectionHeader eyebrow={t("features.title")} title={t("features.subtitle")} />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger(0.12)}
        className="mt-12 grid gap-5 md:grid-cols-3"
      >
        {items.map(({ icon: Icon, title, text }) => (
          <motion.div key={title} variants={fadeUp}>
            <SoftCard className="p-7 h-full">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">{t(title)}</h3>
              <p className="mt-2 text-muted-foreground">{t(text)}</p>
            </SoftCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <div className="text-sm font-semibold uppercase tracking-widest text-brand">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
