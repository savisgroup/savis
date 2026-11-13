import Link from "next/link";
import { Database, Fingerprint, Landmark, ShieldCheck, WalletCards, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import type { HomeContent, PillarId } from "@/content/home";

const icons: Record<PillarId, LucideIcon> = {
  identity: Fingerprint, cyber: ShieldCheck, gov: Landmark, finance: WalletCards, data: Database,
};

type Props = { locale: string; content: HomeContent["solutions"]; pillars: HomeContent["pillars"] };

// Thanh 5 trụ cột (neo tới hàng tương ứng) + 4 hàng lớn xen kẽ trái/phải. Trụ cột 5 chỉ có ở thanh, chưa có hàng riêng như mockup C.
export function Pillars({ locale, content, pillars }: Props) {
  return (
    <section id="solutions">
      <div className="container-x pb-10 pt-[88px]">
        <span className="eyebrow">{content.eyebrow}</span>
        <h2 className="mt-3 max-w-[760px] text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.08] tracking-[-0.02em]">{content.title}</h2>
        <nav aria-label={content.navLabel} className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3">
          {pillars.map((p) => {
            const Icon = icons[p.id];
            return (
              <a key={p.id} href={`#pillar-${p.id}`} className="flex min-h-11 items-center gap-2.5 rounded-md border border-line bg-raised px-4 py-3.5 text-[14.5px] font-semibold leading-5 text-ink hover:border-brand hover:text-brand">
                <Icon aria-hidden className="size-5 flex-none text-brand" />
                {p.name}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="container-x flex flex-col gap-24 pb-[88px] pt-10">
        {pillars.slice(0, 4).map((p, i) => (
          <Reveal key={p.id}>
            <div id={`pillar-${p.id}`} className="grid items-center gap-7 min-[860px]:grid-cols-2 min-[860px]:gap-16">
              <PillarMedia name={p.name} flip={i % 2 === 1} />
              <div className="flex min-w-0 flex-col gap-4">
                <span className="eyebrow">{p.eyebrow}</span>
                <h3 className="text-[clamp(26px,2.6vw,36px)] font-bold leading-[1.12] tracking-[-0.02em]">{p.name}</h3>
                <p className="text-lg leading-7 text-muted">{p.text}</p>
                <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
                <Link href={`/${locale}#solutions`} className="font-semibold text-brand hover:underline">{p.link} →</Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// Khung hình trụ cột: chưa có ảnh sản phẩm thật nên chỉ dùng nền vòng tròn trang trí, không in nhãn placeholder.
// Khi có ảnh thật, thay thân component này bằng next/image.
function PillarMedia({ name, flip }: { name: string; flip: boolean }) {
  return (
    <div
      aria-hidden
      className={`on-band relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_70%_30%,#13306f_0%,var(--band)_45%,var(--band-2)_100%)] ${flip ? "min-[860px]:order-2" : ""}`}
    >
      <div className="absolute inset-[14%] rounded-full border border-[rgba(111,227,255,.18)]" />
      <div className="absolute inset-[28%] rounded-full border border-[rgba(111,227,255,.28)]" />
      <span className="relative max-w-[70%] p-6 text-center font-display text-[22px] font-bold leading-7 text-on-band">{name}</span>
    </div>
  );
}
