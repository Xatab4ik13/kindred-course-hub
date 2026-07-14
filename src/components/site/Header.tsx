import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { useI18n } from "@/providers/i18n";
import { LangToggle, ThemeToggle } from "./Toggles";

function ScrollNavLink({
  sectionId,
  children,
}: {
  sectionId: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.navigate({ to: "/", hash: sectionId });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full px-4 py-2 text-[15px] font-extrabold uppercase tracking-tight text-black hover:bg-muted transition"
    >
      {children}
    </button>
  );
}

export function Header() {
  const { t } = useI18n();

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

        <div className="flex items-center gap-2">
          <Link
            to="/contacts"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-extrabold uppercase text-brand-foreground shadow-soft hover:opacity-90 transition"
          >
            {t("cta.enroll")}
          </Link>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
