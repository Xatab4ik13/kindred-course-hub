import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Check,
  Users,
  Clock,
  Calendar,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EnrollModal } from "@/components/site/EnrollModal";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Все программы — CHINAR" },
      {
        name: "description",
        content:
          "Все программы школы китайского CHINAR: HSK 1–2, индивидуально, ЕГЭ, для школьников. Выбирайте формат под свою цель.",
      },
      { property: "og:title", content: "Все программы — CHINAR" },
      {
        property: "og:description",
        content: "Полный каталог программ CHINAR — HSK, индивидуальные занятия, ЕГЭ и школьники.",
      },
    ],
  }),
  component: PricingPage,
});

type ProgramCopy = {
  name: string;
  tag: string;
  desc?: string;
  price: string;
  unit: string;
  format: string;
  group: string;
  duration: string;
  level: string;
  bullets: string[];
  footer?: string;
  highlight?: string;
  audience: string;
};

type Program = {
  id: string;
  hanzi: string;
  goalId: string;
  popular?: boolean;
  ru: ProgramCopy;
  en: ProgramCopy;
};

const PROGRAMS: Program[] = [
  {
    id: "hsk1",
    hanzi: "一",
    goalId: "hsk1",
    popular: true,
    ru: {
      name: "HSK1 за 3 месяца",
      tag: "Стартуй в китайском с нуля",
      price: "8 000 ₽",
      unit: "/ мес",
      format: "Онлайн, мини-группа",
      group: "До 4 человек",
      duration: "3 месяца · 12 занятий",
      level: "С нуля → HSK 1",
      bullets: [
        "Вся теория HSK1 — грамматика, иероглифы, аудио- и письменные задания.",
        "12 занятий по 1,5 часа в мини-группах до 4 человек — максимум практики и внимания к каждому!",
        "2 бесплатных пробных экзамена HSK в курсе — тренируйся на реальных заданиях.",
        "Карточки Quizlet со всеми словами уровня — запоминай лексику легко и быстро.",
        "Личный куратор проверит ДЗ и поможет не сойти с пути.",
      ],
      footer:
        "Через 3 месяца ты будешь уверенно говорить, писать и понимать базовый китайский + сдашь HSK1 без стресса!",
      highlight: "ТОЛЬКО 4 МЕСТА В ГРУППЕ! УСПЕЙ ЗАПИСАТЬСЯ!",
      audience: "Взрослые и подростки",
    },
    en: {
      name: "HSK1 in 3 months",
      tag: "Start Chinese from zero",
      price: "8 000 ₽",
      unit: "/ month",
      format: "Online mini-group",
      group: "Up to 4 people",
      duration: "3 months · 12 lessons",
      level: "Zero → HSK 1",
      bullets: [
        "Full HSK1 theory — grammar, characters, listening and writing tasks.",
        "12 lessons of 1.5 hours in mini-groups up to 4 — maximum practice and attention.",
        "2 free mock HSK exams during the course — train on real tasks.",
        "Quizlet decks with all level vocabulary — memorise words easily.",
        "Personal tutor checks homework and keeps you on track.",
      ],
      footer:
        "In 3 months you'll confidently speak, write and understand basic Chinese + pass HSK1 without stress!",
      highlight: "ONLY 4 SEATS PER GROUP! HURRY!",
      audience: "Adults and teens",
    },
  },
  {
    id: "hsk2",
    hanzi: "二",
    goalId: "hsk2",
    ru: {
      name: "HSK2 за 4 месяца",
      tag: "Подними китайский на новый уровень",
      price: "8 000 ₽",
      unit: "/ мес",
      format: "Онлайн, мини-группа",
      group: "До 4 человек",
      duration: "4 месяца · 16 занятий",
      level: "HSK 1 → HSK 2",
      bullets: [
        "Полная программа HSK2 — грамматика, иероглифы, аудио- и письменные задания.",
        "16 занятий по 1,5 часа в мини-группах до 4 человек — больше практики, больше прогресса!",
        "2 бесплатных пробных экзамена HSK2 — отработай стратегии и сдай тест без ошибок.",
        "Карточки Quizlet со всей лексикой уровня — запоминай слова играючи.",
        "Личный куратор проверит домашние задания и поддержит на пути к цели.",
      ],
      footer:
        "Через 4 месяца ты будешь свободно общаться на бытовые темы, писать тексты и уверенно сдашь HSK2!",
      highlight: "ТОЛЬКО 4 МЕСТА В ГРУППЕ! СТАРТУЕМ СКОРО!",
      audience: "После HSK 1",
    },
    en: {
      name: "HSK2 in 4 months",
      tag: "Take Chinese to the next level",
      price: "8 000 ₽",
      unit: "/ month",
      format: "Online mini-group",
      group: "Up to 4 people",
      duration: "4 months · 16 lessons",
      level: "HSK 1 → HSK 2",
      bullets: [
        "Full HSK2 programme — grammar, characters, listening and writing.",
        "16 lessons of 1.5 hours in mini-groups up to 4 — more practice, more progress!",
        "2 free HSK2 mock exams — train strategies and pass without mistakes.",
        "Quizlet decks with all level vocabulary — memorise words with fun.",
        "Personal tutor checks homework and supports you on the way.",
      ],
      footer:
        "In 4 months you'll speak freely on everyday topics, write texts and confidently pass HSK2!",
      highlight: "ONLY 4 SEATS PER GROUP! STARTING SOON!",
      audience: "After HSK 1",
    },
  },
  {
    id: "individual",
    hanzi: "个",
    goalId: "individual",
    ru: {
      name: "Индивидуальный китайский онлайн",
      tag: "Ваш путь к успеху",
      price: "1 800 ₽",
      unit: "/ час",
      format: "Онлайн, 1 на 1",
      group: "Только вы и преподаватель",
      duration: "Гибкий график",
      level: "Любой уровень",
      bullets: [
        "Преподаватели-профессионалы с уровнем HSK 5–6 — только проверенные носители и эксперты языка.",
        "Программа под Ваши цели: от базовых разговорных фраз до бизнес-китайского или подготовки к HSK.",
        "Собственные учебные материалы — эффективно и без скучной теории.",
        "Любой возраст: дети, подростки, взрослые — учим всех и всегда!",
      ],
      footer:
        "Говорите уверенно, пишете грамотно, понимаете речь на слух — с нуля или до продвинутого уровня!",
      highlight: "ИНДИВИДУАЛЬНЫЙ ПОДХОД ПО ЦЕНЕ ГРУППОВЫХ ЗАНЯТИЙ",
      audience: "Дети, подростки, взрослые",
    },
    en: {
      name: "One-to-one Chinese online",
      tag: "Your path to success",
      price: "1 800 ₽",
      unit: "/ hour",
      format: "Online, 1-on-1",
      group: "Just you and the teacher",
      duration: "Flexible schedule",
      level: "Any level",
      bullets: [
        "Professional teachers with HSK 5–6 — verified natives and language experts.",
        "Programme for your goals: from basic phrases to business Chinese or HSK prep.",
        "Own learning materials — effective and without boring theory.",
        "Any age: kids, teens, adults — we teach everyone!",
      ],
      footer:
        "Speak confidently, write correctly, understand by ear — from zero to advanced!",
      highlight: "ONE-TO-ONE AT GROUP PRICE",
      audience: "Kids, teens, adults",
    },
  },
  {
    id: "group",
    hanzi: "众",
    goalId: "group",
    ru: {
      name: "Групповые занятия для начинающих",
      tag: "Подними китайский на новый уровень",
      price: "5 000 ₽",
      unit: "/ мес",
      format: "Онлайн, мини-группа",
      group: "До 4 человек",
      duration: "5 занятий по 1,5 часа",
      level: "С нуля",
      bullets: [
        "Подойдёт для тех, кто хочет начать изучать китайский язык.",
        "5 занятий по 1,5 часа в мини-группах до 4 человек — больше практики, больше прогресса!",
        "Бесплатные пробные экзамены HSK — отработай стратегии и сдай тест без ошибок.",
        "Карточки Quizlet со всей лексикой уровня — запоминай слова играючи.",
        "Личный куратор проверит домашние задания и поддержит на пути к цели.",
      ],
      highlight: "ТОЛЬКО 4 МЕСТА В ГРУППЕ! СТАРТУЕМ СКОРО!",
      audience: "Взрослые и подростки",
    },
    en: {
      name: "Group lessons for beginners",
      tag: "Take Chinese to the next level",
      price: "5 000 ₽",
      unit: "/ month",
      format: "Online mini-group",
      group: "Up to 4 people",
      duration: "5 lessons of 1.5 h",
      level: "From zero",
      bullets: [
        "For those who want to start learning Chinese.",
        "5 lessons of 1.5 h in mini-groups up to 4 — more practice, more progress!",
        "Free HSK mock exams — train strategies and pass without mistakes.",
        "Quizlet decks with all level vocabulary — memorise words with fun.",
        "Personal tutor checks homework and supports you on the way.",
      ],
      highlight: "ONLY 4 SEATS PER GROUP! STARTING SOON!",
      audience: "Adults and teens",
    },
  },
  {
    id: "ege",
    hanzi: "百",
    goalId: "ege",
    ru: {
      name: "ЕГЭ по китайскому на 100 баллов",
      tag: "ChinaЯ",
      price: "1 800 ₽",
      unit: "/ час",
      format: "Индивидуально или в группе",
      group: "1 на 1 или до 3 человек",
      duration: "6–12 месяцев до экзамена",
      level: "HSK 2 → 90+ баллов",
      bullets: [
        "Старший преподаватель: Тимофей (99 баллов на ЕГЭ-2023) раскроет все секреты экзамена!",
        "Эксклюзивные материалы для устной части — учим говорить без ошибок и страха.",
        "Индивидуально или в группе — выбирай удобный формат и скорость подготовки.",
      ],
      footer:
        "Вы сдадите ЕГЭ на высокий балл, как Тимофей, и получите преимущество при поступлении!",
      highlight: "ИНДИВИДУАЛЬНЫЙ ПОДХОД ПО ЦЕНЕ ГРУППОВЫХ ЗАНЯТИЙ",
      audience: "Ученики 10–11 классов",
    },
    en: {
      name: "Chinese EGE for 100 points",
      tag: "ChinaЯ",
      price: "1 800 ₽",
      unit: "/ hour",
      format: "One-to-one or group",
      group: "1-on-1 or up to 3",
      duration: "6–12 months before exam",
      level: "HSK 2 → 90+ points",
      bullets: [
        "Senior teacher: Timofey (99 points on EGE-2023) reveals every secret of the exam!",
        "Exclusive materials for the oral part — speak without mistakes or fear.",
        "One-to-one or group — pick the format and pace that fits you.",
      ],
      footer:
        "You'll pass the EGE with a high score like Timofey and gain an admission advantage!",
      highlight: "ONE-TO-ONE AT GROUP PRICE",
      audience: "Grade 10–11 students",
    },
  },
  {
    id: "school",
    hanzi: "校",
    goalId: "kids",
    ru: {
      name: "Китайский для школьников онлайн",
      tag: "Учим легко и эффективно",
      price: "1 800 ₽",
      unit: "/ час",
      format: "Онлайн, индивидуально",
      group: "1 на 1 с преподавателем",
      duration: "Гибкий график",
      level: "Школьная программа",
      bullets: [
        "Преподаватели-профи с HSK 5–6 + опыт работы с детьми — объяснят даже сложные темы просто!",
        "Под школьную программу: помощь с домашними заданиями, подготовка к контрольным и экзаменам.",
        "Индивидуальный график — занятия в удобное время, даже после уроков.",
        "Собственные материалы — увлекательные задания, игры и тесты для школьников.",
      ],
      footer:
        "Ребёнок полюбит китайский, подтянет оценки и будет уверенно говорить на уроках.",
      highlight: "БЕСПЛАТНЫЙ ПРОБНЫЙ УРОК",
      audience: "Школьники",
    },
    en: {
      name: "Chinese for schoolkids online",
      tag: "Learn easily and effectively",
      price: "1 800 ₽",
      unit: "/ hour",
      format: "Online, 1-on-1",
      group: "1-on-1 with a teacher",
      duration: "Flexible schedule",
      level: "School curriculum",
      bullets: [
        "Pro teachers with HSK 5–6 and experience with kids — even hard topics made simple!",
        "Aligned with school: homework help, prep for tests and exams.",
        "Individual schedule — lessons at convenient times, even after school.",
        "Own materials — engaging tasks, games and tests for schoolkids.",
      ],
      footer:
        "Your child will love Chinese, improve grades and speak confidently in class.",
      highlight: "FREE TRIAL LESSON",
      audience: "Schoolkids",
    },
  },
];

function PricingPage() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | undefined>();

  const openWith = (goalId?: string) => {
    setSelectedGoal(goalId);
    setOpen(true);
  };

  const heroTitle = lang === "ru" ? "Все программы" : "All programmes";
  const heroLead =
    lang === "ru"
      ? "От первого 你好 до сдачи HSK и ЕГЭ — выберите формат под свою цель и возраст. Все программы ведут преподаватели с уровнем HSK 5–6."
      : "From your first 你好 to HSK and EGE — pick the format that fits your goal and age. Every programme is led by teachers with HSK 5–6.";
  const eyebrow = lang === "ru" ? "Каталог" : "Catalogue";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 select-none font-hanzi text-[22rem] leading-none text-brand/[0.05] md:text-[28rem]"
        >
          课
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">
            <span className="h-px w-8 bg-brand" />
            {eyebrow}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {heroLead}
          </p>
        </div>
      </section>

      {/* Programs list */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.08)}
          className="space-y-8"
        >
          {PROGRAMS.map((p, i) => {
            const c = p[lang];
            const isSpecial = !!p.popular;
            const reverse = i % 2 === 1;
            const meta = [
              { icon: Calendar, label: c.format },
              { icon: Users, label: c.group },
              { icon: Clock, label: c.duration },
              { icon: GraduationCap, label: c.level },
            ];
            return (
              <motion.article
                key={p.id}
                variants={fadeUp}
                className={cn(
                  "relative grid overflow-hidden rounded-[2.5rem] border shadow-soft md:grid-cols-[1.35fr_1fr]",
                  isSpecial
                    ? "border-ink bg-ink text-cream"
                    : "border-border/60 bg-surface text-surface-foreground",
                )}
              >
                {/* content */}
                <div
                  className={cn(
                    "relative p-8 md:p-12",
                    reverse && "md:order-2",
                  )}
                >
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -left-6 -top-16 select-none font-hanzi text-[14rem] leading-none",
                      isSpecial ? "text-cream/5" : "text-brand/[0.06]",
                    )}
                  >
                    {p.hanzi}
                  </div>

                  <h2
                    className={cn(
                      "relative font-display text-3xl font-extrabold uppercase leading-tight md:text-4xl",
                      isSpecial ? "text-cream" : "text-foreground",
                    )}
                  >
                    {c.name}
                  </h2>
                  <p className="relative mt-2 text-sm font-semibold text-brand">{c.tag}</p>

                  {/* meta grid */}
                  <div className="relative mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {meta.map((m) => (
                      <div
                        key={m.label}
                        className={cn(
                          "flex min-w-0 flex-col gap-2 rounded-2xl border p-3",
                          isSpecial
                            ? "border-cream/15 bg-cream/[0.04]"
                            : "border-border/60 bg-background/60",
                        )}
                      >
                        <m.icon className="h-4 w-4 shrink-0 text-brand" />
                        <div
                          className={cn(
                            "text-[11px] font-semibold leading-snug break-words hyphens-auto",
                            isSpecial ? "text-cream/90" : "text-foreground",
                          )}
                        >
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* audience pill */}
                  <div
                    className={cn(
                      "relative mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold",
                      isSpecial
                        ? "bg-cream/10 text-cream/90"
                        : "bg-brand-soft text-brand",
                    )}
                  >
                    <User className="h-3.5 w-3.5" />
                    {c.audience}
                  </div>
                </div>

                {/* side: bullets + price */}
                <div
                  className={cn(
                    "relative flex flex-col justify-between gap-8 border-t p-8 md:border-l md:border-t-0 md:p-10",
                    isSpecial ? "border-cream/15" : "border-border/60",
                    reverse && "md:order-1 md:border-l-0 md:border-r",
                  )}
                >
                  <div className="space-y-5">
                    <ul className="space-y-3">
                      {c.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed">
                          <span
                            className={cn(
                              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                              isSpecial
                                ? "bg-brand text-brand-foreground"
                                : "bg-brand-soft text-brand",
                            )}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span
                            className={cn(
                              isSpecial ? "text-cream/85" : "text-surface-foreground/85",
                            )}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {c.footer && (
                      <p
                        className={cn(
                          "text-sm italic leading-relaxed",
                          isSpecial ? "text-cream/70" : "text-muted-foreground",
                        )}
                      >
                        {c.footer}
                      </p>
                    )}

                    {c.highlight && (
                      <p className="text-sm font-bold uppercase leading-snug tracking-wide text-brand">
                        {c.highlight}
                      </p>
                    )}
                  </div>

                  <div>
                    <div
                      className={cn(
                        "flex items-baseline gap-2 font-display text-[2.5rem] font-extrabold leading-none",
                        isSpecial ? "text-cream" : "text-foreground",
                      )}
                    >
                      {c.price}
                      <span
                        className={cn(
                          "text-xs uppercase tracking-wider",
                          isSpecial ? "text-cream/60" : "text-muted-foreground",
                        )}
                      >
                        {c.unit}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openWith(p.goalId)}
                      className={cn(
                        "mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-wider transition hover:opacity-90",
                        isSpecial
                          ? "bg-brand text-brand-foreground"
                          : "bg-ink text-cream",
                      )}
                    >
                      {lang === "ru" ? "Выбрать тариф" : "Choose plan"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden border-t border-border/60 bg-brand-soft/40">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center md:px-8 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-6 select-none font-hanzi text-[10rem] leading-none text-brand/10"
          >
            选
          </div>
          <h2 className="relative font-display text-3xl font-extrabold uppercase leading-tight text-foreground md:text-4xl">
            {lang === "ru"
              ? "Не знаете, какая программа подойдёт?"
              : "Not sure which programme fits?"}
          </h2>
          <p className="relative max-w-2xl text-base text-muted-foreground">
            {lang === "ru"
              ? "Запишитесь на бесплатную 20-минутную консультацию — проведём тест и подберём формат под вашу цель, возраст и темп."
              : "Book a free 20-minute consultation — we'll test your level and pick the format for your goal, age and pace."}
          </p>
          <button
            type="button"
            onClick={() => openWith(undefined)}
            className="relative inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand px-10 text-base font-bold uppercase tracking-wider text-brand-foreground shadow-float transition hover:shadow-glow"
          >
            {lang === "ru" ? "Оставить заявку" : "Get in touch"}
            <ArrowRight className="h-5 w-5" />
          </button>
          <Link
            to="/schedule"
            className="relative text-sm font-semibold uppercase tracking-wider text-foreground/70 underline-offset-4 hover:text-brand hover:underline"
          >
            {t("team.cta.schedule")}
          </Link>
        </div>
      </section>

      <Footer />

      <EnrollModal
        open={open}
        onClose={() => setOpen(false)}
        defaultGoal={selectedGoal}
      />
    </div>
  );
}
