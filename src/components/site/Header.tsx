import { Link } from "@tanstack/react-router";
import { useI18n } from "@/providers/i18n";
import { LangToggle, ThemeToggle } from "./Toggles";

export function Header() {
  const { t } = useI18n();
  const nav = [
    { to: "/about", label: t("nav.about") },
    { to: "/team", label: t("nav.team") },
    { to: "/pricing", label: t("nav.pricing") },
    { to: "/schedule", label: t("nav.schedule") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-brand-foreground font-hanzi text-lg font-bold">
            中
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">CHINAR</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center gap-2">
          <nav className="flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-4 py-2 text-[15px] font-extrabold uppercase tracking-tight text-black hover:bg-muted transition"
                activeProps={{ className: "bg-muted text-black" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/contacts"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-extrabold uppercase text-brand-foreground shadow-soft hover:opacity-90 transition"
          >
            {t("cta.enroll")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
