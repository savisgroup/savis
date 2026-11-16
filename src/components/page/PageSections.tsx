import Link from "next/link";
import { Button } from "@/components/ui/button";
import { approval } from "@/content/home";
import type { Block, Cta, Section, Tone } from "@/content/pages/types";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ContactForm } from "./ContactForm";
import { CardView, GridItemView } from "./GridItems";

const toneClass: Record<Tone, string> = {
  light: "bg-background",
  surface: "bg-surface",
  dark: "on-band bg-band text-on-band",
};
const gridCols = {
  "2": "grid-cols-[repeat(auto-fill,minmax(min(100%,440px),1fr))]",
  "3": "grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]",
  "4": "grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))]",
} as const;

export function PageSection({ locale, section }: { locale: Locale; section: Section }) {
  const dark = section.tone === "dark";
  return (
    <section id={section.id} className={cn("scroll-mt-24", section.cta ? "py-16" : "py-20", toneClass[section.tone])}>
      <div className="container-x flex flex-col gap-8">
        {section.blocks.map((b, i) => <BlockView key={i} locale={locale} block={b} dark={dark} />)}
        {section.cta && <CtaBand locale={locale} cta={section.cta} />}
      </div>
    </section>
  );
}

function BlockView({ locale, block: b, dark }: { locale: Locale; block: Block; dark: boolean }) {
  switch (b.t) {
    case "head":
      return (
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex max-w-[760px] flex-col gap-3">
            {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
            <h2 className="text-balance text-[clamp(28px,3vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">{b.title}</h2>
            {b.lead && <p className="text-lg leading-7">{b.lead}</p>}
          </div>
          {b.link && b.href && <Link href={`/${locale}${b.href}`} className={cn("font-semibold hover:underline", dark ? "text-on-band-accent" : "text-brand")}>{b.link} →</Link>}
        </div>
      );
    case "tabs":
      return (
        <nav className="flex flex-wrap gap-2.5">
          {b.items.map((label, i) => {
            const anchor = b.anchors?.[i];
            const cls = "flex min-h-11 items-center rounded-full border border-line bg-raised px-[18px] text-sm font-semibold leading-5 text-ink";
            return anchor
              ? <a key={label} href={`#${anchor}`} className={cn(cls, "hover:border-brand hover:text-brand")}>{label}</a>
              : <span key={label} className={cls}>{label}</span>;
          })}
        </nav>
      );
    case "sub":
      return <h3 className="mt-2 flex items-center gap-3 font-display text-lg font-bold leading-6 after:h-px after:flex-1 after:bg-line">{b.title}</h3>;
    case "grid":
      return <div className={cn("grid gap-5", gridCols[b.cols])}>{b.items.map((it, i) => <GridItemView key={i} item={it} locale={locale} />)}</div>;
    case "stats":
      return (
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-8">
          {b.items.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2">
              <dt className={cn("text-[15px] leading-6", dark ? "text-on-band-muted" : "text-muted")}>{s.label}</dt>
              <dd className={cn("font-display text-[clamp(36px,4vw,52px)] font-bold leading-none", dark ? "text-on-band-accent" : "text-brand")}>{s.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "logos":
      // Danh sách tên khách hàng chỉ hiện khi doanh nghiệp đã xác nhận cho phép công bố (approval.clientNames).
      if (b.gate === "clientNames" && !approval.clientNames) return null;
      return (
        <div className="flex flex-col gap-3.5">
          {b.label && <span className="eyebrow">{b.label}</span>}
          <ul className="flex flex-wrap gap-2">
            {b.items.map((n) => <li key={n} className="rounded-full border border-line bg-raised px-3.5 py-[7px] text-[13.5px] font-medium leading-5 text-ink">{n}</li>)}
          </ul>
          {b.text && <p className="max-w-[760px] text-muted">{b.text}</p>}
        </div>
      );
    case "timeline":
      return (
        <ol className="ml-1.5 flex flex-col border-l-2 border-line">
          {b.items.map((e) => (
            <li key={e.year + e.text} className="relative pb-[22px] pl-[26px] text-base leading-[25px] before:absolute before:-left-[7px] before:top-1.5 before:size-3 before:rounded-full before:bg-brand">
              <b className="mr-2.5 font-display text-base font-bold text-brand">{e.year}</b>{e.text}
            </li>
          ))}
        </ol>
      );
    case "text":
      return <p className="max-w-[760px] text-lg leading-7">{b.text}</p>;
    case "note":
      return <p className="max-w-[760px] text-[15px] leading-6 text-muted">{b.text}</p>;
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-line bg-raised" tabIndex={0} role="region" aria-label={b.head[0]}>
          <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-[21px] text-ink">
            <thead>
              <tr className="bg-surface">
                {b.head.map((h, i) => <th key={i} scope="col" className="border-b border-line px-4 py-3 align-bottom font-display text-[13px] font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri} className="border-b border-line last:border-b-0">
                  {r.map((c, ci) => ci === 0
                    ? <th key={ci} scope="row" className="px-4 py-3 align-top font-semibold">{c}</th>
                    : <td key={ci} className="px-4 py-3 align-top text-muted">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "layers":
      return (
        <div className="flex flex-col gap-2.5">
          {b.items.map((l) => (
            <div key={l.label} className="grid gap-3 rounded-lg border border-line bg-raised p-4 min-[760px]:grid-cols-[200px_1fr] min-[760px]:items-center">
              <span className="eyebrow">{l.label}</span>
              <ul className="flex flex-wrap gap-2">
                {l.items.map((n) => <li key={n} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13.5px] font-medium leading-5 text-ink">{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      );
    case "link":
      return b.href ? <Link href={`/${locale}${b.href}`} className="font-semibold text-brand hover:underline">{b.label} →</Link> : null;
    case "split":
      return (
        <div className="grid items-center gap-12 min-[860px]:grid-cols-2">
          <div className="flex flex-col gap-3">
            {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
            <h2 className="text-balance text-[clamp(28px,3vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">{b.title}</h2>
            {b.lead && <p className="text-lg leading-7">{b.lead}</p>}
          </div>
          <div className="flex flex-col gap-4">{b.cards.map((c, i) => <CardView key={i} card={c} locale={locale} />)}</div>
        </div>
      );
    case "contact":
      return <ContactForm form={b} />;
  }
}

function CtaBand({ locale, cta }: { locale: Locale; cta: Cta }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex max-w-[700px] flex-col gap-2.5">
        <h2 className="text-balance text-[clamp(28px,3vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">{cta.title}</h2>
        <p className="text-lg leading-7 text-on-band-muted">{cta.lead}</p>
      </div>
      {cta.buttons.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {cta.buttons.map((b) => <Button key={b.label} asChild variant={b.ghost ? "onBand" : "primary"}><Link href={`/${locale}${b.href}`}>{b.label}</Link></Button>)}
        </div>
      )}
    </div>
  );
}
