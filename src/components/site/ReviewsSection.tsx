import { motion } from "motion/react";
import { SoftCard } from "@/components/site/SoftCard";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const REVIEWS = [
  {
    name: { ru: "Анна, HSK 3", en: "Anna, HSK 3" },
    text: {
      ru: "За полгода прошла с нуля до уверенных диалогов. Атмосфера как в чайной — тепло и по делу.",
      en: "Went from zero to confident dialogue in six months. Warm as a tea house, sharp as an exam.",
    },
  },
  {
    name: { ru: "Игорь, бизнес-курс", en: "Igor, business track" },
    text: {
      ru: "Готовился к переговорам в Шанхае — за месяц собрали лексику, кейсы, этикет. Сделка закрыта.",
      en: "Prepared for Shanghai negotiations in a month — vocab, cases, etiquette. Deal closed.",
    },
  },
  {
    name: { ru: "Маша, 9 лет", en: "Masha, age 9" },
    text: {
      ru: "Дочка ждёт занятия всю неделю. Уже сама читает пиньинь и учит нас иероглифам.",
      en: "My daughter waits for lessons all week. Reads pinyin and teaches us characters.",
    },
  },
];

export function ReviewsSection() {
  const { t, lang } = useI18n();
  return (
    <section className="relative bg-[#0d0d0d]">
      {/* Черный кривой разделитель, который перекрывает низ расписания */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div
          aria-hidden
          className="absolute -top-20 inset-x-0 h-40 bg-[#0d0d0d]"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 55%, 52% 0, 0 45%)" }}
        />

        <div className="text-sm font-semibold uppercase tracking-widest text-brand-foreground">
          {t("reviews.title")}
        </div>
        <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          {t("reviews.subtitle")}
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.1)}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {REVIEWS.map((r) => (
            <motion.div key={r.name.en} variants={fadeUp}>
              <SoftCard className="p-7 h-full bg-white/5 border-white/10 text-white/90">
                <div className="font-hanzi text-5xl leading-none text-brand-foreground/60">"</div>
                <p className="mt-2">{r.text[lang]}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand font-bold">
                    {r.name[lang].charAt(0)}
                  </div>
                  <div className="text-sm font-semibold text-white">{r.name[lang]}</div>
                </div>
              </SoftCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Светлый кривой разделитель между черными блоками отзывов и футера */}
      <div
        aria-hidden
        className="relative h-24 bg-background md:h-32"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 55%, 52% 0, 0 45%)" }}
      />
    </section>
  );
}
