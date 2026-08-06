import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Plus, Trash2 } from "lucide-react";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Badge, Btn, Field, Modal, PageHeader, Panel, Select, TextInput } from "@/components/admin/ui";
import type { Role } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/users")({ component: () => <AdminOnly superOnly><UsersPage /></AdminOnly> });

function UsersPage() {
  const { users, setUsers, saveAccount, deleteAccount } = useAdmin();
  const [inviting, setInviting] = useState(false);
  const [draft, setDraft] = useState<{ name: string; email: string; login: string; password: string; role: Role }>({
    name: "",
    email: "",
    login: "",
    password: "",
    role: "teacher",
  });

  return (
    <>
      <PageHeader
        title="Пользователи"
        subtitle="Права доступа и приглашения по почте"
        action={
          <Btn onClick={() => setInviting(true)}>
            <Plus className="h-4 w-4" /> Пригласить
          </Btn>
        }
      />

      <Panel className="p-5">
        <div className="divide-y divide-[oklch(0.94_0.01_60)]">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-[oklch(0.55_0.03_45)]">
                  {u.email} · логин: {u.login}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={u.status === "active" ? "green" : "amber"}>{u.status === "active" ? "Активен" : "Приглашён"}</Badge>
                <Select
                  className="w-44"
                  value={u.role}
                  onChange={(e) => {
                    const role = e.target.value as Role;
                    setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, role } : x)));
                    void saveAccount({ login: u.login, role, name: u.name }).catch(() => undefined);
                  }}
                >
                  <option value="admin">Администратор</option>
                  <option value="teacher">Преподаватель</option>
                </Select>
                <Btn variant="ghost" size="sm" className="text-[oklch(0.55_0.2_27)]" onClick={() => {
                    setUsers((p) => p.filter((x) => x.id !== u.id));
                    void deleteAccount(u.login).catch(() => undefined);
                  }}>
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Modal open={inviting} onClose={() => setInviting(false)} title="Приглашение по почте">
        <div className="space-y-4">
          <Field label="Имя">
            <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </Field>
          <Field label="Логин">
            <TextInput value={draft.login} onChange={(e) => setDraft({ ...draft, login: e.target.value })} />
          </Field>
          <Field label="Пароль" hint="Пароль для входа в панель">
            <TextInput value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
          </Field>
          <Field label="Роль" hint="Роль назначается заранее — приглашённый сразу получит нужные права">
            <Select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}>
              <option value="teacher">Преподаватель</option>
              <option value="admin">Администратор</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Btn
              disabled={!draft.login.trim() || !draft.password.trim() || !draft.name.trim()}
              onClick={() => {
                const { password, ...rest } = draft;
                setUsers((p) => [...p, { id: `u${Date.now()}`, ...rest, status: "active" }]);
                void saveAccount({ login: draft.login, password, role: draft.role, name: draft.name }).catch(() => undefined);
                setDraft({ name: "", email: "", login: "", password: "", role: "teacher" });
                setInviting(false);
              }}
            >
              <Mail className="h-4 w-4" /> Создать доступ
            </Btn>
            <Btn variant="outline" onClick={() => setInviting(false)}>
              Отмена
            </Btn>
          </div>
          <p className="text-xs text-[oklch(0.6_0.03_45)]">Логин и пароль передайте пользователю — он сразу сможет войти в панель.</p>
        </div>
      </Modal>
    </>
  );
}
