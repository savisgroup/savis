import { InView } from "@/components/ui/InView";
import { cn } from "@/lib/utils";

// Cảnh minh hoạ SVG thay ảnh stock cho hai trụ cột lõi (hình trang trí, aria-hidden). Chuyển động là CSS (xem `.sc-*` trong globals.css),
// chỉ chạy khi cảnh nằm trong khung nhìn; giảm chuyển động thì hiện tĩnh ở trạng thái hoàn chỉnh. Khung, viền cyan, bóng khi rê chuột
// giống PillarImage (class `group/pillar` ở hàng cha).
export function PillarScene({ kind, className }: { kind: "identity" | "cyber"; className?: string }) {
  return (
    <InView rootMargin="-8% 0px" className={cn("scene relative aspect-[4/3] overflow-hidden rounded-lg bg-band ring-1 ring-transparent transition-[box-shadow] duration-500 ease-out group-hover/pillar:shadow-[0_24px_48px_-12px_rgba(0,64,199,.45)] group-hover/pillar:ring-on-band-accent/70", className)}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={`${kind}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#13306f" />
            <stop offset="1" stopColor="#081638" />
          </linearGradient>
          <linearGradient id={`${kind}-scanline`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fe3ff" stopOpacity="0" />
            <stop offset="0.85" stopColor="#6fe3ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6fe3ff" stopOpacity="0.9" />
          </linearGradient>
          <pattern id={`${kind}-grid`} width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M25 0H0V25" fill="none" stroke="#6fe3ff" strokeOpacity="0.07" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#${kind}-bg)`} />
        <rect width="400" height="300" fill={`url(#${kind}-grid)`} />
        {kind === "identity" ? <Identity /> : <Cyber />}
      </svg>
    </InView>
  );
}

const CYAN = "#6fe3ff";

// Thẻ căn cước được quét, vân tay vẽ dần, dấu "đã xác minh" bật ra: xác minh danh tính từ giấy tờ tới sinh trắc.
function Identity() {
  const ridges = ["M-9 22V0a9 9 0 0 1 18 0v26", "M-19 24V0a19 19 0 0 1 38 0v18", "M-29 16V0a29 29 0 0 1 58 0v10", "M-39 6V0a39 39 0 0 1 78 0v-4"];
  return (
    <>
      <g transform="translate(44 86)">
        <clipPath id="identity-card-clip"><rect width="196" height="128" rx="14" /></clipPath>
        <rect width="196" height="128" rx="14" fill="#0b2a66" stroke={CYAN} strokeOpacity="0.45" />
        <rect x="16" y="18" width="50" height="62" rx="8" fill="#13306f" />
        <circle cx="41" cy="40" r="11" fill={CYAN} fillOpacity="0.55" />
        <path d="M22 76q19-26 38 0z" fill={CYAN} fillOpacity="0.55" />
        <rect x="80" y="22" width="98" height="8" rx="4" fill="#fff" fillOpacity="0.5" />
        <rect x="80" y="40" width="70" height="8" rx="4" fill="#fff" fillOpacity="0.3" />
        <rect x="80" y="58" width="84" height="8" rx="4" fill="#fff" fillOpacity="0.3" />
        <rect x="16" y="92" width="30" height="22" rx="5" fill="none" stroke={CYAN} strokeOpacity="0.6" />
        <rect x="58" y="98" width="120" height="5" rx="2.5" fill="#fff" fillOpacity="0.22" />
        <rect x="58" y="108" width="100" height="5" rx="2.5" fill="#fff" fillOpacity="0.22" />
        <g clipPath="url(#identity-card-clip)"><rect className="sc-scan" x="0" y="0" width="196" height="30" fill="url(#identity-scanline)" /></g>
      </g>
      <path className="sc-flow" d="M246 150H276" stroke={CYAN} strokeWidth="2" strokeLinecap="round" fill="none" />
      <g transform="translate(322 158)">
        <circle r="58" fill="none" stroke={CYAN} strokeOpacity="0.25" />
        {ridges.map((d, i) => (
          <path key={d} className="sc-draw" pathLength={1} d={d} style={{ animationDelay: `${i * 0.25}s` }} fill="none" stroke={CYAN} strokeWidth="3.4" strokeLinecap="round" />
        ))}
      </g>
      <g className="sc-pop" transform="translate(322 78)">
        <circle r="19" fill="#19c37d" />
        <path d="M-8 1l5 6 11-13" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

// Khiên bảo vệ giữa hai vòng lưới (lattice) quay ngược chiều, xung lan ra: mật mã an toàn lượng tử.
function Cyber() {
  const ring = (r: number, n: number, offset = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i / n) * 360 + offset) * (Math.PI / 180);
      return { x: 200 + r * Math.cos(a), y: 150 + r * Math.sin(a) };
    });
  const inner = ring(96, 6);
  const outer = ring(128, 9, 20);
  const poly = inner.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <>
      <circle className="sc-ping" cx="200" cy="150" r="46" fill="none" stroke={CYAN} strokeWidth="1.5" />
      <circle className="sc-ping" cx="200" cy="150" r="46" fill="none" stroke={CYAN} strokeWidth="1.5" style={{ animationDelay: "1.4s" }} />
      <g className="sc-orbit">
        <circle cx="200" cy="150" r="96" fill="none" stroke={CYAN} strokeOpacity="0.18" strokeDasharray="3 5" />
        <polygon points={poly} fill="none" stroke={CYAN} strokeOpacity="0.35" />
        {inner.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={CYAN} />)}
        {inner.map((p, i) => <line key={`l${i}`} x1={p.x} y1={p.y} x2="200" y2="150" stroke={CYAN} strokeOpacity="0.12" />)}
      </g>
      <g className="sc-orbit-rev">
        <circle cx="200" cy="150" r="128" fill="none" stroke={CYAN} strokeOpacity="0.14" />
        {outer.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i % 3 === 0 ? 3.6 : 2.2} fill={CYAN} fillOpacity={i % 3 === 0 ? 1 : 0.6} />)}
      </g>
      <path className="sc-glow" d="M200 82L246 100V146C246 182 222 204 200 214C178 204 154 182 154 146V100Z" fill={CYAN} fillOpacity="0.14" stroke={CYAN} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="186" y="140" width="28" height="24" rx="4.5" fill={CYAN} />
      <path d="M191 140v-8a9 9 0 0 1 18 0v8" fill="none" stroke={CYAN} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="200" cy="151" r="3" fill="#0b1f4d" />
    </>
  );
}
