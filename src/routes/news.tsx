import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/providers/i18n";
import { usePublicContent } from "@/lib/public-content";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Новости — CHINAR" },
      {
        name: "description",
        content: "Новости и объявления школы китайского языка CHINAR.",
      },
      { property: "og:title", content: "Новости — CHINAR" },
      { property: "og:description", content: "Новости школы CHINAR." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { t, lang } = useI18n();
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  const { news: posts } = usePublicContent();

  const sorted = useMemo(
    () => [...posts].sort((a, b) => b.date.localeCompare(a.date)),
    [posts],
  );

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 md:px-8 md:pt-16">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            {t("nav.news")}
          </span>
          <h1 className="mt-4 font-display text-[2.25rem] font-black leading-[1.05] tracking-tight md:text-5xl">
            {t("news.title")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            {t("news.subtitle")}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {sorted.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border/60 bg-surface/60 p-8 text-center text-sm text-muted-foreground">
              {t("news.empty")}
            </div>
          )}
          {sorted.map((p) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-soft"
            >
              {p.photo && (
                <img
                  src={p.photo}
                  alt=""
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6 md:p-8">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  {fmt(p.date)}
                </div>
                <h2 className="mt-3 font-display text-2xl font-black leading-tight text-foreground md:text-3xl">
                  {p.title}
                </h2>
                {p.text && (
                  <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-foreground/85">
                    {p.text}
                  </p>
                )}
                <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand">
                  {p.author || t("news.byAdmin")}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
