import Link from "next/link";
import { Button } from "@/components/ui/button";

type Cta = { label: string; href: string };

// Khối đầu trang trên nền navy (design system: Hero). Màn hình đầu phải nêu việc cụ thể, cho ai, bằng chứng gì.
// `lead` chỉ dùng khi có bằng chứng thật đã được duyệt công bố; `visual` chỉ dùng hình sản phẩm/luồng thật.
export function Hero({ eyebrow, title, lead, primary, secondary, visual }: {
  eyebrow?: string; title: string; lead?: string; primary: Cta; secondary?: Cta; visual?: React.ReactNode;
}) {
  return (
    <section className="on-band bg-[radial-gradient(circle_at_80%_25%,var(--band)_0%,var(--band-2)_100%)] py-12 text-on-band md:py-16">
      <div className={visual ? "container-x grid items-center gap-12 min-[860px]:grid-cols-[1.15fr_.85fr]" : "container-x"}>
        <div className="flex min-w-0 flex-col gap-4">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="max-w-3xl text-balance text-[clamp(36px,5vw,60px)] font-bold leading-[1.05] tracking-[-0.02em] text-on-band">{title}</h1>
          {lead && <p className="max-w-[600px] text-[clamp(17px,1.6vw,20px)] leading-normal text-on-band-muted">{lead}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button asChild><Link href={primary.href}>{primary.label}</Link></Button>
            {secondary && <Button asChild variant="onBand"><Link href={secondary.href}>{secondary.label}</Link></Button>}
          </div>
        </div>
        {visual && <div className="min-w-0">{visual}</div>}
      </div>
    </section>
  );
}
