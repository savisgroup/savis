import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getPage, pageSlugs } from "@/content/pages";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSections";

// Các trang cấp 2 của mega menu (Solutions, Industries, Use Cases, Services, Innovation, Customers, About, Trust Center, Contact),
// dựng từ dữ liệu trong content/pages. Insights có route riêng (CMS) nên không nằm trong danh sách này.
type Props = { params: Promise<{ locale: string; page: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => pageSlugs.map((page) => ({ locale, page })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page } = await params;
  const data = getPage(page);
  if (!isLocale(locale) || !data) return {};
  return {
    title: data.hero.eyebrow,
    description: data.hero.lead,
    alternates: { canonical: `/${locale}/${page}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${page}`])) },
  };
}

export default async function L2Page({ params }: Props) {
  const { locale, page } = await params;
  const data = getPage(page);
  if (!isLocale(locale) || !data) notFound();
  return (
    <>
      <PageHero locale={locale} hero={data.hero} />
      {data.sections.map((s, i) => <PageSection key={i} locale={locale} section={s} />)}
    </>
  );
}
