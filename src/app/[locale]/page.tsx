import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLocale } from "@/lib/i18n";
import { getInsights } from "@/lib/payload/client";
import { InsightCard } from "@/components/insights/InsightCard";
import { Hero } from "@/components/site/Hero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

// Trang chủ tạm: Hero + khối Insights lấy từ Payload. Các section còn lại (trụ cột, ProofStrip, ngành…) dựng khi có nội dung duyệt.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale];
  // CMS lỗi không được làm sập trang chủ: Hero vẫn hiển thị, khối Insights ẩn đi.
  const docs = await getInsights(locale, { limit: 4 })
    .then((r) => r.docs)
    .catch((error: unknown) => {
      console.error("[home] Không tải được Insights từ Payload:", error);
      return [];
    });
  return (
    <>
      <Hero
        eyebrow={t.home.eyebrow}
        title={t.home.title}
        primary={{ label: t.home.cta, href: `/${locale}/insights` }}
      />
      {docs.length > 0 && (
      <section className="py-[var(--space-9)]">
        <div className="container-x">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">{t.insights.eyebrow}</span>
              <h2 className="mt-2 text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1]">{t.insights.title}</h2>
            </div>
            <Button asChild variant="ghost" size="sm"><Link href={`/${locale}/insights`}>{t.insights.back} →</Link></Button>
          </div>
          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-4">
            {docs.map((d, i) => (<Reveal key={d.id} delay={i * 0.06}><InsightCard insight={d} locale={locale} /></Reveal>))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
