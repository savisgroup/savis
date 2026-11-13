import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import type { HomeContent } from "@/content/home";

// Luồng 4 bước Digital ID (StepFlow của design system).
export function IdFlow({ locale, content }: { locale: string; content: HomeContent["idFlow"] }) {
  return (
    <section className="bg-surface py-24">
      <div className="container-x flex flex-col gap-9">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[760px]">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="mt-3 text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.08] tracking-[-0.02em]">{content.title}</h2>
          </div>
          <Link href={`/${locale}#solutions`} className="font-semibold text-brand hover:underline">{content.link} →</Link>
        </div>
        <Reveal>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] overflow-hidden rounded-lg border border-line bg-raised">
            {content.steps.map((s) => (
              <li key={s.stage} className="flex flex-col gap-2 border-b border-line p-6 last:border-b-0 min-[900px]:border-b-0 min-[900px]:border-r min-[900px]:last:border-r-0">
                <span className="font-display text-[13px] font-bold text-brand">{s.stage}</span>
                <b className="font-display text-xl text-ink">{s.title}</b>
                <span className="text-sm text-muted">{s.description}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
