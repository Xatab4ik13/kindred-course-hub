import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/components/admin/store";
import { PageHeader } from "@/components/admin/ui";
import { ScheduleBoard } from "@/routes/admin.schedule";

export const Route = createFileRoute("/admin/my-schedule")({ component: MySchedulePage });

function MySchedulePage() {
  const { session } = useAdmin();
  const teacherId = session?.teacherId ?? "all";

  return (
    <>
      <PageHeader title="Моё расписание" subtitle="Вы можете редактировать только собственные занятия" />
      <ScheduleBoard teacherId={teacherId} canEdit />
    </>
  );
}
