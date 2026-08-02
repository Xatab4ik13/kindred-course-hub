import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Badge, Btn, Field, PageHeader, Panel, Select, Stat, TextArea, TextInput } from "@/components/admin/ui";
import { REQUEST_STATUS_LABEL, type RequestStatus } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/requests")({ component: () => <AdminOnly><RequestsPage /></AdminOnly> });

const STATUSES: RequestStatus[] = ["new", "progress", "enrolled", "declined"];

function RequestsPage() {
  const { requests, setRequests } = useAdmin();
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      requests.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          (q.trim() === "" || `${r.name} ${r.phone} ${r.program}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [requests, filter, q],
  );

  const counts = STATUSES.map((s) => ({ s, n: requests.filter((r) => r.status === s).length }));

  return (
    <>
      <PageHeader title="Заявки" subtitle="Обработка заявок с сайта, VK и по телефону" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map(({ s, n }) => (
          <Stat
            key={s}
            label={REQUEST_STATUS_LABEL[s]}
            value={n}
            hint={`${requests.length ? Math.round((n / requests.length) * 100) : 0}% от всех`}
            tone={s === "new" ? "brand" : s === "enrolled" ? "green" : s === "declined" ? "red" : "neutral"}
          />
        ))}
      </div>

      <Panel className="mt-6 p-5">
        <div className="flex flex-wrap gap-3">
          <TextInput className="max-w-xs" placeholder="Поиск по имени, телефону, программе" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select className="max-w-48" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">Все статусы</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {REQUEST_STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-5 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[oklch(0.92_0.02_60)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-[oklch(0.5_0.03_45)]">
                    {r.phone} · {r.program}
                  </div>
                  <div className="mt-1 text-xs text-[oklch(0.6_0.03_45)]">
                    {r.createdAt} · источник: {r.source}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={r.status === "new" ? "brand" : r.status === "enrolled" ? "green" : r.status === "declined" ? "red" : "amber"}>
                    {REQUEST_STATUS_LABEL[r.status]}
                  </Badge>
                  <Select
                    className="w-40"
                    value={r.status}
                    onChange={(e) =>
                      setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: e.target.value as RequestStatus } : x)))
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {REQUEST_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="mt-3">
                <Field label="Комментарий">
                  <TextArea
                    className="min-h-16"
                    value={r.comment ?? ""}
                    placeholder="Заметка менеджера"
                    onChange={(e) => setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, comment: e.target.value } : x)))}
                  />
                </Field>
              </div>
            </div>
          ))}
          {rows.length === 0 ? <div className="py-10 text-center text-sm text-[oklch(0.55_0.03_45)]">Заявок не найдено</div> : null}
        </div>

        <div className="mt-4 text-xs text-[oklch(0.6_0.03_45)]">
          Данные демонстрационные: изменения не сохраняются до подключения бекенда.
        </div>
        <Btn variant="outline" size="sm" className="mt-3" onClick={() => setRequests((p) => [...p])}>
          Обновить
        </Btn>
      </Panel>
    </>
  );
}
