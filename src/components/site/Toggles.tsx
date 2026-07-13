import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "@/providers/theme";
import { useI18n } from "@/providers/i18n";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:bg-muted transition",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "ru" ? "en" : "ru")}
      aria-label="Switch language"
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-medium text-foreground hover:bg-muted transition",
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      {lang.toUpperCase()}
    </button>
  );
}
