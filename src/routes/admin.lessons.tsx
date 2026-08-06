import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Badge, Bar, PageHeader, Panel, Select, Stat } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/lessons")({ component: () => <AdminOnly roles={["admin", "manager"]}><LessonStatsPage /></AdminOnly> });

function LessonStatsPage() {
  const { lessons, teachers } = useAdmin();
  const [teacherId, setTeacherId] = useState("all");

  const rows = useMemo(() => lessons.filter((l) => teacherId === "all" || l.teacherId === teacherId), [lessons, teacherId]);
  const done = rows.filter((l) => l.status === "done").length;
  const cancelled = rows.filter((l) => l.status === "cancelled").length;
  const planned = rows.filter((l) => l.status === "planned").length;
  const finished = done + cancelled;
  const pct = (n: number) => (finished ? Math.round((n / finished) * 100) : 0);

  const reasons = useMemo(() => {
    const map = new Map<string, number>();
    rows.filter((l) => l.status === "cancelled").forEach((l) => map.set(l.cancelReason ?? "Без причины", (map.get(l.cancelReason ?? "Без причины") ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <>
      <PageHeader title="Статистика занятий" subtitle="Проведённые и отменённые занятия с причинами отмены" />

      <Panel className="mb-4 p-4">
        <Select className="max-w-xs" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          <option value="all">Все преподаватели</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Всего занятий" value={rows.length} />
        <Stat label="Проведено" value={`${done} · ${pct(done)}%`} tone="green" />
        <Stat label="Отменено" value={`${cancelled} · ${pct(cancelled)}%`} tone="red" />
        <Stat label="Запланировано" value={planned} tone="brand" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <h2 className="font-display text-lg font-extrabold">Соотношение</h2>
          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Проведено</span>
                <span className="font-semibold">{pct(done)}%</span>
              </div>
              <Bar value={pct(done)} tone="green" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Отменено</span>
                <span className="font-semibold">{pct(cancelled)}%</span>
              </div>
              <Bar value={pct(cancelled)} tone="red" />
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="font-display text-lg font-extrabold">Причины отмен</h2>
          <div className="mt-4 space-y-3">
            {reasons.map(([reason, n]) => (
              <div key={reason}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="truncate pr-3">{reason}</span>
                  <span className="font-semibold">{n}</span>
                </div>
                <Bar value={cancelled ? (n / cancelled) * 100 : 0} />
              </div>
            ))}
            {reasons.length === 0 ? <div className="py-6 text-center text-sm text-[oklch(0.6_0.03_45)]">Отменённых занятий нет</div> : null}
          </div>
        </Panel>
      </div>

      <Panel className="mt-6 p-5">
        <h2 className="font-display text-lg font-extrabold">Журнал занятий</h2>
        <div className="mt-4 divide-y divide-[oklch(0.94_0.01_60)]">
          {rows
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30)
            .map((l) => {
              const teacher = teachers.find((t) => t.id === l.teacherId);
              return (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      {l.date} · {l.time} · {l.level} {l.group}
                    </div>
                    <div className="text-xs text-[oklch(0.55_0.03_45)]">
                      {teacher?.name}
                      {l.cancelReason ? ` · причина: ${l.cancelReason}` : ""}
                    </div>
                  </div>
                  <Badge tone={l.status === "done" ? "green" : l.status === "cancelled" ? "red" : "brand"}>
                    {l.status === "done" ? "Проведено" : l.status === "cancelled" ? "Отменено" : "План"}
                  </Badge>
                </div>
              );
            })}
        </div>
      </Panel>
    </>
  );
}
