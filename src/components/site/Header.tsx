import { useEffect, useState } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/providers/i18n";
import { LangToggle, ThemeToggle } from "./Toggles";
import { EnrollModal } from "./EnrollModal";
import { Mascot } from "./Mascot";
import { cn } from "@/lib/utils";

function useScrollTo() {
  const location = useLocation();
  const router = useRouter();
  return (sectionId: string) => {
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.navigate({ to: "/", hash: sectionId });
    }
  };
}

function ScrollNavLink({
  sectionId,
  children,
}: {
  sectionId: string;
  children: React.ReactNode;
}) {
  const scrollTo = useScrollTo();
  return (
    <button
      type="button"
      onClick={() => scrollTo(sectionId)}
      className="rounded-full px-4 py-2 text-[15px] font-extrabold uppercase tracking-tight text-black hover:bg-muted transition"
    >
      {children}
    </button>
  );
}

export function Header() {
  const { t } = useI18n();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border/60 md:sticky">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-brand-foreground font-hanzi text-lg font-bold">
              中
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">CHINAR</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            <nav className="flex items-center gap-1">
              <ScrollNavLink sectionId="about">{t("nav.about")}</ScrollNavLink>
              <ScrollNavLink sectionId="team">{t("nav.team")}</ScrollNavLink>
              <Link
                to="/pricing"
                className="rounded-full px-4 py-2 text-[15px] font-extrabold uppercase tracking-tight text-black hover:bg-muted transition"
                activeProps={{ className: "bg-muted text-black" }}
              >
                {t("nav.pricing")}
              </Link>
              <Link
                to="/schedule"
                className="rounded-full px-4 py-2 text-[15px] font-extrabold uppercase tracking-tight text-black hover:bg-muted transition"
                activeProps={{ className: "bg-muted text-black" }}
              >
                {t("nav.schedule")}
              </Link>
            </nav>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEnrollOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-extrabold uppercase text-brand-foreground shadow-soft hover:opacity-90 transition"
            >
              {t("cta.enroll")}
            </button>
            <LangToggle />
            <ThemeToggle />
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            className="md:hidden grid h-11 w-11 place-items-center rounded-2xl bg-black text-white shadow-soft active:scale-95 transition"
          >
            <Menu className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            onClose={() => setMenuOpen(false)}
            onEnroll={() => {
              setMenuOpen(false);
              setEnrollOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <EnrollModal open={enrollOpen} onClose={() => setEnrollOpen(false)} />
    </>
  );
}

function MobileMenu({
  onClose,
  onEnroll,
}: {
  onClose: () => void;
  onEnroll: () => void;
}) {
  const { t } = useI18n();
  const scrollTo = useScrollTo();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleScroll = (id: string) => {
    onClose();
    // wait for drawer to close before scrolling
    setTimeout(() => scrollTo(id), 150);
  };

  const NAV_HANZI = ["学", "友", "价", "时", "茶"];

  return (
    <motion.div
      className="fixed inset-0 z-[90] md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

      <motion.aside
        role="dialog"
        aria-modal="true"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.7 }}
        style={{ willChange: "transform" }}
        className="absolute right-0 top-0 flex h-full w-[86%] max-w-[380px] flex-col overflow-hidden bg-background shadow-float"
      >
        {/* decorative bg — hanzi + peach glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-soft/60 via-background to-background" />
          <div
            className="absolute -right-8 top-16 select-none font-hanzi font-black leading-none text-brand/[0.07]"
            style={{ fontSize: "18rem" }}
          >
            学
          </div>
          <div
            className="absolute -left-4 bottom-56 select-none font-hanzi font-black leading-none text-brand/[0.05]"
            style={{ fontSize: "10rem" }}
          >
            汉
          </div>
          <div className="absolute inset-0 bg-grain opacity-25 mix-blend-multiply" />
        </div>

        {/* top bar */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-brand-foreground font-hanzi text-lg font-bold">
              中
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">CHINAR</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-foreground text-background active:scale-95 transition"
          >
            <X className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>

        {/* nav */}
        <nav className="mt-8 flex-1 overflow-y-auto px-5">
          <ul className="space-y-1">
            {[
              { type: "scroll" as const, id: "about", label: t("nav.about") },
              { type: "scroll" as const, id: "team", label: t("nav.team") },
              { type: "link" as const, to: "/pricing", label: t("nav.pricing") },
              { type: "link" as const, to: "/schedule", label: t("nav.schedule") },
            ].map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.type === "scroll" ? (
                  <button
                    type="button"
                    onClick={() => handleScroll(item.id)}
                    className="group flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-2xl font-black uppercase tracking-tight text-foreground transition hover:bg-foreground/5"
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden
                      className="font-hanzi text-2xl text-brand/70 transition-transform group-hover:translate-x-1"
                    >
                      {NAV_HANZI[i]}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="group flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-2xl font-black uppercase tracking-tight text-foreground transition hover:bg-foreground/5"
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden
                      className="font-hanzi text-2xl text-brand/70 transition-transform group-hover:translate-x-1"
                    >
                      {NAV_HANZI[i]}
                    </span>
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>

          {/* mascot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex items-end justify-center"
          >
            <Mascot pose="wave" size={140} />
          </motion.div>
        </nav>

        {/* bottom: CTA + toggles */}
        <div className="border-t border-border/60 bg-background/70 px-5 pb-6 pt-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={onEnroll}
            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-extrabold uppercase tracking-wider text-brand-foreground shadow-float active:scale-[0.98] transition"
          >
            {t("cta.enroll")}
          </button>
          <div className={cn("mt-4 flex items-center justify-center gap-2")}>
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
