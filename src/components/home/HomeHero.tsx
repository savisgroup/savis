import { Fragment } from "react";
import Link from "next/link";
import { Check, Fingerprint, Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/content/home";
import { HeroCarousel } from "./HeroCarousel";

type Hero = HomeContent["hero"];
type Props = { locale: string; content: Hero; stats: HomeContent["stats"] };

const titleClass = "text-balance text-[clamp(34px,4vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] text-on-band";
const subClass = "text-[clamp(17px,1.5vw,20px)] italic leading-normal text-on-band-muted";
const copyClass = "flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]";
const chipClass = "rounded-full bg-chip-on-band px-3 py-1 text-xs font-semibold tracking-wide text-chip-on-band-ink";

// Hero phương án C: 3 banner luân phiên (thông điệp chính, eGov Super App, TrustCA) và dải số liệu ở đáy.
// Chỉ banner đầu dùng <h1>; hai banner sau dùng <h2> cùng kiểu chữ để trang có đúng một h1.
export function HomeHero({ locale, content: c, stats }: Props) {
  const cta = (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <Button asChild><Link href={`/${locale}#solutions`}>{c.primary}</Link></Button>
      <Button asChild variant="onBand"><Link href={`/${locale}#contact`}>{c.secondary}</Link></Button>
    </div>
  );
  const slides = [
    <Fragment key="main">
      <div className={`hero-copy ${copyClass}`}>
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className={titleClass}>{c.main.title}</h1>
        {cta}
      </div>
      <PhoneVisual c={c} />
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
        <HeroCarousel slides={slides} labels={c.carousel} />
      </div>
      <div className="relative border-t border-white/10 bg-band-2/60">
        <dl className="container-x grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6 py-8">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat flex flex-col-reverse gap-1">
              <dt className="text-sm leading-5 text-on-band-muted">{s.label}</dt>
              <dd className="font-display text-[44px] font-bold leading-[48px] tracking-[-0.02em] text-on-band tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
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

// Hình trang trí (aria-hidden): màn hình điện thoại là minh hoạ, không phải ảnh sản phẩm thật.
function PhoneVisual({ c }: { c: Hero }) {
  const p = c.phone;
  return (
    <div aria-hidden className="relative flex min-h-[520px] min-w-0 flex-[1_1_420px] justify-center">
      <div className="hero-phone -mb-10 h-[540px] w-[280px] rounded-[40px] bg-[#050b1c] p-3 shadow-[0_40px_80px_rgba(0,0,0,.45),0_0_0_1px_rgba(255,255,255,.08)]">
        <div className="flex size-full flex-col overflow-hidden rounded-[30px] bg-white text-[#1f2a44]">
          <div className="flex items-center justify-between border-b border-[#e1e7f2] px-[18px] pb-3 pt-[18px]">
            <b className="font-display text-[15px] text-[#0b1f4d]">{p.title}</b>
            <span className="rounded-full bg-[#e7f0ff] px-2 py-[3px] text-[11px] font-semibold text-[#0040c7]">{p.badge}</span>
          </div>
          <div className="flex flex-col gap-3 px-[18px] py-4">
            <div className="flex items-center gap-2.5 rounded-[12px] border border-[#e1e7f2] p-3">
              <div className="h-[42px] w-[34px] flex-none rounded-md border border-[#e1e7f2] bg-[#f3f6fc]" />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-[18px] text-[#0b1f4d]">{p.file}</div>
                <div className="text-[11.5px] leading-4 text-[#56617a]">{p.pages}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium text-[#56617a]"><span>{p.kyc}</span><span className="text-[#0052ff]">{p.kycMethod}</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e7f2]"><div className="hero-bar h-full w-full rounded-full bg-[#0052ff]" /></div>
            </div>
            <div className="mt-2 flex size-[120px] items-center justify-center self-center rounded-full bg-[#e7f0ff]">
              <Fingerprint className="size-14 text-[#0052ff]" strokeWidth={1.6} />
            </div>
            <div className="text-center text-xs text-[#56617a]">{p.hint}</div>
          </div>
          <div className="mt-auto px-[18px] pb-[22px] pt-4">
            <div className="flex h-11 items-center justify-center rounded-full bg-[#0052ff] text-sm font-semibold text-white">{p.action}</div>
          </div>
        </div>
      </div>
      <FloatCard className="hero-float-a left-0 top-[215px]" icon={<Check className="size-[22px] text-brand" strokeWidth={2} />} title={c.floatA.title} sub={c.floatA.sub} />
      <FloatCard className="hero-float-b right-0 top-[395px]" icon={<ShieldCheck className="size-[22px] text-brand" strokeWidth={2} />} title={c.floatB.title} sub={c.floatB.sub} />
    </div>
  );
}

function FloatCard({ className, icon, title, sub }: { className: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className={`absolute flex max-w-[230px] items-center gap-2.5 rounded-md bg-raised px-3.5 py-3 text-foreground shadow-float ${className}`}>
      {icon}
      <div>
        <div className="text-[13.5px] font-semibold leading-[18px] text-ink">{title}</div>
        <div className="text-xs leading-4 text-muted">{sub}</div>
      </div>
    </div>
  );
}
