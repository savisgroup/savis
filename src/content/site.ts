import type { Locale } from "@/lib/i18n";
import { pillarCopy, pillarMenus, resolveHref, simpleMenus, type MobileLink, type NavItem } from "@/content/navigation";

// Thanh tiện ích và footer theo "SAVIS Web V3 – Sitemap & nội dung", mục 2.1 và 2.3.
// Link dùng chung resolveHref với mega menu: trang chưa dựng thì hiện dạng chữ, không dẫn vào 404.
// Chưa đưa vào footer: Facebook / LinkedIn / YouTube (chưa có URL), Privacy / Cookies (chưa có trang).
type Text = Record<Locale, string>;
type NavSeed = { id: string; label: Text; path: string; live: boolean };
export type NavLink = { href: string; label: string };
export type FooterLink = MobileLink;

const utilitySeeds: NavSeed[] = [
  { id: "investors", label: { en: "Investors", vi: "Nhà đầu tư" }, path: "/about", live: false },
  { id: "careers", label: { en: "Careers", vi: "Tuyển dụng" }, path: "/about/careers", live: false },
  { id: "trust-center", label: { en: "Trust Center", vi: "Trust Center" }, path: "/trust-center", live: false },
  { id: "partners", label: { en: "Partner portal", vi: "Cổng đối tác" }, path: "/about/partners", live: false },
];

export const utilityNav = (locale: Locale): NavLink[] =>
  utilitySeeds.filter((s) => s.live).map((s) => ({ href: `/${locale}${s.path}`, label: s.label[locale] }));

const toFooter = (locale: Locale, it: Pick<NavItem, "label" | "path" | "fallback">): FooterLink => ({
  label: it.label[locale], href: resolveHref(locale, it),
});

// Cột Solutions & Products: 5 trụ cột.
export const footerPillars = (locale: Locale): FooterLink[] =>
  pillarMenus.map((p) => ({ label: pillarCopy(locale, p.id).name, href: resolveHref(locale, p) }));

// Cột Industries: 13 ngành như mega menu; tài liệu rút gọn BFSI thành "Banking".
const industryShort: Record<string, Text> = { "/industries/bfsi": { en: "Banking", vi: "Ngân hàng" } };
export const footerIndustries = (locale: Locale): FooterLink[] =>
  (simpleMenus.find((m) => m.id === "industries")?.items ?? []).map((it) =>
    toFooter(locale, { ...it, label: industryShort[it.path] ?? it.label }));

// Cột Company theo đúng thứ tự trong tài liệu.
const companyItems: NavItem[] = [
  { label: { en: "Services", vi: "Dịch vụ" }, path: "/services" },
  { label: { en: "Innovation", vi: "Đổi mới sáng tạo" }, path: "/innovation" },
  { label: { en: "Customers", vi: "Khách hàng" }, path: "/customers" },
  { label: { en: "Insights", vi: "Insights" }, path: "/insights" },
  { label: { en: "About Us", vi: "Về chúng tôi" }, path: "/about" },
  { label: { en: "Use Cases", vi: "Tình huống ứng dụng" }, path: "/use-cases" },
  { label: { en: "Trust Center", vi: "Trust Center" }, path: "/trust-center" },
  { label: { en: "Partners", vi: "Đối tác" }, path: "/about/partners" },
  { label: { en: "Careers", vi: "Tuyển dụng" }, path: "/about/careers" },
  { label: { en: "Contact", vi: "Liên hệ" }, path: "/contact", fallback: "#contact" },
];
export const footerCompany = (locale: Locale): FooterLink[] => companyItems.map((it) => toFooter(locale, it));

// Văn phòng: footer chỉ dùng tên; khối "Global presence" trên trang chủ dùng thêm khu vực, địa chỉ và liên hệ.
// Văn phòng Hoa Kỳ chưa có địa chỉ (mockup ghi "[Address]") nên bỏ trống.
export type Office = { name: Text; region: Text; address?: Text; contact?: { phone: string; email: string }; hq?: boolean };
const same = (v: string): Text => ({ en: v, vi: v });
const APAC: Text = { en: "Asia-Pacific", vi: "Châu Á - Thái Bình Dương" };
const AFRICA: Text = { en: "Africa", vi: "Châu Phi" };
export const offices: Office[] = [
  { name: { en: "Hanoi", vi: "Hà Nội" }, region: { en: "Global headquarters", vi: "Trụ sở chính toàn cầu" }, address: { en: "9F Viet A Tower, 9 Duy Tan", vi: "Tầng 9, toà nhà Việt Á, số 9 Duy Tân" }, hq: true },
  { name: { en: "Ho Chi Minh City", vi: "TP. Hồ Chí Minh" }, region: { en: "Office", vi: "Văn phòng" }, address: { en: "2F Winhome, 25 Dao Duy Anh", vi: "Tầng 2 Winhome, 25 Đào Duy Anh" } },
  { name: same("Singapore"), region: APAC, address: same("Marina Bay Financial Centre, Singapore") },
  { name: same("Philippines"), region: APAC, address: same("Manila, Philippines") },
  { name: { en: "Australia & New Zealand", vi: "Úc & New Zealand" }, region: APAC, address: { en: "Melbourne Office, Melbourne, Australia", vi: "Văn phòng Melbourne, Úc" }, contact: { phone: "+61 434 567 456", email: "anz-sale@savis-group.com" } },
  { name: { en: "United Arab Emirates", vi: "UAE" }, region: { en: "Middle East", vi: "Trung Đông" }, address: same("Dubai, UAE") },
  { name: same("Nigeria"), region: AFRICA, address: same("Abuja, Nigeria") },
  { name: same("Algeria"), region: AFRICA, address: same("Algiers, Algeria") },
  { name: same("Brazil"), region: { en: "Latin America", vi: "Mỹ Latinh" }, address: same("São Paulo, Brazil") },
  { name: { en: "United States", vi: "Hoa Kỳ" }, region: { en: "North America", vi: "Bắc Mỹ" } },
];

// Chứng nhận ISO lấy nguyên từ tài liệu nội dung; cần xác nhận còn hiệu lực trước khi công bố chính thức.
export const certifications = ["ISO 9001", "ISO 14001", "ISO/IEC 27001"];

export const footerCopy: Record<Locale, { solutions: string; industries: string; company: string; offices: string; hq: string; hotline: string; regions: string }> = {
  en: {
    solutions: "Solutions & Products", industries: "Industries", company: "Company", offices: "Global offices", hq: "HQ", hotline: "Hotline",
    regions: "Vietnam · Singapore · Philippines · Australia & New Zealand · UAE · Nigeria · Algeria · Brazil · USA",
  },
  vi: {
    solutions: "Giải pháp & Sản phẩm", industries: "Lĩnh vực", company: "Công ty", offices: "Văn phòng toàn cầu", hq: "Trụ sở chính", hotline: "Hotline",
    regions: "Việt Nam · Singapore · Philippines · Úc & New Zealand · UAE · Nigeria · Algeria · Brazil · Hoa Kỳ",
  },
};
export const HOTLINE = { display: "1900 636156", tel: "1900636156" };
