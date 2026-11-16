import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dict, type Locale } from "@/lib/i18n";
import type { PageData } from "@/content/pages/types";

// Hero trang cấp 2: nền navy, breadcrumb, eyebrow, H1, lead và tối đa vài nút. Chuyển động vào dùng chung với hero trang chủ.
export function PageHero({ locale, hero }: { locale: Locale; hero: PageData["hero"] }) {
  const t = dict[locale];
  return (
    <section className="on-band overflow-hidden bg-[radial-gradient(circle_at_78%_30%,#13306f_0%,var(--band)_38%,var(--band-2)_100%)] pb-[88px] pt-14 text-on-band">
      <div className="container-x">
        <div className="hero-copy flex max-w-[860px] flex-col gap-[22px]">
          <nav aria-label={t.a11y.breadcrumb} className="flex flex-wrap gap-2 text-[13.5px] font-medium leading-5 text-on-band-muted">
            <Link href={`/${locale}`} className="hover:text-on-band hover:underline">{t.insights.home}</Link>
            <span aria-hidden>/</span>
            {hero.trail?.map((c) => (
              <span key={c.label} className="contents">
                {c.href ? <Link href={`/${locale}${c.href}`} className="hover:text-on-band hover:underline">{c.label}</Link> : <span>{c.label}</span>}
                <span aria-hidden>/</span>
              </span>
            ))}
            <span aria-current="page">{hero.crumb}</span>
          </nav>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="text-balance text-[clamp(34px,4vw,54px)] font-bold leading-[1.08] tracking-[-0.025em] text-on-band">{hero.title}</h1>
          <p className="max-w-[720px] text-[19px] leading-[30px] text-on-band-muted">{hero.lead}</p>
          {hero.buttons.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {hero.buttons.map((b) => (
                <Button key={b.label} asChild variant={b.ghost ? "onBand" : "primary"}><Link href={`/${locale}${b.href}`}>{b.label}</Link></Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
