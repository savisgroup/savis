import React from "react";
import type { LexicalNode, LexicalRoot, Media } from "@/lib/payload/types";
import { mediaUrl } from "@/lib/payload/client";

// Bộ render Lexical → React cho thân bài Insights. Hỗ trợ: đoạn, tiêu đề, danh sách, trích dẫn,
// liên kết, định dạng chữ (đậm/nghiêng/gạch/code), ảnh (upload), bảng — các loại MKT cần chèn.
const FMT = { bold: 1, italic: 2, strike: 4, underline: 8, code: 16 };

function renderText(n: LexicalNode, key: React.Key) {
  const f = typeof n.format === "number" ? n.format : 0;
  let el: React.ReactNode = n.text ?? "";
  if (f & FMT.code) el = <code>{el}</code>;
  if (f & FMT.bold) el = <strong>{el}</strong>;
  if (f & FMT.italic) el = <em>{el}</em>;
  if (f & FMT.underline) el = <u>{el}</u>;
  if (f & FMT.strike) el = <s>{el}</s>;
  return <React.Fragment key={key}>{el}</React.Fragment>;
}

function kids(n: LexicalNode) { return (n.children ?? []).map((c, i) => renderNode(c, i)); }

function renderNode(n: LexicalNode, key: React.Key): React.ReactNode {
  switch (n.type) {
    case "text": return renderText(n, key);
    case "linebreak": return <br key={key} />;
    case "paragraph": return (n.children?.length ? <p key={key}>{kids(n)}</p> : null);
    case "heading": { const Tag = (n.tag as "h2" | "h3" | "h4") ?? "h2"; return <Tag key={key}>{kids(n)}</Tag>; }
    case "quote": return <blockquote key={key}>{kids(n)}</blockquote>;
    case "list": { const Tag = n.listType === "number" ? "ol" : "ul"; return <Tag key={key}>{kids(n)}</Tag>; }
    case "listitem": return <li key={key}>{kids(n)}</li>;
    case "link":
    case "autolink": {
      const url = (n.fields?.url as string | undefined) ?? n.url ?? "#";
      const ext = /^https?:\/\//.test(url);
      return <a key={key} href={url} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{kids(n)}</a>;
    }
    case "upload": {
      const m = n.value as Media | number | undefined;
      const src = mediaUrl(m);
      if (!src || typeof m === "number") return null;
      return (
        <figure key={key}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={m?.alt ?? ""} width={m?.width ?? undefined} height={m?.height ?? undefined} loading="lazy" />
          {typeof n.fields?.caption === "string" && <figcaption className="mt-2 text-sm text-muted">{n.fields.caption as string}</figcaption>}
        </figure>
      );
    }
    case "table": return <div key={key} className="tbl"><table><tbody>{kids(n)}</tbody></table></div>;
    case "tablerow": return <tr key={key}>{kids(n)}</tr>;
    case "tablecell": {
      const Tag = n.headerState ? "th" : "td";
      return <Tag key={key}>{kids(n)}</Tag>;
    }
    default: return n.children ? <React.Fragment key={key}>{kids(n)}</React.Fragment> : null;
  }
}

export function RichText({ data, className }: { data?: LexicalRoot | null; className?: string }) {
  if (!data?.root?.children?.length) return null;
  return <div className={`prose-savis ${className ?? ""}`}>{data.root.children.map((c, i) => renderNode(c, i))}</div>;
}
