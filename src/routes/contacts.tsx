import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/providers/i18n";
import { EnrollModal } from "@/components/site/EnrollModal";
import { useState } from "react";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — CHINAR" },
      {
        name: "description",
        content: "Свяжитесь со школой китайского языка CHINAR.",
      },
      { property: "og:title", content: "Контакты — CHINAR" },
      {
        property: "og:description",
        content: "Свяжитесь со школой китайского языка CHINAR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Контакты — CHINAR" },
      {
        name: "twitter:description",
        content: "Свяжитесь со школой китайского языка CHINAR.",
      },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const { t } = useI18n();
  const [enrollOpen, setEnrollOpen] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">
        {t("cta.title")}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Оставьте заявку — мы свяжемся с вами и подберём удобный формат занятий.
      </p>

      <div className="mt-10 space-y-6 rounded-3xl bg-card p-6 md:p-10 shadow-soft">
        <div>
          <h2 className="font-display text-xl font-bold">Telegram / WhatsApp</h2>
          <a
            href="https://t.me/chinar_school"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-lg text-brand hover:underline"
          >
            @chinar_school
          </a>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">Email</h2>
          <a
            href="mailto:hello@chinar.school"
            className="mt-1 inline-block text-lg text-brand hover:underline"
          >
            hello@chinar.school
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setEnrollOpen(true)}
        className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-brand-foreground hover:scale-[1.02] transition"
      >
        {t("cta.enroll")}
      </button>

      <EnrollModal open={enrollOpen} onClose={() => setEnrollOpen(false)} />
    </main>
  );
}
