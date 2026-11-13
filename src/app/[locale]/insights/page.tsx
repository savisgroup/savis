import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLocale } from "@/lib/i18n";
import { getCategories, getInsights } from "@/lib/payload/client";
import { InsightCard } from "@/components/insights/InsightCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: dict[locale].insights.title, description: dict[locale].insights.lead };
}

export default async function InsightsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { category } = await searchParams;
  const t = dict[locale].insights;
  const [cats, { docs }] = await Promise.all([getCategories(), getInsights(locale, { categorySlug: category })]);

  const chip = "rounded-full px-4 py-2 text-sm font-medium transition-colors";
  return (
    <>
      <section className="on-band bg-band text-on-band">
        <div className="container-x py-16">
          <nav className="mb-6 text-sm text-on-band-muted" aria-label={dict[locale].a11y.breadcrumb}>
            <Link href={`/${locale}`} className="hover:text-on-band">{t.home}</Link> / <span className="text-on-band">Insights</span>
          </nav>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-on-band md:text-5xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-on-band-muted">{t.lead}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={dict[locale].a11y.category}>
            <Link href={`/${locale}/insights`} aria-current={!category ? "true" : undefined} className={cn(chip, !category ? "bg-brand text-brand-ink" : "bg-chip text-chip-ink hover:brightness-95")}>{t.all}</Link>
            {cats.map((c) => (
              <Link key={c.id} href={`/${locale}/insights?category=${c.slug}`} aria-current={category === c.slug ? "true" : undefined} className={cn(chip, category === c.slug ? "bg-brand text-brand-ink" : "bg-chip text-chip-ink hover:brightness-95")}>{c.name}</Link>
            ))}
          </div>
          {docs.length === 0 ? (
            <p className="py-16 text-center text-muted">{t.empty}</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {docs.map((d, i) => (<Reveal key={d.id} delay={(i % 6) * 0.05}><InsightCard insight={d} locale={locale} /></Reveal>))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
