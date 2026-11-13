import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { approval, homeContent } from "@/content/home";
import { HomeHero } from "@/components/home/HomeHero";
import { ClientStrip } from "@/components/home/ClientStrip";
import { Pillars } from "@/components/home/Pillars";
import { Segments } from "@/components/home/Segments";
import { Customers } from "@/components/home/Customers";
import { IdFlow } from "@/components/home/IdFlow";
import { ClosingCta } from "@/components/home/ClosingCta";

// Trang chủ phương án C. Nội dung tĩnh trong content/home.ts; khối chưa được duyệt công bố bị ẩn theo `approval`.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = homeContent[locale];
  // Số liệu "[XXX]+ khách hàng" chưa có số thật nên không nằm trong `stats` (xem approval.clientCount).
  return (
    <>
      <HomeHero locale={locale} content={c.hero} stats={c.stats} />
      {approval.clientNames && <ClientStrip label={c.trustedBy} clients={c.clients} />}
      <Pillars locale={locale} content={c.solutions} pillars={c.pillars} />
      <Segments locale={locale} content={c.industries} />
      {approval.caseStudies && <Customers locale={locale} content={c.customers} />}
      <IdFlow locale={locale} content={c.idFlow} />
      <ClosingCta locale={locale} content={c.cta} />
    </>
  );
}
