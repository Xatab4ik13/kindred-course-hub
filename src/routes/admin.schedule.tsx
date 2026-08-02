import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Badge, Btn, Field, Modal, PageHeader, Panel, Select, TextInput } from "@/components/admin/ui";
import type { Lesson } from "@/lib/admin-data";
import { dateKey } from "@/lib/schedule-view";

export const Route = createFileRoute("/admin/schedule")({ component: () => <AdminOnly><SchedulePage /></AdminOnly> });

const DAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function ScheduleBoard({ teacherId, canEdit }: { teacherId: string | "all"; canEdit: boolean }) {
  const { lessons, setLessons, teachers } = useAdmin();
  const [weekOffset, setWeekOffset] = useState(0);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Lesson, "id">>({
    teacherId: teacherId === "all" ? (teachers[0]?.id ?? "t1") : teacherId,
    group: "№040",
    level: "HSK 1",
    date: dateKey(new Date()),
    time: "18:00",
    duration: 90,
    status: "planned",
  });


  const days = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const visible = lessons.filter((l) => teacherId === "all" || l.teacherId === teacherId);

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Btn variant="outline" size="sm" onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} disabled={weekOffset === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Btn>
          <span className="text-sm font-semibold">{weekOffset === 0 ? "Текущая неделя" : "Следующая неделя"}</span>
          <Btn variant="outline" size="sm" onClick={() => setWeekOffset((w) => Math.min(1, w + 1))} disabled={weekOffset === 1}>
            <ChevronRight className="h-4 w-4" />
          </Btn>
        </div>
        {canEdit ? (
          <Btn size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Добавить занятие
          </Btn>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const items = visible.filter((l) => l.date === key).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={key} className="rounded-2xl border border-[oklch(0.92_0.02_60)] p-3">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-sm font-extrabold">{DAY_SHORT[d.getDay()]}</span>
                <span className="text-xs text-[oklch(0.6_0.03_45)]">{d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</span>
              </div>
              <div className="space-y-2">
                {items.map((l) => {
                  const teacher = teachers.find((t) => t.id === l.teacherId);
                  return (
                    <div key={l.id} className="rounded-xl bg-[oklch(0.97_0.015_60)] p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{l.time}</span>
                        <Badge tone={l.status === "done" ? "green" : l.status === "cancelled" ? "red" : "brand"}>
                          {l.status === "done" ? "Проведено" : l.status === "cancelled" ? "Отменено" : "План"}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-[oklch(0.45_0.03_45)]">
                        {l.level} · {l.group}
                      </div>
                      {teacherId === "all" && teacher ? (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[oklch(0.55_0.03_45)]">
                          <img src={teacher.photo} alt="" className="h-5 w-5 rounded-full object-cover" />
                          {teacher.name}
                        </div>
                      ) : null}
                      {canEdit ? (
                        <Btn
                          variant="ghost"
                          size="sm"
                          className="mt-1 px-2 text-[oklch(0.55_0.2_27)]"
                          onClick={() => setLessons((prev) => prev.filter((x) => x.id !== l.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Удалить
                        </Btn>
                      ) : null}
                    </div>
                  );
                })}
                {items.length === 0 ? <div className="py-4 text-center text-xs text-[oklch(0.65_0.03_45)]">Нет занятий</div> : null}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Новое занятие">
        <div className="space-y-4">
          {teacherId === "all" ? (
            <Field label="Преподаватель">
              <Select value={draft.teacherId} onChange={(e) => setDraft({ ...draft, teacherId: e.target.value })}>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Дата">
              <TextInput type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label="Время">
              <TextInput type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
            </Field>
            <Field label="Уровень">
              <TextInput value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })} />
            </Field>
            <Field label="Группа">
              <TextInput value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })} />
            </Field>
          </div>
          <div className="flex gap-2">
            <Btn
              onClick={() => {
                setLessons((prev) => [...prev, { ...draft, id: `l${Date.now()}` }]);
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
    </Panel>
  );
}

function SchedulePage() {
  const { teachers } = useAdmin();
  const [teacherId, setTeacherId] = useState<string>("all");

  return (
    <>
      <PageHeader title="Расписание" subtitle="Две недели вперёд, с фильтром по преподавателю" />

      <Panel className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Btn size="sm" variant={teacherId === "all" ? "primary" : "outline"} onClick={() => setTeacherId("all")}>
            Все преподаватели
          </Btn>
          {teachers.map((t) => (
            <Btn key={t.id} size="sm" variant={teacherId === t.id ? "primary" : "outline"} onClick={() => setTeacherId(t.id)}>
              <img src={t.photo} alt="" className="h-5 w-5 rounded-full object-cover" />
              {t.name}
            </Btn>
          ))}
        </div>
      </Panel>

      <ScheduleBoard teacherId={teacherId} canEdit />
    </>
  );
}
