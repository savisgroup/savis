import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSections";
import type { PageData } from "@/content/pages/types";
import type { Locale } from "@/lib/i18n";

/** Hero + các section của một trang dựng từ dữ liệu PageData. */
export function PageView({ locale, data }: { locale: Locale; data: PageData }) {
  return (
    <>
      <PageHero locale={locale} hero={data.hero} />
      {data.sections.map((s, i) => <PageSection key={i} locale={locale} section={s} />)}
    </>
  );
}
