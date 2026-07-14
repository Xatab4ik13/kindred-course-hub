import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Target, GraduationCap, CalendarClock, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DictKey } from "@/i18n/dict";

const HIGHLIGHTS: {
  icon: LucideIcon;
  title: DictKey;
  text: DictKey;
  tone: "brand" | "tiger" | "coral" | "ink";
}[] = [
  {
    icon: Target,
    title: "about.goal.title",
    text: "about.goal.text",
    tone: "brand",
  },
  {
    icon: GraduationCap,
    title: "about.teachers.title",
    text: "about.teachers.text",
    tone: "tiger",
  },
  {
    icon: CalendarClock,
    title: "about.schedule.title",
    text: "about.schedule.text",
    tone: "coral",
  },
  {
    icon: Globe,
    title: "about.culture.title",
    text: "about.culture.text",
    tone: "ink",
  },
];

const TONE_CLASSES = {
  brand: "bg-brand/10 text-brand",
  tiger: "bg-tiger/10 text-tiger",
  coral: "bg-coral/10 text-coral-deep",
  ink: "bg-ink/10 text-ink",
};

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[110rem] px-6 md:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          {/* Каллиграфический якорь */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center lg:justify-start"
          >
            <span
              className="select-none font-hanzi font-black leading-none text-brand/8"
              style={{ fontSize: "clamp(12rem, 35vw, 28rem)" }}
              aria-hidden
            >
              学
            </span>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center lg:justify-start">
              <div
                className="h-[70%] w-[70%] rounded-full bg-gradient-radial from-brand/5 to-transparent blur-3xl"
                aria-hidden
              />
            </div>
          </motion.div>

          {/* Текстовый блок */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger(0.1)}
          >
            <motion.div variants={fadeUp}>
              <span className="text-sm font-semibold uppercase tracking-widest text-brand">
                {t("about.eyebrow")}
              </span>
              <h2 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                <span className="block">{t("about.title.1")}</span>
                <span className="block text-brand">{t("about.title.2")}</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t("about.lead")}
              </p>
            </motion.div>

            <motion.div
              variants={stagger(0.08)}
              className="mt-12 grid gap-5 sm:grid-cols-2"
            >
              {HIGHLIGHTS.map(({ icon: Icon, title, text, tone }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group rounded-3xl bg-surface p-6 shadow-soft transition-shadow duration-300 hover:shadow-float"
                >
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${TONE_CLASSES[tone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold">
                    {t(title)}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {t(text)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
