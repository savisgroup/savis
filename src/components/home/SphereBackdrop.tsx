"use client";
import { useEffect, useRef } from "react";

const POINTS = 4500;
const TILT = -0.42; // nghiêng trục để thấy nửa trên của quả cầu
const SPIN_RAD_PER_S = 0.07; // xoay chậm
const STATIC_ANGLE = 0.6;
const RADIUS_PER_WIDTH = 0.62; // cầu rất rộng: vòm tràn sang hai bên khối
const CAP_HEIGHT_PER_SECTION = 0.42; // phần nhô lên (khoảng 1/3 quả) so với chiều cao khối
const CAP_MAX_PER_RADIUS = 0.75;
const DEPTH_GAIN = 2.4;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Điểm phân bố đều trên mặt cầu đơn vị (xoắn ốc Fibonacci).
const SPHERE = Array.from({ length: POINTS }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / POINTS;
  const r = Math.sqrt(1 - y * y);
  const t = GOLDEN * i;
  return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
});

// Nền quả cầu chấm xanh nằm sau nội dung khối cha: nửa trên của cầu nhô lên từ sát đáy, xoay quanh trục dọc, chấm gần mắt lớn và sáng hơn.
// Hình trang trí (aria-hidden). Chỉ vẽ lại khi khối trong khung nhìn; giảm chuyển động thì vẽ một khung tĩnh.
// Khối cha cần `relative isolate overflow-hidden` để canvas (z âm) nằm trên nền khối và dưới chữ.
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
      const radius = w * RADIUS_PER_WIDTH;
      const cap = Math.min(h * CAP_HEIGHT_PER_SECTION, radius * CAP_MAX_PER_RADIUS);
      const cy = h - cap + radius; // tâm cầu nằm dưới đáy khối, chỉ một chỏm cầu nhô lên
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
        const depth = Math.min(Math.max(z2, 0) * DEPTH_GAIN, 1); // chỏm cầu chỉ thấy phần rìa (z thấp) nên khuếch đại độ sâu
        ctx.fillStyle = `rgba(30,124,255,${0.3 + 0.65 * depth})`;
        ctx.beginPath();
        ctx.arc(cx + x1 * radius, cy - y2 * radius, 1 + 2.2 * depth, 0, Math.PI * 2);
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
