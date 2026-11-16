"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const TYPE_MS = 75;
const DELETE_MS = 35;
const HOLD_MS = 1700;
const GAP_MS = 250;

type Phase = "hold" | "delete" | "type";

// Dòng từ khóa ngành dưới H1: mỗi từ được gõ ra từng ký tự, giữ lại, xoá, rồi sang từ kế tiếp.
// Danh sách đầy đủ luôn có trong DOM (sr-only) cho trình đọc màn hình và công cụ tìm kiếm; phần gõ là aria-hidden.
// Giảm chuyển động: hiện tĩnh cả danh sách. Tạm dừng khi ngoài khung nhìn, tab bị ẩn hoặc banner bị carousel đặt `inert`.
export function TypedKeywords({ label, items }: { label: string; items: string[] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [len, setLen] = useState(items[0].length);
  const [phase, setPhase] = useState<Phase>("hold");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    const word = items[idx];
    const paused = () => document.hidden || !!ref.current?.closest("[inert]");
    let ms: number;
    let next: () => void;
    if (phase === "hold") {
      ms = HOLD_MS;
      next = () => setPhase("delete");
    } else if (phase === "delete") {
      ms = len > 0 ? DELETE_MS : GAP_MS;
      next = () => {
        if (len > 0) return setLen(len - 1);
        setIdx((idx + 1) % items.length);
        setPhase("type");
      };
    } else {
      ms = TYPE_MS;
      next = () => {
        if (len < word.length) return setLen(len + 1);
        setPhase("hold");
      };
    }
    const id = window.setTimeout(() => (paused() ? setLen(len) : next()), ms);
    return () => window.clearTimeout(id);
  }, [phase, len, idx, items, visible, reduced]);

  if (reduced) {
    return <p className="font-display text-xl font-semibold leading-8 text-on-band-accent">{items.join(" · ")}</p>;
  }
  return (
    <div ref={ref} className="flex min-h-8 items-center">
      <span className="sr-only">{label}: {items.join(", ")}</span>
      <p aria-hidden className="font-display text-2xl font-semibold leading-8 text-on-band-accent">
        {items[idx].slice(0, len)}
        <span className="typed-caret ml-1 inline-block h-6 w-[3px] translate-y-1 bg-on-band-accent" />
      </p>
    </div>
  );
}
