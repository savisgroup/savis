import Link from "next/link";
import { Check, Fingerprint, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/content/home";

type Props = { locale: string; content: HomeContent["hero"]; stats: HomeContent["stats"] };

// Hero phương án C: H1 hai tầng, điện thoại ký số (minh hoạ vẽ tay từ luồng Digital ID) và dải số liệu ở đáy.
export function HomeHero({ locale, content: c, stats }: Props) {
  return (
    <section className="on-band overflow-hidden bg-[radial-gradient(circle_at_78%_30%,#13306f_0%,var(--band)_38%,var(--band-2)_100%)] pt-[72px] text-on-band">
      <div className="container-x flex flex-wrap items-center gap-14 pb-0">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1 className="text-balance text-[clamp(38px,4.6vw,64px)] font-bold leading-[1.04] tracking-[-0.025em] text-on-band">
            {c.titleLead} <span className="text-on-band-accent">{c.titleAccent}</span>
          </h1>
          <p className="max-w-[560px] text-[clamp(17px,1.5vw,20px)] leading-normal text-on-band-muted">{c.lead}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button asChild><Link href={`/${locale}#solutions`}>{c.primary}</Link></Button>
            <Button asChild variant="onBand"><Link href={`/${locale}#contact`}>{c.secondary}</Link></Button>
          </div>
        </div>
        <PhoneVisual c={c} />
      </div>
      <div className="mt-14 border-t border-white/10 bg-band-2/60">
        <dl className="container-x grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6 py-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm leading-5 text-on-band-muted">{s.label}</dt>
              <dd className="font-display text-[44px] font-bold leading-[48px] tracking-[-0.02em] text-on-band tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// Hình trang trí (aria-hidden): màn hình điện thoại là minh hoạ, không phải ảnh sản phẩm thật.
function PhoneVisual({ c }: { c: HomeContent["hero"] }) {
  const p = c.phone;
  return (
    <div aria-hidden className="relative flex min-h-[520px] min-w-0 flex-[1_1_420px] justify-center">
      <div className="-mb-10 h-[540px] w-[280px] rounded-[40px] bg-[#050b1c] p-3 shadow-[0_40px_80px_rgba(0,0,0,.45),0_0_0_1px_rgba(255,255,255,.08)]">
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
              <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e7f2]"><div className="h-full w-full rounded-full bg-[#0052ff]" /></div>
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
      <FloatCard className="left-0 top-[215px]" icon={<Check className="size-[22px] text-brand" strokeWidth={2} />} title={c.floatA.title} sub={c.floatA.sub} />
      <FloatCard className="right-0 top-[395px]" icon={<ShieldCheck className="size-[22px] text-brand" strokeWidth={2} />} title={c.floatB.title} sub={c.floatB.sub} />
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
