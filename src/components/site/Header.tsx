import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import { mainNav, utilityNav } from "@/content/site";
import { LocaleSwitch } from "./LocaleSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";

// Header bản C: thanh tiện ích + thanh chính (logo, 7 mục, Contact). Mục chưa có trang bị ẩn (xem content/site.ts).
// Chưa có MegaMenu (cần cây IA đã duyệt và các trang L1) và ô tìm kiếm (chưa có chức năng tìm).
export function Header({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const links = mainNav(locale);
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
          <nav className="hidden flex-1 items-stretch gap-0.5 min-[1100px]:flex" aria-label={t.a11y.mainNav}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-[var(--header-height)] items-center whitespace-nowrap border-b-[3px] border-transparent px-[11px] text-[14.5px] font-semibold leading-5 text-ink transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex flex-none items-center gap-2.5">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href={contact.href}>{contact.label}</Link>
            </Button>
            <MobileMenu
              homeHref={homeHref}
              links={[...links, ...utility]}
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
