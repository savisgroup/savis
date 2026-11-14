import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";
import { resolveHref, simpleMenus } from "@/content/navigation";

const FEATURED_COUNT = 2;
const pillBase = "flex min-h-[52px] items-center justify-between gap-2.5 rounded-full border border-white/40 bg-white/5 px-5 text-[15px] font-semibold leading-5 text-on-band";
const cardBase = "flex w-full flex-col gap-4 rounded-lg border border-white/20 bg-band p-9 text-on-band";
const hoverBorder = "transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:border-on-band-accent";

// Khối ngành nền tối (neo #industries trên menu): 2 thẻ lớn Chính phủ / Ngân hàng + 11 ngành còn lại dạng viên.
// Trang ngành chưa dựng thì thẻ và viên hiện dạng chữ, không phải link, để không dẫn vào 404 (xem BUILT_PATHS).
export function Industries({ locale, content }: { locale: Locale; content: HomeContent["industries"] }) {
  const menu = simpleMenus.find((m) => m.id === "industries");
  const others = (menu?.items ?? []).slice(FEATURED_COUNT);
  const allHref = resolveHref(locale, { path: "/industries" });
  return (
    <section id="industries" className="on-band bg-band-2 py-24 text-on-band">
      <div className="container-x flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[760px]">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="mt-3 text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.08] tracking-[-0.02em]">{content.title}</h2>
          </div>
          {allHref && <Link href={allHref} className="font-semibold text-on-band-accent hover:underline">{content.all} →</Link>}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-5">
          {content.featured.map((f, i) => {
            const href = resolveHref(locale, { path: f.path });
            const body = (
              <>
                <h3 className="text-[26px] font-bold leading-8 tracking-[-0.01em]">{f.name}</h3>
                <p className="leading-[25px] text-on-band-muted">{f.pitch}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.products.map((t) => <span key={t} className="rounded-full bg-chip-on-band px-3 py-1 text-xs font-semibold tracking-wide text-chip-on-band-ink">{t}</span>)}
                </div>
                {href && <span className="mt-auto font-semibold text-on-band-accent">{content.cardCta} →</span>}
              </>
            );
            return (
              <Reveal key={f.path} delay={i * 0.08} className="flex">
                {href ? <Link href={href} className={`${cardBase} ${hoverBorder}`}>{body}</Link> : <div className={cardBase}>{body}</div>}
              </Reveal>
            );
          })}
        </div>
        <div className="flex flex-col gap-3.5">
          <h3 className="eyebrow">{content.other}</h3>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
            {others.map((it) => {
              const href = resolveHref(locale, { path: it.path });
              return (
                <li key={it.path}>
                  {href ? (
                    <Link href={href} className={`group/ind ${pillBase} ${hoverBorder} hover:bg-white/10`}>
                      {it.label[locale]}
                      <span aria-hidden className="-translate-x-1 text-on-band-accent opacity-0 transition-[opacity,transform] duration-[var(--motion-fast)] group-hover/ind:translate-x-0 group-hover/ind:opacity-100 group-focus-visible/ind:translate-x-0 group-focus-visible/ind:opacity-100 motion-reduce:transition-none">→</span>
                    </Link>
                  ) : (
                    <span className={pillBase}>{it.label[locale]}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
