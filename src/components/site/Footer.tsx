import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import { HOTLINE, footerCompany, footerCopy, footerPillars, offices, type NavLink } from "@/content/site";
import { Logo } from "./Logo";

const linkClass = "transition-colors duration-[var(--motion-fast)] hover:text-on-band";

// Footer bản C: cột thương hiệu, 3 cột liên kết (Giải pháp, Công ty, Văn phòng) và dòng bản quyền.
// Chưa có form bản tin (chưa có backend) và liên kết pháp lý (chưa có trang/nội dung duyệt).
export function Footer({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const c = footerCopy[locale];
  return (
    <footer className="on-band bg-band-2 pb-6 pt-16 text-on-band-muted">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_repeat(auto-fit,minmax(150px,1fr))]">
          <div className="flex min-w-0 flex-col gap-4">
            <Logo href={`/${locale}`} label={t.a11y.home} onBand className="text-on-band" />
            <p className="max-w-xs text-[15px] leading-[23px]">{t.footer.tagline}</p>
          </div>
          <LinkColumn heading={c.solutions} links={footerPillars(locale)} />
          <LinkColumn heading={c.company} links={footerCompany(locale, t.nav.contact)} />
          <div>
            <FooterHeading>{c.offices}</FooterHeading>
            <ul className="flex flex-col gap-2 text-sm leading-[21px]">
              {offices.map((o) => (
                <li key={o.city}>
                  {o.city}{o.hq ? ` · ${c.hq}` : ""}{o.detail ? `: ${o.detail}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-[13px] leading-5">
          <span>
            © {new Date().getFullYear()} SAVIS Group · {c.regions} · {c.hotline}{" "}
            <a className={linkClass} href={`tel:${HOTLINE.tel}`}>{HOTLINE.display}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[12.5px] font-semibold uppercase leading-4 tracking-[0.14em] text-on-band">{children}</h2>;
}

function LinkColumn({ heading, links }: { heading: string; links: NavLink[] }) {
  return (
    <div>
      <FooterHeading>{heading}</FooterHeading>
      <ul className="flex flex-col gap-2 text-sm leading-[21px]">
        {links.map((l) => (
          <li key={`${l.href}-${l.label}`}><Link className={linkClass} href={l.href}>{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
