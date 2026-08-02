import { createFileRoute } from "@tanstack/react-router";
import { AdminOnly } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/store";
import { Field, PageHeader, Panel, TextInput } from "@/components/admin/ui";
import type { OrgInfo } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/settings")({ component: () => <AdminOnly><SettingsPage /></AdminOnly> });

const CONTACT_FIELDS: { key: keyof OrgInfo; label: string }[] = [
  { key: "phone", label: "Телефон" },
  { key: "email", label: "Почта" },
  { key: "address", label: "Адрес" },
  { key: "vk", label: "ВКонтакте" },
  { key: "telegram", label: "Telegram" },
];

const LEGAL_FIELDS: { key: keyof OrgInfo; label: string }[] = [
  { key: "legalName", label: "Юридическое наименование" },
  { key: "inn", label: "ИНН" },
  { key: "ogrn", label: "ОГРН" },
  { key: "bank", label: "Банк" },
  { key: "account", label: "Расчётный счёт" },
];

function SettingsPage() {
  const { org, setOrg } = useAdmin();

  return (
    <>
      <PageHeader title="Контакты и реквизиты" subtitle="Эти данные отображаются в шапке, подвале и на странице контактов" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <h2 className="font-display text-lg font-extrabold">Контактные данные</h2>
          <div className="mt-4 space-y-4">
            {CONTACT_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <TextInput value={org[f.key]} onChange={(e) => setOrg({ ...org, [f.key]: e.target.value })} />
              </Field>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="font-display text-lg font-extrabold">Юридическая информация</h2>
          <div className="mt-4 space-y-4">
            {LEGAL_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <TextInput value={org[f.key]} onChange={(e) => setOrg({ ...org, [f.key]: e.target.value })} />
              </Field>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
