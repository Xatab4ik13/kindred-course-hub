import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Badge, Btn, Field, Modal, PageHeader, Panel, TextArea, TextInput, Toggle } from "@/components/admin/ui";
import type { Teacher } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/teachers")({ component: () => <AdminOnly><TeachersPage /></AdminOnly> });

function TeachersPage() {
  const { teachers, setTeachers, lessons } = useAdmin();
  const [editing, setEditing] = useState<Teacher | null>(null);

  return (
    <>
      <PageHeader title="Преподаватели" subtitle="Профили, контакты и нагрузка. Фотографии сохранены с сайта." />

      <div className="grid gap-4 md:grid-cols-2">
        {teachers.map((t) => {
          const mine = lessons.filter((l) => l.teacherId === t.id);
          const done = mine.filter((l) => l.status === "done").length;
          const cancelled = mine.filter((l) => l.status === "cancelled").length;
          return (
            <Panel key={t.id} className="p-5">
              <div className="flex gap-4">
                <img src={t.photo} alt={t.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-lg font-extrabold">{t.name}</h3>
                    <Badge tone={t.visible ? "green" : "neutral"}>{t.visible ? "На сайте" : "Скрыт"}</Badge>
                  </div>
                  <div className="text-sm text-[oklch(0.5_0.03_45)]">{t.role}</div>
                  <p className="mt-2 text-sm text-[oklch(0.4_0.03_45)]">{t.bio}</p>
                  <div className="mt-2 text-xs text-[oklch(0.55_0.03_45)]">
                    {t.email} · {t.phone}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-[oklch(0.96_0.02_60)] py-2">
                  <div className="font-display text-lg font-extrabold">{mine.length}</div>
                  <div className="text-[11px] text-[oklch(0.55_0.03_45)]">занятий</div>
                </div>
                <div className="rounded-2xl bg-[oklch(0.96_0.02_60)] py-2">
                  <div className="font-display text-lg font-extrabold text-[oklch(0.45_0.13_150)]">{done}</div>
                  <div className="text-[11px] text-[oklch(0.55_0.03_45)]">проведено</div>
                </div>
                <div className="rounded-2xl bg-[oklch(0.96_0.02_60)] py-2">
                  <div className="font-display text-lg font-extrabold text-[oklch(0.55_0.2_27)]">{cancelled}</div>
                  <div className="text-[11px] text-[oklch(0.55_0.03_45)]">отменено</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Btn size="sm" onClick={() => setEditing(t)}>
                  Редактировать профиль
                </Btn>
                <Link to="/admin/schedule" search={{}}>
                  <Btn size="sm" variant="outline">
                    <CalendarDays className="h-3.5 w-3.5" /> Расписание
                  </Btn>
                </Link>
                <Toggle
                  checked={t.visible}
                  label="Показывать на сайте"
                  onChange={(v) => setTeachers((prev) => prev.map((x) => (x.id === t.id ? { ...x, visible: v } : x)))}
                />
              </div>
            </Panel>
          );
        })}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Профиль преподавателя">
        {editing ? (
          <div className="space-y-4">
            <Field label="Имя">
              <TextInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Специализация">
              <TextInput value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
            </Field>
            <Field label="О преподавателе">
              <TextArea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <TextInput value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </Field>
              <Field label="Телефон">
                <TextInput value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              </Field>
            </div>
            <div className="flex gap-2">
              <Btn
                onClick={() => {
                  setTeachers((prev) => prev.map((x) => (x.id === editing.id ? editing : x)));
                  setEditing(null);
                }}
              >
                Сохранить
              </Btn>
              <Btn variant="outline" onClick={() => setEditing(null)}>
                Отмена
              </Btn>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
