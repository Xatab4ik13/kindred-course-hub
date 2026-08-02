import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, Modal, PageHeader, Panel, TextArea, TextInput, Toggle } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/reviews")({ component: () => <AdminOnly><ReviewsPage /></AdminOnly> });

function ReviewsPage() {
  const { reviews, setReviews } = useAdmin();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ author: "", level: "", text: "", visible: true });

  return (
    <>
      <PageHeader
        title="Отзывы"
        subtitle="Отзывы учеников в тёмном блоке на главной"
        action={
          <Btn onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Добавить отзыв
          </Btn>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((r) => (
          <Panel key={r.id} className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Автор">
                <TextInput value={r.author} onChange={(e) => setReviews((p) => p.map((x) => (x.id === r.id ? { ...x, author: e.target.value } : x)))} />
              </Field>
              <Field label="Уровень">
                <TextInput value={r.level} onChange={(e) => setReviews((p) => p.map((x) => (x.id === r.id ? { ...x, level: e.target.value } : x)))} />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Текст отзыва">
                <TextArea value={r.text} onChange={(e) => setReviews((p) => p.map((x) => (x.id === r.id ? { ...x, text: e.target.value } : x)))} />
              </Field>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Toggle
                checked={r.visible}
                label="Показывать на сайте"
                onChange={(v) => setReviews((p) => p.map((x) => (x.id === r.id ? { ...x, visible: v } : x)))}
              />
              <Btn variant="ghost" size="sm" className="text-[oklch(0.55_0.2_27)]" onClick={() => setReviews((p) => p.filter((x) => x.id !== r.id))}>
                <Trash2 className="h-4 w-4" /> Удалить
              </Btn>
            </div>
          </Panel>
        ))}
        {reviews.length === 0 ? <div className="py-10 text-sm text-[oklch(0.55_0.03_45)]">Отзывов пока нет</div> : null}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Новый отзыв">
        <div className="space-y-4">
          <Field label="Автор">
            <TextInput value={draft.author} placeholder="Анна" onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
          </Field>
          <Field label="Уровень">
            <TextInput value={draft.level} placeholder="HSK 3" onChange={(e) => setDraft({ ...draft, level: e.target.value })} />
          </Field>
          <Field label="Текст">
            <TextArea value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
          </Field>
          <div className="flex gap-2">
            <Btn
              onClick={() => {
                setReviews((p) => [...p, { id: `r${Date.now()}`, ...draft }]);
                setDraft({ name: "", text: "", visible: true });
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
