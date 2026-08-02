import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageSquareQuote,
  Receipt,
  Settings2,
  Shield,
  Tags,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, Panel, TextInput } from "@/components/admin/ui";
import mascot from "@/assets/mascot/day-1.png";

type NavItem = { to: string; label: string; icon: typeof Home };

const ADMIN_NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Обзор",
    items: [
      { to: "/admin", label: "Дашборд", icon: Home },
      { to: "/admin/requests", label: "Заявки", icon: ClipboardList },
      { to: "/admin/lessons", label: "Статистика занятий", icon: BarChart3 },
    ],
  },
  {
    group: "Учебный процесс",
    items: [
      { to: "/admin/teachers", label: "Преподаватели", icon: GraduationCap },
      { to: "/admin/schedule", label: "Расписание", icon: CalendarDays },
    ],
  },
  {
    group: "Сайт",
    items: [
      { to: "/admin/leadership", label: "Руководство", icon: Users },
      { to: "/admin/reviews", label: "Отзывы", icon: MessageSquareQuote },
      { to: "/admin/pricing", label: "Цены", icon: Tags },
      { to: "/admin/settings", label: "Контакты и реквизиты", icon: Receipt },
    ],
  },
  {
    group: "Доступы",
    items: [{ to: "/admin/users", label: "Пользователи", icon: Shield }],
  },
];

const TEACHER_NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Мой кабинет",
    items: [
      { to: "/admin", label: "Дашборд", icon: Home },
      { to: "/admin/my-schedule", label: "Моё расписание", icon: CalendarDays },
      { to: "/admin/my-lessons", label: "Мои занятия", icon: ClipboardList },
      { to: "/admin/my-profile", label: "Мой профиль", icon: UserRound },
    ],
  },
];

function LoginScreen() {
  const { signIn } = useAdmin();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.02_60)] px-4 py-10">
      <Panel className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <img src={mascot} alt="" className="h-12 w-12 object-contain" />
          <div>
            <div className="font-display text-xl font-extrabold tracking-tight">CHINAR</div>
            <div className="text-xs text-[oklch(0.55_0.03_45)]">Панель управления</div>
          </div>
        </div>

        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            void signIn(login.trim(), password)
              .then((ok) => setError(!ok))
              .finally(() => setBusy(false));
          }}
        >
          <Field label="Логин">
            <TextInput value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" placeholder="AdminChinar1" />
          </Field>
          <Field label="Пароль">
            <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
          </Field>
          {error ? <div className="rounded-2xl bg-[oklch(0.95_0.05_27)] px-4 py-2.5 text-sm text-[oklch(0.5_0.19_27)]">Неверный логин или пароль</div> : null}
          <Btn type="submit" className="w-full" disabled={busy}>
            {busy ? "Входим…" : "Войти"}
          </Btn>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs font-semibold text-[oklch(0.55_0.03_45)] hover:text-[oklch(0.6_0.21_27)]">
          ← Вернуться на сайт
        </Link>
      </Panel>
    </div>
  );
}

export function AdminShell() {
  const { session, signOut, loading } = useAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  // Панель всегда в светлой теме
  useEffect(() => {
    const el = document.documentElement;
    const wasDark = el.classList.contains("dark");
    el.classList.remove("dark");
    return () => {
      if (wasDark) el.classList.add("dark");
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.02_60)] text-sm text-[oklch(0.55_0.03_45)]">
        Загружаем данные…
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  const nav = session.role === "admin" ? ADMIN_NAV : TEACHER_NAV;

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link to="/" className="flex items-center gap-3">
        <img src={mascot} alt="" className="h-10 w-10 object-contain" />
        <div>
          <div className="font-display text-base font-extrabold tracking-tight">CHINAR</div>
          <div className="text-[11px] text-[oklch(0.55_0.03_45)]">{session.role === "admin" ? "Администратор" : "Преподаватель"}</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {nav.map((group) => (
          <div key={group.group}>
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[oklch(0.65_0.03_45)]">{group.group}</div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-[oklch(0.6_0.21_27)] text-white"
                        : "text-[oklch(0.35_0.03_45)] hover:bg-[oklch(0.95_0.02_60)]",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="rounded-2xl bg-[oklch(0.96_0.02_60)] p-3">
        <div className="truncate text-sm font-semibold">{session.name}</div>
        <div className="truncate text-xs text-[oklch(0.55_0.03_45)]">{session.login}</div>
        <Btn variant="outline" size="sm" className="mt-3 w-full" onClick={signOut}>
          <LogOut className="h-3.5 w-3.5" /> Выйти
        </Btn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.02_60)] text-[oklch(0.22_0.05_40)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[oklch(0.9_0.02_60)] bg-white lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[oklch(0.9_0.02_60)] bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Btn variant="ghost" size="sm" onClick={() => setMenuOpen(true)} aria-label="Меню">
          <Menu className="h-5 w-5" />
        </Btn>
        <span className="font-display text-sm font-extrabold">CHINAR · Панель</span>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-[oklch(0.2_0.03_40_/_0.45)]" />
          <div className="absolute inset-y-0 left-0 w-72 bg-white" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      ) : null}

      <main className="px-4 py-6 md:px-8 md:py-10 lg:pl-72">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { session } = useAdmin();
  if (session?.role !== "admin") {
    return (
      <Panel className="p-8 text-center text-sm text-[oklch(0.5_0.03_45)]">
        Раздел доступен только администратору.
      </Panel>
    );
  }
  return <>{children}</>;
}

export function Settings2Icon() {
  return <Settings2 className="h-4 w-4" />;
}
