import { PillarImage } from "./PillarImage";
import { Database, Fingerprint, Landmark, ShieldCheck, WalletCards, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import type { HomeContent, PillarId } from "@/content/home";

const icons: Record<PillarId, LucideIcon> = {
  identity: Fingerprint, cyber: ShieldCheck, gov: Landmark, finance: WalletCards, data: Database,
};

type Props = { content: HomeContent["solutions"]; pillars: HomeContent["pillars"] };

// Thanh 5 trụ cột (neo tới hàng tương ứng) + 5 hàng lớn xen kẽ trái/phải. Không đánh số 01-05 như mockup vì design system
// quy định các trụ cột song song, không đánh số.
export function Pillars({ content, pillars }: Props) {
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
        {pillars.map((p, i) => (
          <div key={p.id} id={`pillar-${p.id}`} className="group/pillar grid items-center gap-7 min-[860px]:grid-cols-2 min-[860px]:gap-16">
            <PillarMedia id={p.id} name={p.name} flip={i % 2 === 1} />
            {/* Chữ hiện sau ảnh một nhịp. */}
            <Reveal delay={0.15} className="flex min-w-0 flex-col gap-4">
              <h3 className="text-[clamp(26px,2.6vw,36px)] font-bold leading-[1.12] tracking-[-0.02em]">{p.name}</h3>
              <p className="text-lg leading-7 text-muted">{p.text}</p>
              <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

// Ảnh minh hoạ trụ cột: ảnh Unsplash (Unsplash License, dùng thương mại miễn phí, không bắt buộc ghi nguồn),
// đã kiểm tra không có logo thương hiệu nổi bật. Thay bằng ảnh sản phẩm thật khi có. Nguồn từng ảnh:
// - identity: George Prentzas, unsplash.com/photos/SRFG7iwktDk
// - cyber:    Winston Chen,     unsplash.com/photos/iZe21DzHnUg
// - gov:      Andre Benz,       unsplash.com/photos/WsxKHqrdibY
// - finance:  Atlantic Money,   unsplash.com/photos/9XrefmwkHCs
// - data:     jonakoh,          unsplash.com/photos/r5lbaK3fDaM
const pillarImages: Partial<Record<PillarId, string>> = {
  identity: "/images/pillars/identity.jpg",
  cyber: "/images/pillars/cyber.jpg",
  gov: "/images/pillars/gov.jpg",
  finance: "/images/pillars/finance.jpg",
  data: "/images/pillars/data.jpg",
};

// Ảnh mang tính trang trí (tên trụ cột đã có ở tiêu đề bên cạnh) nên alt rỗng. Chuyển động nằm trong PillarImage.
// Trụ cột chưa có ảnh (data) dùng khung navy với hai vòng tròn và tên trụ cột như mockup, không ghi nhãn placeholder.
function PillarMedia({ id, name, flip }: { id: PillarId; name: string; flip: boolean }) {
  const src = pillarImages[id];
  const order = flip ? "min-[860px]:order-2" : "";
  if (src) return <PillarImage src={src} className={order} />;
  return (
    <div aria-hidden className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_70%_30%,#13306f_0%,var(--band)_45%,var(--band-2)_100%)] ${order}`}>
      <div className="absolute inset-[14%] rounded-full border border-on-band-accent/20" />
      <div className="absolute inset-[28%] rounded-full border border-on-band-accent/30" />
      <span className="relative p-6 text-center font-display text-[22px] font-bold leading-7 text-on-band">{name}</span>
    </div>
  );
}
