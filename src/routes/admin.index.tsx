import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useAdmin } from "@/components/admin/store";
import { Badge, Bar, Btn, PageHeader, Panel, Stat } from "@/components/admin/ui";
import { REQUEST_STATUS_LABEL } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { session, requests, lessons, teachers } = useAdmin();
  const isAdmin = session?.role === "admin";

  const myLessons = useMemo(
    () => (isAdmin ? lessons : lessons.filter((l) => l.teacherId === session?.teacherId)),
    [lessons, isAdmin, session],
  );

  const done = myLessons.filter((l) => l.status === "done").length;
  const cancelled = myLessons.filter((l) => l.status === "cancelled").length;
  const planned = myLessons.filter((l) => l.status === "planned").length;
  const finished = done + cancelled;
  const donePct = finished ? Math.round((done / finished) * 100) : 0;

  const newRequests = requests.filter((r) => r.status === "new").length;
  const enrolled = requests.filter((r) => r.status === "enrolled").length;
  const conv = requests.length ? Math.round((enrolled / requests.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={isAdmin ? "Дашборд" : `Здравствуйте, ${session?.name ?? ""}`}
        subtitle={isAdmin ? "Краткая сводка по школе" : "Ваши занятия и расписание"}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isAdmin ? (
          <>
            <Stat label="Заявок всего" value={requests.length} hint="за последние 14 дней" />
            <Stat label="Новых заявок" value={newRequests} tone="brand" hint="требуют обработки" />
            <Stat label="Конверсия в запись" value={`${conv}%`} tone="green" hint={`${enrolled} записано`} />
            <Stat label="Преподавателей" value={teachers.length} hint="активных профилей" />
          </>
        ) : (
          <>
            <Stat label="Запланировано" value={planned} tone="brand" />
            <Stat label="Проведено" value={done} tone="green" />
            <Stat label="Отменено" value={cancelled} tone="red" />
            <Stat label="Доля проведённых" value={`${donePct}%`} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Занятия</h2>
            <Link to={isAdmin ? "/admin/lessons" : "/admin/my-lessons"}>
              <Btn variant="ghost" size="sm">
                Подробнее <ArrowRight className="h-3.5 w-3.5" />
              </Btn>
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Проведено</span>
                <span className="font-semibold">{done}</span>
              </div>
              <Bar value={donePct} tone="green" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Отменено</span>
                <span className="font-semibold">{cancelled}</span>
              </div>
              <Bar value={100 - donePct} tone="red" />
            </div>
          </div>
        </Panel>

        {isAdmin ? (
          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold">Последние заявки</h2>
              <Link to="/admin/requests">
                <Btn variant="ghost" size="sm">
                  Все заявки <ArrowRight className="h-3.5 w-3.5" />
                </Btn>
              </Link>
            </div>
            <div className="mt-4 divide-y divide-[oklch(0.93_0.01_60)]">
              {requests.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{r.name}</div>
                    <div className="truncate text-xs text-[oklch(0.55_0.03_45)]">{r.program}</div>
                  </div>
                  <Badge tone={r.status === "new" ? "brand" : r.status === "enrolled" ? "green" : r.status === "declined" ? "red" : "amber"}>
                    {REQUEST_STATUS_LABEL[r.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        ) : (
          <Panel className="p-6">
            <h2 className="font-display text-lg font-extrabold">Ближайшие занятия</h2>
            <div className="mt-4 divide-y divide-[oklch(0.93_0.01_60)]">
              {myLessons
                .filter((l) => l.status === "planned")
                .slice(0, 5)
                .map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {l.level} · {l.group}
                      </div>
                      <div className="text-xs text-[oklch(0.55_0.03_45)]">
                        {l.date} · {l.time}
                      </div>
                    </div>
                    <Badge>Запланировано</Badge>
                  </div>
                ))}
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}
