import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { approval, homeContent } from "@/content/home";
import { HomeHero } from "@/components/home/HomeHero";
import { Pillars } from "@/components/home/Pillars";
import { Industries } from "@/components/home/Industries";
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { Customers } from "@/components/home/Customers";

// Trang chủ phương án C: hero 3 banner, 5 trụ cột, ngành, văn phòng toàn cầu, khách hàng. Nội dung tĩnh trong content/home.ts; khối chưa được duyệt công bố bị ẩn theo `approval`.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = homeContent[locale];
  return (
    <>
      <HomeHero locale={locale} content={c.hero} stats={c.stats} />
      <Pillars content={c.solutions} pillars={c.pillars} />
      <Industries locale={locale} content={c.industries} />
      <GlobalPresence locale={locale} content={c.presence} />
      {approval.caseStudies && <Customers locale={locale} content={c.customers} />}
    </>
  );
}
