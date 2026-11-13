export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

type Dict = {
  nav: { solutions: string; industries: string; insights: string; about: string; contact: string };
  a11y: { openMenu: string; closeMenu: string; mainNav: string; mobileMenu: string; language: string; home: string; skip: string; breadcrumb: string; category: string };
  insights: {
    eyebrow: string; title: string; lead: string; all: string; readMore: string; home: string;
    moreNews: string; mediaContact: string; empty: string; back: string;
  };
  footer: { tagline: string };
};

export const dict: Record<Locale, Dict> = {
  en: {
    nav: { solutions: "Solutions & Products", industries: "Industries", insights: "Insights", about: "About Us", contact: "Contact us" },
    a11y: { openMenu: "Open menu", closeMenu: "Close menu", mainNav: "Main", mobileMenu: "Menu", language: "Language", home: "SAVIS Group home", skip: "Skip to content", breadcrumb: "Breadcrumb", category: "Category" },
    insights: {
      eyebrow: "News & insights", title: "News, regulation and expert insight.",
      lead: "Company announcements, customer stories and practical guidance on digital identity, trust services and post-quantum security.",
      all: "All", readMore: "Read more", home: "Home", moreNews: "Keep reading", mediaContact: "Media contact",
      empty: "No articles in this category yet.", back: "All insights",
    },
    footer: { tagline: "Trusted Digital Infrastructure for a Smarter World." },
  },
  vi: {
    nav: { solutions: "Giải pháp & Sản phẩm", industries: "Lĩnh vực", insights: "Insights", about: "Về chúng tôi", contact: "Liên hệ" },
    a11y: { openMenu: "Mở menu", closeMenu: "Đóng menu", mainNav: "Điều hướng chính", mobileMenu: "Menu", language: "Ngôn ngữ", home: "Trang chủ SAVIS Group", skip: "Bỏ qua, đến nội dung chính", breadcrumb: "Đường dẫn", category: "Danh mục" },
    insights: {
      eyebrow: "Tin tức & Insights", title: "Tin tức, quy định và góc nhìn chuyên gia.",
      lead: "Thông báo của công ty, câu chuyện khách hàng và hướng dẫn thực tiễn về định danh số, dịch vụ tin cậy và an ninh hậu lượng tử.",
      all: "Tất cả", readMore: "Đọc tiếp", home: "Trang chủ", moreNews: "Đọc thêm", mediaContact: "Liên hệ báo chí",
      empty: "Chưa có bài viết trong danh mục này.", back: "Tất cả bài viết",
    },
    footer: { tagline: "Hạ tầng số tin cậy cho một thế giới thông minh hơn." },
  },
};

export function formatDate(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}
