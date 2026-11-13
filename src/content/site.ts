import type { Locale } from "@/lib/i18n";
import { homeContent, type PillarId } from "@/content/home";

// Điều hướng và footer theo bản C (design canvas "SAVIS Website Trang chủ").
// `live` = trang đích đã tồn tại. Mục chưa có trang bị ẩn thay vì trỏ vào 404; bật `live` khi dựng xong trang.
// Ô tìm kiếm, form bản tin và liên kết pháp lý (Privacy, Cookies, Accessibility) của bản C chưa có chức năng/trang
// nên chưa dựng; thêm khi có backend và nội dung pháp lý đã duyệt.
type NavSeed = { id: string; label: Record<Locale, string>; path: string; live: boolean };
export type NavLink = { href: string; label: string };

const navSeeds: NavSeed[] = [
  { id: "solutions", label: { en: "Solutions & Products", vi: "Giải pháp & Sản phẩm" }, path: "#solutions", live: true },
  { id: "industries", label: { en: "Industries", vi: "Lĩnh vực" }, path: "#industries", live: true },
  { id: "services", label: { en: "Services", vi: "Dịch vụ" }, path: "/services", live: false },
  { id: "innovation", label: { en: "Innovation", vi: "Đổi mới sáng tạo" }, path: "/innovation", live: false },
  { id: "customers", label: { en: "Customers", vi: "Khách hàng" }, path: "/customers", live: false },
  { id: "insights", label: { en: "Insights", vi: "Insights" }, path: "/insights", live: true },
  { id: "about", label: { en: "About Us", vi: "Về chúng tôi" }, path: "/about", live: false },
];

const utilitySeeds: NavSeed[] = [
  { id: "investors", label: { en: "Investors", vi: "Nhà đầu tư" }, path: "/investors", live: false },
  { id: "careers", label: { en: "Careers", vi: "Tuyển dụng" }, path: "/careers", live: false },
  { id: "trust-center", label: { en: "Trust Center", vi: "Trust Center" }, path: "/trust-center", live: false },
  { id: "partners", label: { en: "Partner portal", vi: "Cổng đối tác" }, path: "/partners", live: false },
];

// Đường dẫn bắt đầu bằng "#" là neo trên trang chủ.
const toLinks = (seeds: NavSeed[], locale: Locale): NavLink[] =>
  seeds.filter((s) => s.live).map((s) => ({ href: `/${locale}${s.path}`, label: s.label[locale] }));

export const mainNav = (locale: Locale) => toLinks(navSeeds, locale);
export const utilityNav = (locale: Locale) => toLinks(utilitySeeds, locale);

// Cột "Công ty" của footer (theo bản C): các mục chính từ Services trở đi, các liên kết tiện ích, rồi Liên hệ.
const COMPANY_IDS = new Set(["services", "innovation", "customers", "insights", "about"]);
export const footerCompany = (locale: Locale, contactLabel: string): NavLink[] => [
  ...toLinks(navSeeds.filter((s) => COMPANY_IDS.has(s.id)), locale),
  ...toLinks(utilitySeeds.filter((s) => s.id === "partners" || s.id === "careers"), locale),
  { href: `/${locale}#contact`, label: contactLabel },
];

// Cột "Giải pháp" của footer: trụ cột 5 chưa có hàng riêng trên trang chủ nên trỏ về đầu khối giải pháp.
const pillarAnchor = (id: PillarId) => (id === "data" ? "#solutions" : `#pillar-${id}`);
export const footerPillars = (locale: Locale): NavLink[] =>
  homeContent[locale].pillars.map((p) => ({ href: `/${locale}${pillarAnchor(p.id)}`, label: p.name }));

export type Office = { city: string; detail?: string; hq?: boolean };
// Chỉ liệt kê văn phòng đã có dữ liệu thật trong mockup; dòng giữ chỗ "[City] / [Address]" của Hoa Kỳ bị bỏ.
export const offices: Office[] = [
  { city: "Hanoi", detail: "9F Viet A Tower, 9 Duy Tan", hq: true },
  { city: "Ho Chi Minh City", detail: "2F Winhome, 25 Dao Duy Anh" },
  { city: "Singapore" },
];

export const footerCopy: Record<Locale, { solutions: string; company: string; offices: string; hq: string; hotline: string; regions: string }> = {
  en: { solutions: "Solutions & Products", company: "Company", offices: "Global offices", hq: "HQ", hotline: "Hotline", regions: "Vietnam · Singapore · Philippines · Australia & New Zealand · UAE · Nigeria · Algeria · Brazil" },
  vi: { solutions: "Giải pháp & Sản phẩm", company: "Công ty", offices: "Văn phòng toàn cầu", hq: "Trụ sở chính", hotline: "Hotline", regions: "Việt Nam · Singapore · Philippines · Úc & New Zealand · UAE · Nigeria · Algeria · Brazil" },
};
export const HOTLINE = { display: "1900 636156", tel: "1900636156" };
