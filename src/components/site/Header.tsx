import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import { LocaleSwitch } from "./LocaleSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";

// Chưa có MegaMenu và ô tìm kiếm: cần cây IA (trụ cột, nhóm link L2) đã duyệt trước khi dựng.
export function Header({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const links = [
    { href: `/${locale}#solutions`, label: t.nav.solutions },
    { href: `/${locale}#industries`, label: t.nav.industries },
    { href: `/${locale}/insights`, label: t.nav.insights },
    { href: `/${locale}#about`, label: t.nav.about },
  ];
  const contact = { href: `/${locale}#contact`, label: t.nav.contact };
  const homeHref = `/${locale}`;
  return (
    <>
      <div className="on-band bg-band-2 text-on-band-muted">
        <div className="container-x flex justify-end py-[7px]">
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
              links={links}
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
