import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, Modal, PageHeader, Panel, TextArea, TextInput, Toggle } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/pricing")({ component: () => <AdminOnly><PricingAdminPage /></AdminOnly> });

function PricingAdminPage() {
  const { prices, setPrices } = useAdmin();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    price: "",
    period: "/ мес",
    features: "",
    featured: false,
    visible: true,
    hanzi: "",
    tag: "",
    format: "",
    groupSize: "",
    duration: "",
    level: "",
    footer: "",
    highlight: "",
  });
  const patch = (id: string, part: Record<string, unknown>) =>
    setPrices((v) => v.map((x) => (x.id === id ? { ...x, ...part } : x)));


  return (
    <>
      <PageHeader
        title="Цены"
        subtitle="Программы и тарифы, отображаемые на главной и на странице «Все программы»"
        action={
          <Btn onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Добавить тариф
          </Btn>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {prices.map((p) => (
          <Panel key={p.id} className={`p-5 ${p.featured ? "ring-2 ring-[oklch(0.8_0.15_75)]" : ""}`}>
            <div className="space-y-3">
              <Field label="Название">
                <TextInput value={p.title} onChange={(e) => setPrices((v) => v.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Цена">
                  <TextInput value={p.price} onChange={(e) => setPrices((v) => v.map((x) => (x.id === p.id ? { ...x, price: e.target.value } : x)))} />
                </Field>
                <Field label="Период">
                  <TextInput value={p.period} onChange={(e) => setPrices((v) => v.map((x) => (x.id === p.id ? { ...x, period: e.target.value } : x)))} />
                </Field>
              </div>
              <Field label="Что входит (по строке на пункт)">
                <TextArea
                  className="min-h-28"
                  value={p.features.join("\n")}
                  onChange={(e) => patch(p.id, { features: e.target.value.split("\n") })}
                />
              </Field>
              <details className="rounded-2xl border border-[oklch(0.92_0.02_60)] p-3">
                <summary className="cursor-pointer text-sm font-semibold">Детали для страницы «Все программы»</summary>
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Иероглиф">
                      <TextInput value={p.hanzi ?? ""} onChange={(e) => patch(p.id, { hanzi: e.target.value })} />
                    </Field>
                    <Field label="Подзаголовок">
                      <TextInput value={p.tag ?? ""} onChange={(e) => patch(p.id, { tag: e.target.value })} />
                    </Field>
                    <Field label="Формат">
                      <TextInput value={p.format ?? ""} onChange={(e) => patch(p.id, { format: e.target.value })} />
                    </Field>
                    <Field label="Размер группы">
                      <TextInput value={p.groupSize ?? ""} onChange={(e) => patch(p.id, { groupSize: e.target.value })} />
                    </Field>
                    <Field label="Длительность">
                      <TextInput value={p.duration ?? ""} onChange={(e) => patch(p.id, { duration: e.target.value })} />
                    </Field>
                    <Field label="Уровень">
                      <TextInput value={p.level ?? ""} onChange={(e) => patch(p.id, { level: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Итоговая фраза">
                    <TextArea className="min-h-16" value={p.footer ?? ""} onChange={(e) => patch(p.id, { footer: e.target.value })} />
                  </Field>
                  <Field label="Плашка (акция)">
                    <TextInput value={p.highlight ?? ""} onChange={(e) => patch(p.id, { highlight: e.target.value })} />
                  </Field>
                </div>
              </details>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Toggle checked={p.visible} label="На сайте" onChange={(val) => setPrices((v) => v.map((x) => (x.id === p.id ? { ...x, visible: val } : x)))} />
                <Btn
                  size="sm"
                  variant={p.featured ? "primary" : "outline"}
                  onClick={() => setPrices((v) => v.map((x) => ({ ...x, featured: x.id === p.id ? !x.featured : x.featured })))}
                >
                  <Star className="h-3.5 w-3.5" /> Особый
                </Btn>
                <Btn variant="ghost" size="sm" className="text-[oklch(0.55_0.2_27)]" onClick={() => setPrices((v) => v.filter((x) => x.id !== p.id))}>
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Новый тариф">
        <div className="space-y-4">
          <Field label="Название">
            <TextInput value={draft.title} placeholder="HSK 3" onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Цена">
              <TextInput value={draft.price} placeholder="6 500 ₽" onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
            </Field>
            <Field label="Период">
              <TextInput value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value })} />
            </Field>
          </div>
          <Field label="Что входит (по строке на пункт)">
            <TextArea className="min-h-28" value={draft.features} onChange={(e) => setDraft({ ...draft, features: e.target.value })} />
          </Field>
          <div className="flex gap-2">
            <Btn
              onClick={() => {
                setPrices((v) => [
                  ...v,
                  { id: `p${Date.now()}`, ...draft, features: draft.features.split("\n").filter(Boolean) },
                ]);
                setDraft({ title: "", price: "", period: "в месяц", features: "", featured: false, visible: true });
                setCreating(false);
              }}
            >
              Добавить
            </Btn>
            <Btn variant="outline" onClick={() => setCreating(false)}>
              Отмена
            </Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}
