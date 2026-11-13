// Kiểu dữ liệu theo schema Payload hiện tại (collections: insights, insight-categories, media)
export type Media = {
  id: number; alt?: string | null; url?: string | null; filename?: string | null;
  width?: number | null; height?: number | null; mimeType?: string | null;
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null } | undefined>;
};
export type InsightCategory = { id: number; name: string; slug: string; order?: number | null };

export type LexicalNode = {
  type: string; version?: number; children?: LexicalNode[];
  text?: string; format?: number | string; tag?: string; listType?: "bullet" | "number" | "check";
  value?: unknown; fields?: Record<string, unknown>; headerState?: number; url?: string;
};
export type LexicalRoot = { root: LexicalNode };

export type Insight = {
  id: number; title: string; slug: string;
  category: InsightCategory | number | null;
  publishedDate?: string | null;
  featuredImage?: Media | number | null;
  summary: string;
  body?: LexicalRoot | null;
  mediaContact?: string | null;
  relatedPosts?: (Insight | number)[] | null;
  _status?: "draft" | "published";
  updatedAt: string; createdAt: string;
};
export type PaginatedDocs<T> = { docs: T[]; totalDocs: number; hasNextPage: boolean; page: number; totalPages: number };
