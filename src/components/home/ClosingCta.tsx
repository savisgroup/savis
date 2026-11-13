import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/content/home";

// Dải CTA cuối trang (neo #contact trên menu). Trang liên hệ chưa có nên nút Contact trỏ về neo này.
export function ClosingCta({ locale, content }: { locale: string; content: HomeContent["cta"] }) {
  return (
    <section id="contact" className="on-band bg-[radial-gradient(circle_at_80%_20%,#13306f_0%,var(--band)_45%,var(--band-2)_100%)] py-24 text-on-band">
      <div className="container-x flex flex-col items-center gap-5 text-center">
        <h2 className="max-w-[820px] text-balance text-[clamp(32px,4vw,52px)] font-bold leading-[1.06] tracking-[-0.025em] text-on-band">{content.title}</h2>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild><Link href={`/${locale}#contact`}>{content.primary}</Link></Button>
          <Button asChild variant="onBand"><Link href={`/${locale}#solutions`}>{content.secondary}</Link></Button>
        </div>
      </div>
    </section>
  );
}
