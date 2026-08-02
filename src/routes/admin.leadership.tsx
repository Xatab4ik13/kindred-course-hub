import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, Modal, PageHeader, Panel, PhotoPicker, TextArea, TextInput, Toggle } from "@/components/admin/ui";
import type { Leader } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/leadership")({ component: () => <AdminOnly><LeadershipPage /></AdminOnly> });

const emptyLeader = (): Leader => ({ id: "", name: "", photo: "", role: "", bio: "", visible: true });

function LeadershipPage() {
  const { leaders, setLeaders } = useAdmin();
  const [draft, setDraft] = useState<Leader | null>(null);
  const [isNew, setIsNew] = useState(false);

  const save = () => {
    if (!draft) return;
    if (isNew) {
      setLeaders((p) => [...p, { ...draft, id: `l${Date.now()}` }]);
    } else {
      setLeaders((p) => p.map((x) => (x.id === draft.id ? draft : x)));
    }
    setDraft(null);
  };

  return (
    <>
      <PageHeader
        title="Руководство"
        subtitle="Блок «Наша команда → Руководство» на главной странице"
        action={
          <Btn
            onClick={() => {
              setIsNew(true);
              setDraft(emptyLeader());
            }}
          >
            <Plus className="h-4 w-4" /> Добавить
          </Btn>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {leaders.map((l) => (
          <Panel key={l.id} className="p-5">
            {l.photo ? (
              <img src={l.photo} alt={l.name} className="h-40 w-full rounded-2xl object-cover" />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-[oklch(0.95_0.02_60)] text-sm text-[oklch(0.6_0.03_45)]">нет фото</div>
            )}
            <div className="mt-4 space-y-3">
              <div className="font-display text-lg font-extrabold">{l.name}</div>
              <div className="text-sm text-[oklch(0.5_0.03_45)]">{l.role}</div>
              <p className="text-sm text-[oklch(0.4_0.03_45)]">{l.bio}</p>
              <div className="flex flex-wrap gap-2">
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsNew(false);
                    setDraft(l);
                  }}
                >
                  Редактировать
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => setLeaders((p) => p.filter((x) => x.id !== l.id))}>
                  <Trash2 className="h-3.5 w-3.5" /> Удалить
                </Btn>
              </div>
              <Toggle
                checked={l.visible}
                label="Показывать на сайте"
                onChange={(v) => setLeaders((p) => p.map((x) => (x.id === l.id ? { ...x, visible: v } : x)))}
              />
            </div>
          </Panel>
        ))}
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title={isNew ? "Новый руководитель" : "Руководитель"}>
        {draft ? (
          <div className="space-y-4">
            <PhotoPicker value={draft.photo} onChange={(photo) => setDraft({ ...draft, photo })} />
            <Field label="Имя">
              <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Должность">
              <TextInput value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
            </Field>
            <Field label="Описание">
              <TextArea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            </Field>
            <Toggle checked={draft.visible} label="Показывать на сайте" onChange={(v) => setDraft({ ...draft, visible: v })} />
            <div className="flex gap-2">
              <Btn disabled={!draft.name.trim()} onClick={save}>
                Сохранить
              </Btn>
              <Btn variant="outline" onClick={() => setDraft(null)}>
                Отмена
              </Btn>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
