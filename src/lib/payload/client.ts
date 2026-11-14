import "server-only";
import type { Insight, InsightCategory, Media, PaginatedDocs } from "./types";
import type { Locale } from "../i18n";

const BASE = (process.env.PAYLOAD_URL ?? "https://cms.savis-group.com").replace(/\/$/, "");
const KEY = process.env.PAYLOAD_API_KEY;
const DRAFTS = process.env.INSIGHTS_INCLUDE_DRAFTS === "true" && !!KEY;
const REVALIDATE = 60; // giây: nội dung mới trên CMS xuất hiện trên web sau tối đa ~1 phút

async function pf<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
  const url = new URL(`${BASE}/api${path}`);
  for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    headers: KEY && DRAFTS ? { Authorization: `users API-Key ${KEY}` } : undefined,
    next: { revalidate: REVALIDATE, tags: ["payload"] },
  });
  if (!res.ok) throw new Error(`Payload ${res.status} ${url.pathname}${url.search}`);
  return res.json() as Promise<T>;
}

export const mediaUrl = (m: Media | number | null | undefined, size?: string): string | null => {
  if (!m || typeof m === "number") return null;
  const u = (size && m.sizes?.[size]?.url) || m.url;
  if (!u) return null;
  return u.startsWith("http") ? u : `${BASE}${u}`;
};

export async function getCategories(): Promise<InsightCategory[]> {
  const r = await pf<PaginatedDocs<InsightCategory>>("/insight-categories", { limit: 50, sort: "order", depth: 0 });
  return r.docs;
}

// Payload trả bản ngôn ngữ mặc định khi bài chưa dịch (fallback). Lọc theo tiêu đề có ở đúng ngôn ngữ để trang /en
// không hiện bài tiếng Việt và ngược lại. Không tắt fallback toàn cục vì tên danh mục, alt ảnh vẫn cần fallback.
const translatedIn = { "where[title][exists]": true } as const;

export async function getInsights(locale: Locale, opts: { categorySlug?: string; limit?: number; page?: number } = {}) {
  const params: Record<string, string | number | boolean | undefined> = {
    locale, depth: 1, limit: opts.limit ?? 24, page: opts.page ?? 1,
    sort: "-publishedDate,-createdAt", draft: DRAFTS || undefined, ...translatedIn,
  };
  if (opts.categorySlug) params["where[category.slug][equals]"] = opts.categorySlug;
  return pf<PaginatedDocs<Insight>>("/insights", params);
}

export async function getInsightBySlug(locale: Locale, slug: string): Promise<Insight | null> {
  const r = await pf<PaginatedDocs<Insight>>("/insights", {
    locale, depth: 2, limit: 1, "where[slug][equals]": slug, draft: DRAFTS || undefined, ...translatedIn,
  });
  return r.docs[0] ?? null;
}

export async function getAllInsightSlugs(): Promise<string[]> {
  const r = await pf<PaginatedDocs<Pick<Insight, "slug">>>("/insights", {
    limit: 200, depth: 0, "select[slug]": true, draft: DRAFTS || undefined,
  });
  return r.docs.map((d) => d.slug);
}
