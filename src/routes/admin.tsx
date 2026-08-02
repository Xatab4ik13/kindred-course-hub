import { createFileRoute } from "@tanstack/react-router";
import { AdminProvider } from "@/components/admin/store";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Панель управления — CHINAR" },
      { name: "description", content: "Административная панель школы китайского языка CHINAR." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Панель управления — CHINAR" },
      { property: "og:description", content: "Управление заявками, расписанием и контентом сайта CHINAR." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}
