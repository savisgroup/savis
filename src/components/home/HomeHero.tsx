import { Fragment } from "react";
import Link from "next/link";
import { Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/content/home";
import { CountUp } from "./CountUp";
import { HeroCarousel } from "./HeroCarousel";
import { HeroSigningPhone } from "./HeroSigningPhone";

type Hero = HomeContent["hero"];
type Props = { locale: string; content: Hero; stats: HomeContent["stats"] };

const titleClass = "text-balance text-[clamp(34px,4vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] text-on-band";
const subClass = "text-[clamp(17px,1.5vw,20px)] italic leading-normal text-on-band-muted";
const copyClass = "flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]";
const chipClass = "rounded-full bg-chip-on-band px-3 py-1 text-xs font-semibold tracking-wide text-chip-on-band-ink";

// TẠM THỜI: chỉ hiện banner đầu (thông điệp chính). Đặt false để bật lại cả 3 banner luân phiên.
const SINGLE_SLIDE_ONLY = true;

// Hero phương án C: 3 banner luân phiên (thông điệp chính, eGov Super App, TrustCA) và dải số liệu ở đáy.
// Chỉ banner đầu dùng <h1>; hai banner sau dùng <h2> cùng kiểu chữ để trang có đúng một h1.
export function HomeHero({ locale, content: c, stats }: Props) {
  const cta = (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <Button asChild><Link href={`/${locale}#solutions`}>{c.primary}</Link></Button>
      <Button asChild variant="onBand"><Link href={`/${locale}/contact`}>{c.secondary}</Link></Button>
    </div>
  );
  const slides = [
    <Fragment key="main">
      <div className={`hero-copy ${copyClass}`}>
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className={titleClass}>{c.main.title}</h1>
        <ul aria-label={c.keywords.label} className="flex flex-wrap gap-2">
          {c.keywords.items.map((k, i) => (
            <li key={k} style={{ "--i": i } as React.CSSProperties} className="hero-kw relative rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-sm font-semibold leading-5 text-on-band">{k}</li>
          ))}
        </ul>
        {cta}
      </div>
      <HeroSigningPhone c={c} />
    </Fragment>,
    <Fragment key="egov">
      <div className={copyClass}>
        <h2 className={titleClass}>{c.egov.title} <span className="text-on-band-accent">{c.egov.accent}</span></h2>
        <p className={subClass}>{c.egov.sub}</p>
        {cta}
      </div>
      <SlideVisual>
        <span className={chipClass}>{c.egov.chip}</span>
        <Landmark className="size-[72px] text-on-band-accent" strokeWidth={1.5} />
        <b className="font-display text-2xl leading-[30px] text-on-band">{c.egov.visualTitle}</b>
      </SlideVisual>
    </Fragment>,
    <Fragment key="trustca">
      <div className={copyClass}>
        <h2 className={titleClass}>{c.trustca.title} <span className="text-on-band-accent">{c.trustca.accent}</span></h2>
        <p className="font-display text-[clamp(18px,1.6vw,22px)] font-semibold leading-[1.4] text-on-band">{c.trustca.lead}</p>
        <p className={`max-w-[560px] ${subClass}`}>{c.trustca.sub}</p>
        {cta}
      </div>
      <SlideVisual>
        <ShieldCheck className="size-[84px] text-on-band-accent" strokeWidth={1.5} />
        <div className="flex gap-2">{c.trustca.chips.map((t) => <span key={t} className={chipClass}>{t}</span>)}</div>
        <b className="font-display text-[22px] leading-7 text-on-band">
          {c.trustca.visualLines.map((line) => <span key={line} className="block">{line}</span>)}
        </b>
      </SlideVisual>
    </Fragment>,
  ];

  return (
    <section className="on-band overflow-hidden bg-[radial-gradient(circle_at_78%_30%,#13306f_0%,var(--band)_38%,var(--band-2)_100%)] pt-[72px] text-on-band">
      <div className="container-x">
        <HeroCarousel slides={SINGLE_SLIDE_ONLY ? slides.slice(0, 1) : slides} labels={c.carousel} />
      </div>
      <div className="relative border-t border-white/10 bg-band-2/60">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-12 gap-y-6 py-8">
          <dl className="grid min-w-0 flex-[1_1_520px] grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-6">
            {stats.map((s) => (
              <div key={s.label} className="hero-stat flex flex-col-reverse gap-1">
                <dt className="text-sm leading-5 text-on-band-muted">{s.label}</dt>
                <dd className="font-display text-[44px] font-bold leading-[48px] tracking-[-0.02em] text-on-band tabular-nums"><CountUp value={s.value} /></dd>
              </div>
            ))}
          </dl>
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-on-band-muted">{c.credentials.label}</span>
            <ul className="flex flex-wrap gap-2">
              {c.credentials.items.map((t, i) => (
                <li key={t} style={{ "--i": i } as React.CSSProperties} className="hero-cert inline-flex items-center gap-1.5 rounded-full border border-on-band-accent/30 bg-white/5 px-3 py-1.5 text-[12.5px] font-semibold leading-4 text-on-band">
                  <ShieldCheck aria-hidden className="size-3.5 text-on-band-accent" strokeWidth={2} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Khung minh hoạ của banner 2 và 3 (trang trí). Mockup có nhãn [PRODUCT IMAGE]; không đưa placeholder lên production.
function SlideVisual({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden className="flex min-w-0 flex-[1_1_420px] justify-center">
      <div className="flex min-h-[520px] w-full max-w-[420px] flex-col items-center justify-center gap-[18px] rounded-lg border border-on-band-accent/25 bg-[radial-gradient(circle_at_70%_25%,#1a3f8f_0%,var(--band)_55%,var(--band-2)_100%)] p-8 text-center">
        {children}
      </div>
    </div>
  );
}
