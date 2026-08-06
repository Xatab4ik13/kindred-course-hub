import { useI18n } from "@/providers/i18n";
import { usePublicContent } from "@/lib/public-content";

export function Footer() {
  const { t } = useI18n();
  const { org } = usePublicContent();
  return (
    <footer
      className="text-white/90 border-t border-white/10"
      style={{ background: "oklch(0.17 0.04 28)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white font-hanzi text-lg font-bold">
              中
            </span>
            <span className="font-display text-xl font-extrabold text-white">CHINAR</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">{t("hero.subtitle")}</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2 text-white">{t("nav.contacts")}</div>
          <div className="text-white/60 space-y-1">
            {org.email && <div>{org.email}</div>}
            {org.phone && <div>{org.phone}</div>}
            {org.address && <div>{org.address}</div>}
            {org.vk && (
              <div>
                <a href={org.vk} target="_blank" rel="noreferrer" className="hover:text-white">
                  ВКонтакте
                </a>
              </div>
            )}
            {org.telegram && (
              <div>
                <a
                  href={
                    org.telegram.startsWith("http")
                      ? org.telegram
                      : `https://t.me/${org.telegram.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  Telegram
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2 text-white">{t("footer.legal")}</div>
          <div className="text-white/60 space-y-1">
            {org.legalName && <div>{org.legalName}</div>}
            {org.inn && <div>ИНН {org.inn}</div>}
            {org.ogrn && <div>ОГРН {org.ogrn}</div>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} CHINAR. {t("footer.rights")}.
      </div>
    </footer>
  );
}
