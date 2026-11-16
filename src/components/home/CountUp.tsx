"use client";
import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1400;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// "5,000+" / "5.000+" / "22+": tách phần số, đếm từ 0 tới giá trị khi phần tử vào khung nhìn (một lần), giữ nguyên dấu phân cách
// và hậu tố. HTML server và lần render đầu của client đều là giá trị cuối, nên không lệch hydration và không có số "0" khi tắt JS.
// Người đọc màn hình chỉ nghe giá trị cuối (phần số đang đếm là aria-hidden).
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function parse(value: string) {
  const m = value.match(/^([\d.,]+)(.*)$/);
  if (!m) return null;
  const sep = m[1].includes(",") ? "," : m[1].includes(".") ? "." : "";
  const target = Number(m[1].replace(/[.,]/g, ""));
  return Number.isFinite(target) ? { target, sep, suffix: m[2] } : null;
}

const group = (n: number, sep: string) => (sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n));

export function CountUp({ value }: { value: string }) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(parsed?.target ?? 0);

  useEffect(() => {
    const el = ref.current;
    if (!parsed || !el || window.matchMedia(REDUCED_MOTION).matches) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        setN(Math.round(parsed.target * ease(t)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      setN(0);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        run();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parsed) return <>{value}</>;
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden>{group(n, parsed.sep)}{parsed.suffix}</span>
    </span>
  );
}
