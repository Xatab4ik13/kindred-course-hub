import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Badge, Btn, Field, Modal, PageHeader, Panel, PhotoPicker, TextArea, TextInput, Toggle } from "@/components/admin/ui";
import type { Teacher } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/teachers")({ component: () => <AdminOnly><TeachersPage /></AdminOnly> });

type Draft = Teacher & { login: string; password: string };

const emptyDraft = (): Draft => ({
  id: "",
  name: "",
  initials: "",
  photo: "",
  role: "",
  bio: "",
  email: "",
  phone: "",
  visible: true,
  login: "",
  password: "",
});

function TeachersPage() {
  const { teachers, setTeachers, lessons, accounts, setAccounts, users, setUsers } = useAdmin();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openEdit = (t: Teacher) => {
    const acc = accounts.find((a) => a.teacherId === t.id);
    setIsNew(false);
    setDraft({ ...t, login: acc?.login ?? "", password: acc?.password ?? "" });
  };

  const openNew = () => {
    setIsNew(true);
    setDraft(emptyDraft());
  };

  const save = () => {
    if (!draft) return;
    const initials = draft.initials || draft.name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
    const id = isNew ? `t${Date.now()}` : draft.id;
    const teacher: Teacher = {
      id,
      name: draft.name,
      initials,
      photo: draft.photo,
      role: draft.role,
      bio: draft.bio,
      email: draft.email,
      phone: draft.phone,
      visible: draft.visible,
    };
    setTeachers((prev) => (isNew ? [...prev, teacher] : prev.map((x) => (x.id === id ? teacher : x))));

    if (draft.login) {
      setAccounts((prev) => {
        const exists = prev.some((a) => a.teacherId === id);
        const next = { login: draft.login, password: draft.password, role: "teacher" as const, name: draft.name, teacherId: id };
        return exists ? prev.map((a) => (a.teacherId === id ? next : a)) : [...prev, next];
      });
      setUsers((prev) => {
        const exists = prev.some((u) => u.login === draft.login || u.email === draft.email);
        if (exists) return prev.map((u) => (u.login === draft.login || u.email === draft.email ? { ...u, name: draft.name, email: draft.email, login: draft.login } : u));
        return [...prev, { id: `u${Date.now()}`, name: draft.name, email: draft.email, login: draft.login, role: "teacher", status: "active" }];
      });
    }
    setDraft(null);
  };

  const remove = (t: Teacher) => {
    setTeachers((prev) => prev.filter((x) => x.id !== t.id));
    setAccounts((prev) => prev.filter((a) => a.teacherId !== t.id));
  };

  return (
    <>
      <PageHeader
        title="Преподаватели"
        subtitle="Профили, доступы и нагрузка"
        action={
          <Btn onClick={openNew}>
            <Plus className="h-4 w-4" /> Добавить преподавателя
          </Btn>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {teachers.map((t) => {
          const mine = lessons.filter((l) => l.teacherId === t.id);
          const done = mine.filter((l) => l.status === "done").length;
          const cancelled = mine.filter((l) => l.status === "cancelled").length;
          const acc = accounts.find((a) => a.teacherId === t.id);
          return (
            <Panel key={t.id} className="p-5">
              <div className="flex gap-4">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.95_0.02_60)] font-display text-lg font-extrabold">
                    {t.initials}
                  </div>
                )}
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
                  <div className="mt-1 text-xs text-[oklch(0.55_0.03_45)]">{acc ? `Логин: ${acc.login}` : "Доступ не выдан"}</div>
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

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Btn size="sm" onClick={() => openEdit(t)}>
                  Редактировать профиль
                </Btn>
                <Link to="/admin/schedule" search={{}}>
                  <Btn size="sm" variant="outline">
                    <CalendarDays className="h-3.5 w-3.5" /> Расписание
                  </Btn>
                </Link>
                <Btn size="sm" variant="danger" onClick={() => remove(t)}>
                  <Trash2 className="h-3.5 w-3.5" /> Удалить
                </Btn>
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

      <Modal open={!!draft} onClose={() => setDraft(null)} title={isNew ? "Новый преподаватель" : "Профиль преподавателя"}>
        {draft ? (
          <div className="space-y-4">
            <PhotoPicker value={draft.photo} onChange={(photo) => setDraft({ ...draft, photo })} />
            <Field label="Имя">
              <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Специализация">
              <TextInput value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
            </Field>
            <Field label="О преподавателе">
              <TextArea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <TextInput value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </Field>
              <Field label="Телефон">
                <TextInput value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Логин" hint="Для входа в кабинет преподавателя">
                <TextInput value={draft.login} onChange={(e) => setDraft({ ...draft, login: e.target.value })} />
              </Field>
              <Field label="Пароль">
                <TextInput value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
              </Field>
            </div>
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
