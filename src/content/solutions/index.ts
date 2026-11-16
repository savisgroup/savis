import type { PageData } from "@/content/pages/types";
import pages from "./pages.json";

// Trang pillar (cấp 3) và trang sản phẩm (cấp 5) của Solutions & Products, sinh từ docx bằng scripts/solutions/convert.py.
// Khóa là đường dẫn sau /solutions/: "pillar" hoặc "pillar/group/product".
const data = pages as unknown as Record<string, PageData>;

export const solutionKeys = Object.keys(data);
export const getSolutionPage = (...segments: string[]): PageData | undefined => {
  const key = segments.join("/");
  return Object.hasOwn(data, key) ? data[key] : undefined;
};
export const solutionPaths = new Set(solutionKeys.map((k) => `/solutions/${k}`));
