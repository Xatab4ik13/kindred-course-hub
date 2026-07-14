import { useI18n } from "@/providers/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#0d0d0d] text-neutral-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-brand-foreground font-hanzi text-lg font-bold">
              中
            </span>
            <span className="font-display text-xl font-extrabold text-white">CHINAR</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-neutral-400">
            {t("hero.subtitle")}
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2 text-white">{t("nav.contacts")}</div>
          <div className="text-neutral-400 space-y-1">
            <div>hello@chinar.school</div>
            <div>+7 (000) 000-00-00</div>
            <div>Москва, ул. Пекинская, 1</div>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2 text-white">{t("footer.legal")}</div>
          <div className="text-neutral-400 space-y-1">
            <div>ООО «Чинар»</div>
            <div>ИНН 0000000000</div>
            <div>ОГРН 0000000000000</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} CHINAR. {t("footer.rights")}.
      </div>
    </footer>
  );
}
