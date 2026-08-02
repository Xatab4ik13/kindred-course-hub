import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, PageHeader, Panel, TextArea, TextInput, Toggle } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/my-profile")({ component: MyProfilePage });

function MyProfilePage() {
  const { session, teachers, setTeachers } = useAdmin();
  const me = teachers.find((t) => t.id === session?.teacherId);

  if (!me) {
    return (
      <>
        <PageHeader title="Мой профиль" />
        <Panel className="p-6 text-sm text-[oklch(0.55_0.03_45)]">Профиль преподавателя не найден.</Panel>
      </>
    );
  }

  const update = (patch: Partial<typeof me>) => setTeachers((p) => p.map((x) => (x.id === me.id ? { ...x, ...patch } : x)));

  return (
    <>
      <PageHeader title="Мой профиль" subtitle="Так вас видят посетители сайта в блоке «Наша команда»" />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel className="p-5">
          <img src={me.photo} alt={me.name} className="w-full rounded-2xl object-cover" />
          <Btn variant="outline" size="sm" className="mt-3 w-full" disabled>
            Заменить фото
          </Btn>
          <p className="mt-2 text-xs text-[oklch(0.6_0.03_45)]">Загрузка фото появится после подключения бекенда.</p>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-4">
            <Field label="Имя">
              <TextInput value={me.name} onChange={(e) => update({ name: e.target.value })} />
            </Field>
            <Field label="Специализация">
              <TextInput value={me.role} onChange={(e) => update({ role: e.target.value })} />
            </Field>
            <Field label="О себе">
              <TextArea className="min-h-28" value={me.bio} onChange={(e) => update({ bio: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <TextInput value={me.email} onChange={(e) => update({ email: e.target.value })} />
              </Field>
              <Field label="Телефон">
                <TextInput value={me.phone} onChange={(e) => update({ phone: e.target.value })} />
              </Field>
            </div>
            <Toggle checked={me.visible} label="Показывать меня на сайте" onChange={(v) => update({ visible: v })} />
          </div>
        </Panel>
      </div>
    </>
  );
}
