import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import type { HomeContent } from "@/content/home";

// Khối Chính phủ / Ngân hàng nền tối (neo #industries trên menu).
export function Segments({ locale, content }: { locale: string; content: HomeContent["industries"] }) {
  return (
    <section id="industries" className="on-band bg-band-2 py-24 text-on-band">
      <div className="container-x flex flex-col gap-10">
        <div className="max-w-[760px]">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="mt-3 text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.08] tracking-[-0.02em]">{content.title}</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-5">
          {content.segments.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.08} className="flex">
              <div className="flex w-full flex-col gap-[18px] rounded-lg border border-white/10 bg-band p-9">
                <span className="self-start rounded-full bg-chip-on-band px-3 py-1 text-xs font-semibold tracking-wide text-chip-on-band-ink">{g.label}</span>
                <h3 className="text-2xl font-bold leading-8 tracking-[-0.01em]">{g.promise}</h3>
                <ul className="flex flex-col gap-2.5">
                  {g.proofs.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 leading-6 text-on-band-muted">
                      <Check aria-hidden className="mt-[3px] size-[18px] flex-none text-on-band-accent" strokeWidth={2} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}#solutions`} className="mt-auto font-semibold text-on-band-accent hover:underline">{g.cta} →</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
