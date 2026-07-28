import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Plus } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/providers/i18n";

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

interface Post {
  id: string;
  title: string;
  text: string;
  image: string;
  date: string; // ISO
}

const STORAGE_KEY = "chinar.news";

const SEED: Post[] = [];

function loadPosts(): Post[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Post[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

function savePosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function NewsPage() {
  const { t, lang } = useI18n();
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const sorted = useMemo(
    () => [...posts].sort((a, b) => b.date.localeCompare(a.date)),
    [posts],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const next: Post = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      text: text.trim(),
      image: image.trim(),
      date: new Date().toISOString(),
    };
    const updated = [next, ...posts];
    setPosts(updated);
    savePosts(updated);
    setTitle("");
    setText("");
    setImage("");
    setFormOpen(false);
  };

  const remove = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    savePosts(updated);
  };

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
        <div className="flex flex-wrap items-end justify-between gap-4">
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
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold uppercase text-brand-foreground shadow-soft hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" />
            {t("news.add.title")}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {formOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              onSubmit={submit}
              className="mt-6 overflow-hidden rounded-3xl border border-border/60 bg-surface p-5 shadow-soft"
            >
              <div className="flex flex-col gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("news.add.titlePh")}
                  className="h-11 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder={t("news.add.imagePh")}
                  className="h-11 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("news.add.textPh")}
                  rows={5}
                  className="w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center self-start rounded-full bg-brand px-6 text-sm font-extrabold uppercase text-brand-foreground shadow-soft hover:opacity-90 transition"
                >
                  {t("news.add.submit")}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

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
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{fmt(p.date)}</span>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label={t("news.delete")}
                    className="text-muted-foreground hover:text-brand transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
                  {t("news.byAdmin")}
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
