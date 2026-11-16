import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/page/PageView";
import { getSolutionPage, solutionKeys } from "@/content/solutions";
import { isLocale, locales } from "@/lib/i18n";

// Trang sản phẩm / giải pháp (cấp 5) của Solutions & Products.
type Props = { params: Promise<{ locale: string; pillar: string; group: string; product: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  locales.flatMap((locale) =>
    solutionKeys.filter((k) => k.split("/").length === 3).map((k) => {
      const [pillar, group, product] = k.split("/");
      return { locale, pillar, group, product };
    }),
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pillar, group, product } = await params;
  const data = getSolutionPage(pillar, group, product);
  if (!isLocale(locale) || !data) return {};
  const path = `/solutions/${pillar}/${group}/${product}`;
  return {
    title: data.hero.title,
    description: data.hero.lead,
    alternates: { canonical: `/${locale}${path}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, pillar, group, product } = await params;
  const data = getSolutionPage(pillar, group, product);
  if (!isLocale(locale) || !data) notFound();
  return <PageView locale={locale} data={data} />;
}
