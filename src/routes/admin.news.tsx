import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, Modal, PageHeader, Panel, PhotoPicker, TextArea, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/news")({
  component: () => (
    <AdminOnly roles={["admin", "manager", "editor"]}>
      <NewsAdminPage />
    </AdminOnly>
  ),
});

const emptyDraft = () => ({
  title: "",
  text: "",
  photo: "",
  date: new Date().toISOString().slice(0, 10),
  author: "",
});

function NewsAdminPage() {
  const { news, setNews } = useAdmin();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());

  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        title="Новости"
        subtitle="Публикации на странице «Новости»"
        action={
          <Btn onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Добавить новость
          </Btn>
        }
      />

      <div className="grid gap-4">
        {sorted.map((n) => (
          <Panel key={n.id} className="p-5">
            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
              <PhotoPicker
                value={n.photo ?? ""}
                onChange={(photo) => setNews((p) => p.map((x) => (x.id === n.id ? { ...x, photo } : x)))}
              />
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Заголовок">
                    <TextInput
                      value={n.title}
                      onChange={(e) => setNews((p) => p.map((x) => (x.id === n.id ? { ...x, title: e.target.value } : x)))}
                    />
                  </Field>
                  <Field label="Дата">
                    <TextInput
                      type="date"
                      value={n.date.slice(0, 10)}
                      onChange={(e) => setNews((p) => p.map((x) => (x.id === n.id ? { ...x, date: e.target.value } : x)))}
                    />
                  </Field>
                </div>
                <Field label="Текст">
                  <TextArea
                    value={n.text}
                    onChange={(e) => setNews((p) => p.map((x) => (x.id === n.id ? { ...x, text: e.target.value } : x)))}
                  />
                </Field>
                <div className="flex items-end justify-between gap-3">
                  <div className="w-full max-w-xs">
                    <Field label="Подпись">
                      <TextInput
                        value={n.author ?? ""}
                        placeholder="Администрация школы"
                        onChange={(e) => setNews((p) => p.map((x) => (x.id === n.id ? { ...x, author: e.target.value } : x)))}
                      />
                    </Field>
                  </div>
                  <Btn
                    variant="ghost"
                    size="sm"
                    className="text-[oklch(0.55_0.2_27)]"
                    onClick={() => setNews((p) => p.filter((x) => x.id !== n.id))}
                  >
                    <Trash2 className="h-4 w-4" /> Удалить
                  </Btn>
                </div>
              </div>
            </div>
          </Panel>
        ))}
        {news.length === 0 ? <div className="py-10 text-sm text-[oklch(0.55_0.03_45)]">Новостей пока нет</div> : null}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Новая новость">
        <div className="space-y-4">
          <PhotoPicker value={draft.photo} onChange={(photo) => setDraft({ ...draft, photo })} />
          <Field label="Заголовок">
            <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label="Дата">
            <TextInput type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </Field>
          <Field label="Текст">
            <TextArea value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
          </Field>
          <Field label="Подпись">
            <TextInput
              value={draft.author}
              placeholder="Администрация школы"
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            />
          </Field>
          <div className="flex gap-2">
            <Btn
              disabled={!draft.title.trim()}
              onClick={() => {
                setNews((p) => [...p, { id: `n${Date.now()}`, ...draft }]);
                setDraft(emptyDraft());
                setCreating(false);
              }}
            >
              Опубликовать
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
