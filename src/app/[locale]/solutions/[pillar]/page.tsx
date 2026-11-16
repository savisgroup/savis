import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/page/PageView";
import { getSolutionPage, solutionKeys } from "@/content/solutions";
import { isLocale, locales } from "@/lib/i18n";

// Trang pillar (cấp 3) của Solutions & Products.
type Props = { params: Promise<{ locale: string; pillar: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  locales.flatMap((locale) => solutionKeys.filter((k) => !k.includes("/")).map((pillar) => ({ locale, pillar })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pillar } = await params;
  const data = getSolutionPage(pillar);
  if (!isLocale(locale) || !data) return {};
  return {
    title: data.hero.title,
    description: data.hero.lead,
    alternates: { canonical: `/${locale}/solutions/${pillar}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/solutions/${pillar}`])) },
  };
}

export default async function PillarPage({ params }: Props) {
  const { locale, pillar } = await params;
  const data = getSolutionPage(pillar);
  if (!isLocale(locale) || !data) notFound();
  return <PageView locale={locale} data={data} />;
}
