import Link from "next/link";
import { dict, formatDate, type Locale } from "@/lib/i18n";
import type { Insight } from "@/lib/payload/types";
import { mediaUrl } from "@/lib/payload/client";
import { Card } from "@/components/ui/card";

export function InsightCard({ insight, locale }: { insight: Insight; locale: Locale }) {
  const cat = typeof insight.category === "object" && insight.category ? insight.category.name : null;
  const date = formatDate(insight.publishedDate, locale);
  const img = mediaUrl(insight.featuredImage, "card");
  const eyebrow = [cat, date].filter(Boolean).join(" · ");
  return (
    <Link href={`/${locale}/insights/${insight.slug}`} className="group block h-full">
      <Card className="h-full transition-colors duration-[var(--motion-fast)] group-hover:border-brand">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" loading="lazy" className="mb-1 aspect-[16/9] w-full rounded-md border border-line object-cover" />
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3 className="text-xl font-bold leading-snug">{insight.title}</h3>
        <p className="text-[15px] leading-relaxed text-muted">{insight.summary}</p>
        <span className="mt-auto pt-2 text-sm font-semibold text-brand">{dict[locale].insights.readMore} →</span>
      </Card>
    </Link>
  );
}
