import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Btn, Field, PageHeader, Panel, TextArea, TextInput, Toggle } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/leadership")({ component: () => <AdminOnly><LeadershipPage /></AdminOnly> });

function LeadershipPage() {
  const { leaders, setLeaders } = useAdmin();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <PageHeader title="Руководство" subtitle="Блок «Наша команда → Руководство» на главной странице. Фотографии сохранены." />

      <div className="grid gap-4 md:grid-cols-3">
        {leaders.map((l) => (
          <Panel key={l.id} className="p-5">
            <img src={l.photo} alt={l.name} className="h-40 w-full rounded-2xl object-cover" />
            <div className="mt-4 space-y-3">
              {openId === l.id ? (
                <>
                  <Field label="Имя">
                    <TextInput value={l.name} onChange={(e) => setLeaders((p) => p.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)))} />
                  </Field>
                  <Field label="Должность">
                    <TextInput value={l.role} onChange={(e) => setLeaders((p) => p.map((x) => (x.id === l.id ? { ...x, role: e.target.value } : x)))} />
                  </Field>
                  <Field label="Описание">
                    <TextArea value={l.bio} onChange={(e) => setLeaders((p) => p.map((x) => (x.id === l.id ? { ...x, bio: e.target.value } : x)))} />
                  </Field>
                  <Btn size="sm" onClick={() => setOpenId(null)}>
                    Готово
                  </Btn>
                </>
              ) : (
                <>
                  <div className="font-display text-lg font-extrabold">{l.name}</div>
                  <div className="text-sm text-[oklch(0.5_0.03_45)]">{l.role}</div>
                  <p className="text-sm text-[oklch(0.4_0.03_45)]">{l.bio}</p>
                  <Btn size="sm" variant="outline" onClick={() => setOpenId(l.id)}>
                    Редактировать
                  </Btn>
                </>
              )}
              <Toggle
                checked={l.visible}
                label="Показывать на сайте"
                onChange={(v) => setLeaders((p) => p.map((x) => (x.id === l.id ? { ...x, visible: v } : x)))}
              />
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
