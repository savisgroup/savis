import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

// Chưa có cột trụ cột giải pháp, văn phòng, pháp lý, bản tin: cần nội dung thật (design system cấm giá trị giữ chỗ).
export function Footer({ locale }: { locale: Locale }) {
  const t = dict[locale];
  return (
    <footer className="on-band bg-band-2 pt-16 pb-6 text-on-band-muted">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="flex min-w-0 flex-col gap-4">
            <Logo href={`/${locale}`} label={t.a11y.home} onBand className="text-on-band" />
            <p className="max-w-xs text-[15px] leading-[23px]">{t.footer.tagline}</p>
          </div>
          <ul className="flex flex-col gap-2 text-sm leading-[21px]">
            <li><Link className="transition-colors duration-[var(--motion-fast)] hover:text-on-band" href={`/${locale}/insights`}>{t.nav.insights}</Link></li>
            <li><Link className="transition-colors duration-[var(--motion-fast)] hover:text-on-band" href={`/${locale}#about`}>{t.nav.about}</Link></li>
          </ul>
        </div>
        <p className="mt-12 border-t border-white/15 pt-6 text-[13px] leading-5">© {new Date().getFullYear()} SAVIS Group</p>
      </div>
    </footer>
  );
}
