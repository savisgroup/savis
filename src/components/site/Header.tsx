import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import { utilityNav } from "@/content/site";
import { mobileSections } from "@/content/navigation";
import { LocaleSwitch } from "./LocaleSwitch";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";

// Header bản C: thanh tiện ích + thanh chính (logo, mega menu 8 mục theo sitemap V3, Contact).
// Chưa có ô tìm kiếm (chưa có chức năng tìm). Mục tiện ích chưa có trang bị ẩn (xem content/site.ts).
export function Header({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const utility = utilityNav(locale);
  const contact = { href: `/${locale}#contact`, label: t.nav.contact };
  const homeHref = `/${locale}`;
  return (
    <>
      <div className="on-band bg-band-2 text-[13px] leading-[18px] text-on-band-muted">
        <div className="container-x flex flex-wrap items-center justify-end gap-x-[22px] gap-y-1 py-[7px]">
          {utility.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors duration-[var(--motion-fast)] hover:text-on-band">{l.label}</Link>
          ))}
          <LocaleSwitch current={locale} label={t.a11y.language} onBand />
        </div>
      </div>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b border-line bg-background text-ink">
        <div className="container-x flex min-h-[var(--header-height)] items-center gap-5">
          <Logo href={homeHref} label={t.a11y.home} />
          <MegaMenu locale={locale} label={t.a11y.mainNav} />
          <div className="ml-auto flex flex-none items-center gap-2.5">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href={contact.href}>{contact.label}</Link>
            </Button>
            <MobileMenu
              homeHref={homeHref}
              sections={mobileSections(locale)}
              links={utility}
              contact={contact}
              labels={{ open: t.a11y.openMenu, close: t.a11y.closeMenu, title: t.a11y.mobileMenu, home: t.a11y.home }}
              footer={<LocaleSwitch current={locale} label={t.a11y.language} />}
            />
          </div>
        </div>
      </header>
    </>
  );
}
