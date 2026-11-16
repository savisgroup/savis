"use client";
import { useEffect, useRef, useState } from "react";

// Đánh dấu `data-active="true"` khi phần tử nằm trong khung nhìn. Các hiệu ứng lặp dùng nó để chỉ chạy khi người dùng đang thấy
// (CSS: `[data-active="true"] .tên-lớp { animation-play-state: running }`), tránh tốn CPU/GPU cho phần đã cuộn qua.
export function InView({ children, className, rootMargin = "0px" }: { children: React.ReactNode; className?: string; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return <div ref={ref} data-active={active} className={className}>{children}</div>;
}
