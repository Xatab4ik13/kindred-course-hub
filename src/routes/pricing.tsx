import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Check,
  Users,
  User,
  Clock,
  Calendar,
  GraduationCap,
  Baby,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EnrollModal } from "@/components/site/EnrollModal";
import { useI18n } from "@/providers/i18n";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Все программы — CHINAR" },
      {
        name: "description",
        content:
          "Все программы школы китайского CHINAR: HSK 1–6, индивидуальные занятия, курсы для детей, подготовка к ЕГЭ. Выбирайте формат под свою цель.",
      },
      { property: "og:title", content: "Все программы — CHINAR" },
      {
        property: "og:description",
        content: "Полный каталог программ CHINAR — от нуля до HSK 6, ЕГЭ и детских курсов.",
      },
    ],
  }),
  component: PricingPage,
});

type Category = "all" | "group" | "solo" | "kids" | "exam";

type Program = {
  id: string;
  hanzi: string;
  category: Exclude<Category, "all">;
  goalId: string;
  special?: boolean;
  ru: ProgramCopy;
  en: ProgramCopy;
};

type ProgramCopy = {
  name: string;
  tag: string;
  desc: string;
  price: string;
  unit: string;
  format: string;
  group: string;
  duration: string;
  level: string;
  bullets: string[];
  audience: string;
};

const PROGRAMS: Program[] = [
  {
    id: "hsk1",
    hanzi: "一",
    category: "group",
    goalId: "hsk1",
    special: true,
    ru: {
      name: "HSK 1 за 3 месяца",
      tag: "Стартуй с нуля",
      desc: "Базовый курс для тех, кто впервые сталкивается с китайским. За 12 занятий вы освоите фонетику, 150 иероглифов и начнёте говорить простыми фразами.",
      price: "8 000 ₽",
      unit: "/ месяц",
      format: "Онлайн",
      group: "До 4 человек",
      duration: "3 месяца · 12 занятий",
      level: "С нуля → HSK 1",
      bullets: [
        "Вся теория HSK 1 — грамматика, иероглифы, аудио- и письменные задания",
        "Занятия по 1,5 часа в мини-группе до 4 человек",
        "Карточки Quizlet и личный куратор, который проверит домашнее задание",
        "Пробный экзамен HSK 1 в конце курса",
      ],
      audience: "Взрослые и подростки от 14 лет",
    },
    en: {
      name: "HSK 1 in 3 months",
      tag: "Start from zero",
      desc: "A starter course for absolute beginners. In 12 lessons you'll master phonetics, 150 characters and start speaking simple phrases.",
      price: "8 000 ₽",
      unit: "/ month",
      format: "Online",
      group: "Up to 4 people",
      duration: "3 months · 12 lessons",
      level: "Zero → HSK 1",
      bullets: [
        "Full HSK 1 theory — grammar, characters, listening & writing",
        "1.5-hour lessons in mini-groups up to 4",
        "Quizlet decks and a personal tutor to check homework",
        "Mock HSK 1 exam at the end of the course",
      ],
      audience: "Adults and teens 14+",
    },
  },
  {
    id: "hsk2",
    hanzi: "二",
    category: "group",
    goalId: "hsk2",
    ru: {
      name: "HSK 2 — продолжающий",
      tag: "Уверенный базовый уровень",
      desc: "Развиваем базу HSK 1: 300 новых иероглифов, сложные конструкции, свободные диалоги на повседневные темы.",
      price: "8 500 ₽",
      unit: "/ месяц",
      format: "Онлайн",
      group: "До 5 человек",
      duration: "4 месяца · 16 занятий",
      level: "HSK 1 → HSK 2",
      bullets: [
        "Расширенная лексика — 300 новых слов и иероглифов",
        "Разговорные клубы с носителем языка раз в 2 недели",
        "Разбор реальных диалогов из фильмов и подкастов",
        "Подготовка к сертификации HSK 2",
      ],
      audience: "Ученики после HSK 1 или с базой самообучения",
    },
    en: {
      name: "HSK 2 — continuing",
      tag: "Confident basic level",
      desc: "Building on HSK 1: 300 new characters, more complex structures, fluent everyday conversations.",
      price: "8 500 ₽",
      unit: "/ month",
      format: "Online",
      group: "Up to 5 people",
      duration: "4 months · 16 lessons",
      level: "HSK 1 → HSK 2",
      bullets: [
        "Extended vocabulary — 300 new words and characters",
        "Conversation clubs with a native speaker every 2 weeks",
        "Real dialogues from films and podcasts",
        "HSK 2 certification prep",
      ],
      audience: "Students after HSK 1 or with self-study basics",
    },
  },
  {
    id: "individual",
    hanzi: "个",
    category: "solo",
    goalId: "individual",
    ru: {
      name: "Индивидуально онлайн",
      tag: "Ваш путь к успеху",
      desc: "Персональная программа под вашу цель — от базовых фраз для путешествий до делового китайского и подготовки к работе в Китае.",
      price: "1 800 ₽",
      unit: "/ час",
      format: "Онлайн, 1 на 1",
      group: "Только вы и преподаватель",
      duration: "Гибкий график",
      level: "Любой — от нуля до HSK 6",
      bullets: [
        "Преподаватели с уровнем HSK 5–6 — носители и эксперты языка",
        "Программа под ваши цели: путешествия, бизнес, экзамены, работа",
        "Занятия в удобное время — можно переносить за 12 часов",
        "Материалы и запись каждого урока — учитесь в своём темпе",
      ],
      audience: "Дети от 10 лет, подростки, взрослые",
    },
    en: {
      name: "One-to-one online",
      tag: "Your path to fluency",
      desc: "A personal programme for your goal — from travel basics to business Chinese and prep for working in China.",
      price: "1 800 ₽",
      unit: "/ hour",
      format: "Online, 1-on-1",
      group: "Just you and the teacher",
      duration: "Flexible schedule",
      level: "Any — zero to HSK 6",
      bullets: [
        "Teachers with HSK 5–6 — verified natives and experts",
        "Programme tailored to your goals: travel, business, exams, work",
        "Lessons at convenient times, reschedule up to 12h before",
        "Recording and materials for every lesson",
      ],
      audience: "Kids 10+, teens, adults",
    },
  },
  {
    id: "kids",
    hanzi: "娃",
    category: "kids",
    goalId: "kids",
    ru: {
      name: "Китайский для детей",
      tag: "Игровой формат 6–11 лет",
      desc: "Занятия через игры, песни и мультфильмы. Дети запоминают иероглифы визуально и не боятся говорить.",
      price: "6 500 ₽",
      unit: "/ месяц",
      format: "Онлайн в мини-группе",
      group: "До 4 детей одного возраста",
      duration: "4 занятия по 45 минут в месяц",
      level: "С нуля",
      bullets: [
        "Игровой метод — иероглифы через карточки, песни и мультфильмы",
        "Домашние задания в приложении, интересные ребёнку",
        "Отчёт родителям после каждого месяца",
        "Праздники китайского Нового года и мастер-классы",
      ],
      audience: "Дети 6–11 лет",
    },
    en: {
      name: "Chinese for kids",
      tag: "Playful format 6–11 y.o.",
      desc: "Lessons through games, songs and cartoons. Kids memorise characters visually and speak without fear.",
      price: "6 500 ₽",
      unit: "/ month",
      format: "Online mini-group",
      group: "Up to 4 kids of the same age",
      duration: "4 lessons of 45 min/month",
      level: "From zero",
      bullets: [
        "Playful method — characters via cards, songs and cartoons",
        "Homework in an app, engaging for the child",
        "Monthly report for parents",
        "Chinese New Year events and master-classes",
      ],
      audience: "Kids 6–11 y.o.",
    },
  },
  {
    id: "teens",
    hanzi: "青",
    category: "kids",
    goalId: "group",
    ru: {
      name: "Онлайн-школа для подростков",
      tag: "5–11 класс",
      desc: "Системная программа для школьников: подготовка к олимпиадам, ЕГЭ и поступлению в китайские вузы.",
      price: "7 500 ₽",
      unit: "/ месяц",
      format: "Онлайн в группе",
      group: "До 6 подростков",
      duration: "Учебный год · 2 занятия в неделю",
      level: "От нуля до HSK 4",
      bullets: [
        "Программа согласована со школьной нагрузкой",
        "Разбор олимпиадных заданий и первый шаг к ЕГЭ",
        "Проектная работа: страноведение и культура Китая",
        "Обмен и стажировки с китайскими партнёрскими школами",
      ],
      audience: "Школьники 11–17 лет",
    },
    en: {
      name: "Online school for teens",
      tag: "Grades 5–11",
      desc: "A systematic programme for schoolchildren: olympiads, EGE and admission to Chinese universities.",
      price: "7 500 ₽",
      unit: "/ month",
      format: "Online in a group",
      group: "Up to 6 teens",
      duration: "Academic year · 2 lessons/week",
      level: "Zero to HSK 4",
      bullets: [
        "Programme aligned with school workload",
        "Olympiad tasks and first steps to EGE",
        "Project work: China studies and culture",
        "Exchange with partner schools in China",
      ],
      audience: "Students 11–17 y.o.",
    },
  },
  {
    id: "ege",
    hanzi: "百",
    category: "exam",
    goalId: "ege",
    ru: {
      name: "ЕГЭ на 100 баллов",
      tag: "С Тимофеем — 99 баллов ЕГЭ-2023",
      desc: "Точечная подготовка к ЕГЭ по китайскому языку. Все секреты экзамена, эксклюзивные материалы и разбор устной части.",
      price: "1 800 ₽",
      unit: "/ час",
      format: "Индивидуально или мини-группа",
      group: "1 на 1 или до 3 человек",
      duration: "6–12 месяцев до экзамена",
      level: "HSK 2 → 90+ баллов ЕГЭ",
      bullets: [
        "Старший преподаватель раскроет все секреты экзамена",
        "Эксклюзивные материалы для устной части",
        "Пробные экзамены каждый месяц с разбором ошибок",
        "Психологическая подготовка к формату ЕГЭ",
      ],
      audience: "Ученики 10–11 классов",
    },
    en: {
      name: "EGE for 100 points",
      tag: "With Timofey — 99 points EGE-2023",
      desc: "Focused prep for the Chinese EGE. Every secret of the exam, exclusive materials and oral-part breakdown.",
      price: "1 800 ₽",
      unit: "/ hour",
      format: "One-to-one or mini-group",
      group: "1-on-1 or up to 3",
      duration: "6–12 months before exam",
      level: "HSK 2 → 90+ EGE points",
      bullets: [
        "Senior teacher reveals every secret of the exam",
        "Exclusive materials for the oral part",
        "Monthly mock exams with error analysis",
        "Psychological prep for the EGE format",
      ],
      audience: "Grade 10–11 students",
    },
  },
];

const CAT_META: Record<Category, { ru: string; en: string; icon: typeof Users }> = {
  all: { ru: "Все программы", en: "All programmes", icon: Sparkles },
  group: { ru: "Группы", en: "Groups", icon: Users },
  solo: { ru: "Индивидуально", en: "One-to-one", icon: User },
  kids: { ru: "Дети и школа", en: "Kids & school", icon: Baby },
  exam: { ru: "Экзамены", en: "Exams", icon: Trophy },
};

function PricingPage() {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<Category>("all");
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | undefined>();

  const filtered = useMemo(
    () => (cat === "all" ? PROGRAMS : PROGRAMS.filter((p) => p.category === cat)),
    [cat],
  );

  const openWith = (goalId?: string) => {
    setSelectedGoal(goalId);
    setOpen(true);
  };

  const heroTitle = lang === "ru" ? "Все программы" : "All programmes";
  const heroLead =
    lang === "ru"
      ? "От первого 你好 до сдачи HSK 6 и ЕГЭ — выберите формат под свою цель и возраст. Все программы ведут преподаватели с уровнем HSK 5–6."
      : "From your first 你好 to HSK 6 and EGE — pick the format that fits your goal and age. Every programme is led by teachers with HSK 5–6.";
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

          {/* Filter chips */}
          <div className="mt-10 flex flex-wrap gap-2">
            {(Object.keys(CAT_META) as Category[]).map((c) => {
              const active = cat === c;
              const Icon = CAT_META[c].icon;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition",
                    active
                      ? "border-brand bg-brand text-brand-foreground shadow-soft"
                      : "border-border/70 bg-surface text-foreground hover:border-brand/60 hover:text-brand",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {CAT_META[c][lang]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs list */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <motion.div
          key={cat}
          initial="hidden"
          animate="show"
          variants={stagger(0.08)}
          className="space-y-8"
        >
          {filtered.map((p, i) => {
            const c = p[lang];
            const isSpecial = !!p.special;
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

                  {isSpecial && (
                    <div className="relative inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-foreground">
                      <Sparkles className="h-3 w-3" />
                      {lang === "ru" ? "Хит продаж" : "Bestseller"}
                    </div>
                  )}

                  <h2
                    className={cn(
                      "relative mt-4 font-display text-3xl font-extrabold uppercase leading-tight md:text-4xl",
                      isSpecial ? "text-cream" : "text-foreground",
                    )}
                  >
                    {c.name}
                  </h2>
                  <p className="relative mt-2 text-sm font-semibold text-brand">{c.tag}</p>
                  <p
                    className={cn(
                      "relative mt-5 max-w-xl text-[15px] leading-relaxed",
                      isSpecial ? "text-cream/80" : "text-surface-foreground/80",
                    )}
                  >
                    {c.desc}
                  </p>

                  {/* meta grid */}
                  <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {meta.map((m) => (
                      <div
                        key={m.label}
                        className={cn(
                          "rounded-2xl border p-3",
                          isSpecial
                            ? "border-cream/15 bg-cream/[0.04]"
                            : "border-border/60 bg-background/60",
                        )}
                      >
                        <m.icon
                          className={cn(
                            "h-4 w-4",
                            isSpecial ? "text-brand" : "text-brand",
                          )}
                        />
                        <div
                          className={cn(
                            "mt-2 text-xs font-semibold leading-snug",
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
                        "mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold uppercase tracking-wider transition hover:opacity-90",
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
