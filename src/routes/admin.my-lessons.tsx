import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/components/admin/store";
import { Badge, Btn, Field, Modal, PageHeader, Panel, Select, Stat, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/my-lessons")({ component: MyLessonsPage });

const REASONS = ["Болезнь преподавателя", "Отмена по просьбе группы", "Технические проблемы", "Праздничный день", "Другое"];

function MyLessonsPage() {
  const { session, lessons, setLessons } = useAdmin();
  const teacherId = session?.teacherId;
  const mine = lessons.filter((l) => l.teacherId === teacherId);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reason, setReason] = useState(REASONS[0]!);
  const [custom, setCustom] = useState("");

  const done = mine.filter((l) => l.status === "done").length;
  const cancelled = mine.filter((l) => l.status === "cancelled").length;

  return (
    <>
      <PageHeader title="Мои занятия" subtitle="Отмечайте проведённые и отменённые занятия — статистика уходит администратору" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Всего" value={mine.length} />
        <Stat label="Проведено" value={done} tone="green" />
        <Stat label="Отменено" value={cancelled} tone="red" />
      </div>

      <Panel className="mt-6 p-5">
        <div className="divide-y divide-[oklch(0.94_0.01_60)]">
          {mine
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((l) => (
              <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">
                    {l.date} · {l.time} · {l.level} {l.group}
                  </div>
                  {l.cancelReason ? <div className="text-xs text-[oklch(0.55_0.2_27)]">Причина: {l.cancelReason}</div> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={l.status === "done" ? "green" : l.status === "cancelled" ? "red" : "brand"}>
                    {l.status === "done" ? "Проведено" : l.status === "cancelled" ? "Отменено" : "План"}
                  </Badge>
                  <Btn
                    size="sm"
                    variant={l.status === "done" ? "primary" : "outline"}
                    onClick={() =>
                      setLessons((p) => p.map((x) => (x.id === l.id ? { ...x, status: "done", cancelReason: undefined } : x)))
                    }
                  >
                    Проведено
                  </Btn>
                  <Btn size="sm" variant="outline" onClick={() => setCancelId(l.id)}>
                    Отменено
                  </Btn>
                </div>
              </div>
            ))}
          {mine.length === 0 ? <div className="py-10 text-center text-sm text-[oklch(0.6_0.03_45)]">Занятий пока нет</div> : null}
        </div>
      </Panel>

      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Причина отмены">
        <div className="space-y-4">
          <Field label="Причина">
            <Select value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          {reason === "Другое" ? (
            <Field label="Уточните">
              <TextInput value={custom} onChange={(e) => setCustom(e.target.value)} />
            </Field>
          ) : null}
          <div className="flex gap-2">
            <Btn
              onClick={() => {
                const text = reason === "Другое" ? custom || "Другое" : reason;
                setLessons((p) => p.map((x) => (x.id === cancelId ? { ...x, status: "cancelled", cancelReason: text } : x)));
                setCancelId(null);
                setCustom("");
              }}
            >
              Сохранить
            </Btn>
            <Btn variant="outline" onClick={() => setCancelId(null)}>
              Отмена
            </Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}
