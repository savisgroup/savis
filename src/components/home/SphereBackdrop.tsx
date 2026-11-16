"use client";
import { useEffect, useRef } from "react";

const POINTS = 760;
const TILT = -0.42; // nghiêng trục để thấy nửa trên của quả cầu
const SPIN_RAD_PER_S = 0.07; // xoay chậm
const STATIC_ANGLE = 0.6;
const DOME_MAX_WIDTH_RATIO = 0.5;
const DOME_HEIGHT_RATIO = 0.98;
const DOME_CENTER_Y = 1.04;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Điểm phân bố đều trên mặt cầu đơn vị (xoắn ốc Fibonacci).
const SPHERE = Array.from({ length: POINTS }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / POINTS;
  const r = Math.sqrt(1 - y * y);
  const t = GOLDEN * i;
  return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
});

// Nền quả cầu chấm xanh nằm sau nội dung thẻ: nửa trên của cầu nhô lên từ đáy thẻ, xoay quanh trục dọc, chấm gần mắt lớn và sáng hơn.
// Hình trang trí (aria-hidden). Chỉ vẽ lại khi thẻ trong khung nhìn; giảm chuyển động thì vẽ một khung tĩnh.
// Thẻ cha cần `relative isolate overflow-hidden` để canvas (z âm) nằm trên nền thẻ và dưới chữ.
export function SphereBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    let w = 0;
    let h = 0;
    let angle = STATIC_ANGLE;
    let last = 0;
    let raf = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const radius = Math.min(w * DOME_MAX_WIDTH_RATIO, h * DOME_HEIGHT_RATIO);
      const cy = h * DOME_CENTER_Y; // tâm cầu sát đáy thẻ: chấm ở giữa lớn và sáng, nửa dưới bị thẻ cắt
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      glow.addColorStop(0, "rgba(40,110,230,0.28)");
      glow.addColorStop(1, "rgba(40,110,230,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const [sa, ca] = [Math.sin(angle), Math.cos(angle)];
      const [st, ct] = [Math.sin(TILT), Math.cos(TILT)];
      for (const p of SPHERE) {
        const x1 = p.x * ca + p.z * sa;
        const z1 = -p.x * sa + p.z * ca;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        if (z2 < -0.05) continue; // mặt sau không vẽ
        const depth = Math.max(z2, 0);
        ctx.fillStyle = `rgba(30,124,255,${0.22 + 0.7 * depth})`;
        ctx.beginPath();
        ctx.arc(cx + x1 * radius, cy - y2 * radius, 1 + 2.6 * depth, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const tick = (now: number) => {
      if (last) angle += ((now - last) / 1000) * SPIN_RAD_PER_S;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />;
}
