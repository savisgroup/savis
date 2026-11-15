import about from "./about.json";
import contact from "./contact.json";
import customers from "./customers.json";
import industries from "./industries.json";
import innovation from "./innovation.json";
import services from "./services.json";
import solutions from "./solutions.json";
import trustCenter from "./trust-center.json";
import useCases from "./use-cases.json";
import type { PageData } from "./types";

// Trang L2 dựng từ canvas thiết kế "SAVIS Website Trang chủ", các artboard "L2 · ...". Nội dung EN lấy nguyên từ thiết kế.
// Insights không nằm ở đây: trang đó chạy bằng CMS (app/[locale]/insights).
// Cập nhật khi thiết kế đổi: chạy lại bộ chuyển đổi artboard -> JSON rồi thay các file *.json cùng thư mục.
// Các mục placeholder / "to confirm" / "VERIFY" của thiết kế đã bị loại khỏi JSON (design system cấm placeholder trên production).
const pages = {
  solutions, industries, "use-cases": useCases, services, innovation, customers, about, "trust-center": trustCenter, contact,
} as unknown as Record<string, PageData>;

export const pageSlugs = Object.keys(pages);
export const getPage = (slug: string): PageData | undefined => (Object.hasOwn(pages, slug) ? pages[slug] : undefined);
