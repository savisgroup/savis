// Mô hình dữ liệu trang cấp 2 (L2). Sinh từ các artboard "L2 · ..." của canvas thiết kế, xem index.ts.
// Sinh bằng scripts/l2/convert.py. Mục còn placeholder thiếu dữ kiện thật đã bị loại sẵn khỏi JSON.

export type Tone = "light" | "surface" | "dark";
export type Button = { label: string; href: string; ghost: boolean };
export type Badge = { text: string; tone: "new" | "default" | "tbc" };

export type Card = {
  t: "card"; title?: string; text?: string; eyebrow?: string; badges?: Badge[];
  list?: string[]; chain?: string[]; more?: string; href?: string; dark?: boolean;
};
export type Step = { t: "step"; num?: string; title?: string; text?: string };
export type Office = { t: "office"; region: string; name: string; lines: string[]; hq?: boolean };
export type GridItem = Card | Step | Office;

export type Block =
  | { t: "head"; eyebrow?: string; title: string; lead?: string; link?: string; href?: string | null }
  | { t: "tabs"; items: string[]; anchors?: string[]; active?: number | null }
  | { t: "sub"; title: string }
  | { t: "grid"; cols: "2" | "3" | "4"; items: GridItem[] }
  | { t: "stats"; items: { value: string; label: string }[] }
  | { t: "logos"; label?: string; items: string[]; text?: string; gate?: "clientNames" }
  | { t: "timeline"; items: { year: string; text: string }[] }
  | { t: "text"; text: string }
  | { t: "note"; text: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "layers"; items: { label: string; items: string[] }[] }
  | { t: "link"; label: string; href: string | null }
  | { t: "split"; eyebrow?: string; title: string; lead?: string; cards: Card[] }
  | { t: "contact"; fields: { label: string; kind: "text" | "select" | "textarea"; placeholder?: string }[]; send: string; side: Card[] };

export type Cta = { t: "cta"; title: string; lead: string; buttons: Button[] };
export type Section = { id?: string; tone: Tone; blocks: Block[]; cta?: Cta };
export type PageData = {
  slug: string;
  hero: { crumb: string; trail?: { label: string; href?: string }[]; eyebrow: string; title: string; lead: string; buttons: Button[] };
  sections: Section[];
};
