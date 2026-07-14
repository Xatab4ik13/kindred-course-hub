import { useTheme } from "@/providers/theme";
import { useI18n } from "@/providers/i18n";
import { cn } from "@/lib/utils";

function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex h-10 items-center rounded-full border border-border bg-surface p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "relative z-10 inline-flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-xs font-bold uppercase tracking-wider transition",
              active
                ? "bg-brand text-brand-foreground shadow-soft"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <Segmented
      ariaLabel="Toggle theme"
      value={theme === "dark" ? "dark" : "light"}
      options={[
        { value: "light", label: "☀" },
        { value: "dark", label: "☾" },
      ]}
      onChange={(v) => {
        if (v !== theme) toggle();
      }}
      className={className}
    />
  );
}

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <Segmented
      ariaLabel="Switch language"
      value={lang}
      options={[
        { value: "ru", label: "RU" },
        { value: "en", label: "EN" },
      ]}
      onChange={(v) => setLang(v)}
      className={className}
    />
  );
}
