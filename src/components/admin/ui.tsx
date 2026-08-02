import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[oklch(0.90_0.02_60)] bg-white text-[oklch(0.22_0.05_40)] shadow-[0_10px_30px_-18px_oklch(0.4_0.05_40_/_0.35)]",
        className,
      )}
      {...rest}
    />
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[oklch(0.5_0.03_45)]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger"; size?: "sm" | "md" };

export function Btn({ className, variant = "primary", size = "md", ...rest }: BtnProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        variant === "primary" && "bg-[oklch(0.6_0.21_27)] text-white hover:bg-[oklch(0.55_0.21_27)]",
        variant === "outline" && "border border-[oklch(0.88_0.03_50)] bg-white hover:bg-[oklch(0.97_0.02_60)]",
        variant === "ghost" && "hover:bg-[oklch(0.95_0.02_60)]",
        variant === "danger" && "border border-[oklch(0.85_0.08_27)] text-[oklch(0.55_0.21_27)] hover:bg-[oklch(0.96_0.04_30)]",
        className,
      )}
      {...rest}
    />
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[oklch(0.5_0.03_45)]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-[oklch(0.55_0.03_45)]">{hint}</span> : null}
    </label>
  );
}

const controlCls =
  "w-full rounded-2xl border border-[oklch(0.88_0.03_50)] bg-white px-4 py-2.5 text-sm outline-none placeholder:text-[oklch(0.7_0.02_50)] focus:border-[oklch(0.6_0.21_27)]";

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlCls, className)} {...rest} />;
}

export function TextArea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlCls, "min-h-24 resize-y", className)} {...rest} />;
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlCls, "pr-8", className)} {...rest} />;
}

export function PhotoPicker({ value, onChange, label = "Фотография" }: { value: string; onChange: (dataUrl: string) => void; label?: string }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[oklch(0.5_0.03_45)]">{label}</span>
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="" className="h-20 w-20 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[oklch(0.95_0.02_60)] text-xs text-[oklch(0.6_0.03_45)]">нет фото</div>
        )}
        <label className="cursor-pointer rounded-full border border-[oklch(0.88_0.03_50)] bg-white px-4 py-2 text-sm font-semibold hover:bg-[oklch(0.97_0.02_60)]">
          Загрузить фото
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onChange(String(reader.result));
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "green" | "red" | "amber" | "brand"; children: ReactNode }) {
  const tones: Record<string, string> = {
    neutral: "bg-[oklch(0.95_0.01_60)] text-[oklch(0.4_0.02_45)]",
    green: "bg-[oklch(0.93_0.07_150)] text-[oklch(0.42_0.12_150)]",
    red: "bg-[oklch(0.94_0.05_27)] text-[oklch(0.5_0.19_27)]",
    amber: "bg-[oklch(0.94_0.08_80)] text-[oklch(0.48_0.12_70)]",
    brand: "bg-[oklch(0.93_0.06_30)] text-[oklch(0.55_0.2_27)]",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Stat({ label, value, hint, tone = "neutral" }: { label: string; value: string | number; hint?: string; tone?: "neutral" | "brand" | "green" | "red" }) {
  const accent: Record<string, string> = {
    neutral: "text-[oklch(0.22_0.05_40)]",
    brand: "text-[oklch(0.6_0.21_27)]",
    green: "text-[oklch(0.45_0.13_150)]",
    red: "text-[oklch(0.55_0.2_27)]",
  };
  return (
    <Panel className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-[oklch(0.55_0.03_45)]">{label}</div>
      <div className={cn("mt-2 font-display text-3xl font-extrabold", accent[tone])}>{value}</div>
      {hint ? <div className="mt-1 text-xs text-[oklch(0.55_0.03_45)]">{hint}</div> : null}
    </Panel>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[oklch(0.2_0.03_40_/_0.45)] p-0 md:items-center md:p-6" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 text-[oklch(0.22_0.05_40)] md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-extrabold">{title}</h2>
          <Btn variant="ghost" size="sm" onClick={onClose} aria-label="Закрыть">
            ✕
          </Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm font-medium"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-[oklch(0.6_0.21_27)]" : "bg-[oklch(0.88_0.02_60)]",
        )}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function Bar({ value, tone = "brand" }: { value: number; tone?: "brand" | "green" | "red" }) {
  const colors: Record<string, string> = {
    brand: "bg-[oklch(0.6_0.21_27)]",
    green: "bg-[oklch(0.6_0.14_150)]",
    red: "bg-[oklch(0.65_0.18_30)]",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[oklch(0.94_0.01_60)]">
      <div className={cn("h-full rounded-full", colors[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
