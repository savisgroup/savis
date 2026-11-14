import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/site/Reveal";
import type { HomeContent } from "@/content/home";

// Case lớn (NEAC) + hai case phụ. Chỉ render khi `approval.caseStudies` bật (xem content/home.ts).
// Liên kết tạm trỏ về neo giải pháp vì trang case study chưa có.
export function Customers({ locale, content }: { locale: string; content: HomeContent["customers"] }) {
  const [feature, ...rest] = content.cases;
  if (!feature) return null;
  const href = `/${locale}#solutions`;
  return (
    <section className="py-24">
      <div className="container-x flex flex-col gap-9">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[760px]">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="mt-3 text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.08] tracking-[-0.02em]">{content.title}</h2>
          </div>
          <Link href={href} className="font-semibold text-brand hover:underline">{content.all} →</Link>
        </div>
        <Reveal>
          <Link href={href} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] overflow-hidden rounded-lg border border-line bg-raised text-foreground">
            <div className="on-band flex min-h-[300px] flex-col justify-between gap-6 bg-[radial-gradient(circle_at_30%_30%,#13306f_0%,var(--band)_50%,var(--band-2)_100%)] p-10">
              <span className="self-start rounded-full bg-chip-on-band px-3 py-1 text-xs font-semibold tracking-wide text-chip-on-band-ink">{feature.kicker}</span>
              <div className="flex flex-col gap-1.5">
                <b className="font-display text-[44px] font-bold leading-[48px] tracking-[-0.02em] text-on-band">{feature.client}</b>
                {feature.clientFull && <span className="text-[15px] leading-[22px] text-on-band-muted">{feature.clientFull}</span>}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 p-10">
              <h3 className="text-[30px] font-bold leading-9 tracking-[-0.01em]">{feature.title}</h3>
              <p className="text-[17px] leading-[27px] text-muted">{feature.text}</p>
              <span className="font-semibold text-brand">{content.read} →</span>
            </div>
          </Link>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
          {rest.map((c) => (
            <Reveal key={c.title} className="flex">
              <Card className="w-full">
                <Badge className="self-start">{c.kicker}</Badge>
                <b className="text-sm text-muted">{c.client}</b>
                <h3 className="text-xl font-bold leading-[1.25]">{c.title}</h3>
                <p className="text-[15px] leading-normal text-muted">{c.text}</p>
                <Link href={href} className="mt-auto font-semibold text-brand hover:underline">{content.read} →</Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
