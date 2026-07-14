import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Phone, Send, Check } from "lucide-react";
import { useI18n } from "@/providers/i18n";
import { cn } from "@/lib/utils";
import type { DictKey } from "@/i18n/dict";

type Tab = "form" | "contact";

const GOALS: { id: string; key: DictKey }[] = [
  { id: "hsk1", key: "enroll.goal.hsk1" },
  { id: "hsk2", key: "enroll.goal.hsk2" },
  { id: "individual", key: "enroll.goal.individual" },
  { id: "group", key: "enroll.goal.group" },
  { id: "ege", key: "enroll.goal.ege" },
  { id: "kids", key: "enroll.goal.kids" },
  { id: "other", key: "enroll.goal.other" },
];

export interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  defaultGoal?: string;
}

export function EnrollModal({ open, onClose, defaultGoal }: EnrollModalProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<string | null>(defaultGoal ?? null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; goal?: string }>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setGoal(defaultGoal ?? null);
      setSent(false);
      setErrors({});
    }
  }, [open, defaultGoal]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = t("enroll.error.name");
    if (phone.replace(/\D/g, "").length < 7) errs.phone = t("enroll.error.phone");
    if (!goal) errs.goal = t("enroll.error.goal");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/70"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] bg-background shadow-float"
          >

            {/* Decorative hanzi */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-16 select-none font-hanzi text-[12rem] leading-none text-brand/[0.06]"
            >
              学
            </div>
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand via-brand/70 to-brand/30" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative p-7 md:p-9">
              <div className="font-display text-sm font-extrabold uppercase tracking-widest text-brand">
                CHINAR
              </div>
              <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight text-foreground md:text-[1.75rem]">
                {t("enroll.title")}
              </h2>

              {/* Tabs */}
              <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-brand-soft/60 p-1.5">
                {(["form", "contact"] as const).map((k) => {
                  const active = tab === k;
                  const Icon = k === "form" ? Phone : Send;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setTab(k)}
                      className={cn(
                        "relative inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold transition",
                        active
                          ? "bg-brand text-brand-foreground shadow-soft"
                          : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t(k === "form" ? "enroll.tab.form" : "enroll.tab.contact")}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                {tab === "form" ? (
                  <div>

                      {sent ? (
                        <div className="flex flex-col items-center py-10 text-center">
                          <div className="grid h-16 w-16 place-items-center rounded-full bg-brand text-brand-foreground shadow-glow">
                            <Check className="h-8 w-8" strokeWidth={3} />
                          </div>
                          <h3 className="mt-5 font-display text-xl font-extrabold uppercase">
                            {t("enroll.success.title")}
                          </h3>
                          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                            {t("enroll.success.text")}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                          <Field
                            label={t("enroll.name.label")}
                            error={errors.name}
                          >
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder={t("enroll.name.placeholder")}
                              maxLength={80}
                              className="h-12 w-full rounded-2xl border border-border/60 bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                          </Field>
                          <Field
                            label={t("enroll.phone.label")}
                            error={errors.phone}
                          >
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t("enroll.phone.placeholder")}
                              maxLength={30}
                              className="h-12 w-full rounded-2xl border border-border/60 bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                          </Field>
                          <Field
                            label={t("enroll.goal.label")}
                            error={errors.goal}
                          >
                            <div className="flex flex-wrap gap-2">
                              {GOALS.map((g) => {
                                const active = goal === g.id;
                                return (
                                  <button
                                    key={g.id}
                                    type="button"
                                    onClick={() => setGoal(g.id)}
                                    className={cn(
                                      "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                      active
                                        ? "border-brand bg-brand text-brand-foreground shadow-soft"
                                        : "border-border/70 bg-surface text-foreground hover:border-brand/60 hover:text-brand",
                                    )}
                                  >
                                    {t(g.key)}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>
                          <button
                            type="submit"
                            className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-bold uppercase tracking-wider text-brand-foreground shadow-float transition hover:opacity-95 hover:shadow-glow"
                          >
                            {t("enroll.submit")}
                          </button>
                        </form>
                      )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t("enroll.contact.lead")}
                    </p>
                    <div className="mt-5 space-y-3">
                      <ContactLink
                        href="https://t.me/china_ya"
                        bg="bg-[#0088cc]"
                        initials="TG"
                        title="TELEGRAM"
                        desc={t("enroll.contact.tgDesc")}
                      />
                      <ContactLink
                        href="https://vk.com/chinaja"
                        bg="bg-[#0077ff]"
                        initials="VK"
                        title="ВКОНТАКТЕ"
                        desc={t("enroll.contact.vkDesc")}
                      />
                    </div>
                    <p className="mt-6 text-center text-xs text-muted-foreground">
                      {t("enroll.contact.footer")}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-foreground/80">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-brand">{error}</p>}
    </div>
  );
}

function ContactLink({
  href,
  bg,
  initials,
  title,
  desc,
}: {
  href: string;
  bg: string;
  initials: string;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-4 rounded-2xl p-4 text-white shadow-soft transition hover:shadow-float",
        bg,
      )}
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 font-display text-sm font-extrabold">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-base font-extrabold uppercase tracking-wider">
          {title}
        </div>
        <div className="truncate text-xs text-white/85">{desc}</div>
      </div>
      <Send className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
    </a>
  );
}
