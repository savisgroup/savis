import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import {
  HOTLINE, certifications, footerCompany, footerCopy, footerIndustries, footerPillars, offices, type FooterLink,
} from "@/content/site";
import { Logo } from "./Logo";

const linkClass = "transition-colors duration-[var(--motion-fast)] hover:text-on-band";
const listClass = "flex flex-col gap-2 text-sm leading-[21px]";

// Footer theo sitemap V3 mục 2.3: cột thương hiệu, Solutions & Products, Industries, Global offices, Company, dòng bản quyền.
// Mục chưa có trang hiện dạng chữ thường, không phải link (giữ nguyên độ tương phản trên nền navy).
export function Footer({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const c = footerCopy[locale];
  return (
    <footer className="on-band bg-band-2 pb-6 pt-16 text-on-band-muted">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 min-[768px]:grid-cols-3 min-[1100px]:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 flex min-w-0 flex-col gap-4 min-[768px]:col-span-3 min-[1100px]:col-span-1">
            <Logo href={`/${locale}`} label={t.a11y.home} onBand className="text-on-band" />
            <p className="max-w-xs text-[15px] leading-[23px]">{t.footer.tagline}</p>
          </div>
          <LinkColumn heading={c.solutions} links={footerPillars(locale)} />
          <LinkColumn heading={c.industries} links={footerIndustries(locale)} />
          <div>
            <FooterHeading>{c.offices}</FooterHeading>
            <ul className={listClass}>
              {offices.map((o) => (
                <li key={o.name.en}>{o.name[locale]}{o.hq ? ` · ${c.hq}` : ""}</li>
              ))}
            </ul>
          </div>
          <LinkColumn heading={c.company} links={footerCompany(locale)} />
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-[13px] leading-5">
          <span>
            © {new Date().getFullYear()} SAVIS Group · {c.regions} · {c.hotline}{" "}
            <a className={linkClass} href={`tel:${HOTLINE.tel}`}>{HOTLINE.display}</a>
          </span>
          <span>{certifications.join(" · ")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[12.5px] font-semibold uppercase leading-4 tracking-[0.14em] text-on-band">{children}</h2>;
}

function LinkColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div className="min-w-0">
      <FooterHeading>{heading}</FooterHeading>
      <ul className={listClass}>
        {links.map((l) => (
          <li key={l.label}>
            {l.href ? <Link className={linkClass} href={l.href}>{l.label}</Link> : <span>{l.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
