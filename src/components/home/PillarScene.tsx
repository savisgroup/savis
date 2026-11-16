import { InView } from "@/components/ui/InView";
import { cn } from "@/lib/utils";

// Cảnh minh hoạ SVG thay ảnh stock cho 5 trụ cột (hình trang trí, aria-hidden). Chuyển động là CSS (xem `.sc-*` trong globals.css),
// chỉ chạy khi cảnh nằm trong khung nhìn; giảm chuyển động thì hiện tĩnh ở trạng thái hoàn chỉnh. Khung, viền cyan, bóng khi rê chuột
// (hover do class `group/pillar` ở hàng cha).
export type SceneKind = "identity" | "cyber" | "gov" | "finance" | "data";

export function PillarScene({ kind, className }: { kind: SceneKind; className?: string }) {
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
        {SCENES[kind]}
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

// Cảnh Chính phủ số: toà nhà cơ quan nhà nước giữa đường chân trời, tín hiệu toả lên các nút thành phố thông minh (camera, kiosk, ứng dụng).
function Gov() {
  const windows = (x: number, y: number, cols: number, rows: number, seed: number) =>
    Array.from({ length: cols * rows }, (_, i) => (
      <rect key={`${x}-${y}-${i}`} className="sc-twinkle" x={x + (i % cols) * 14} y={y + Math.floor(i / cols) * 16} width="7" height="9" rx="1.5" fill={CYAN} fillOpacity="0.6" style={{ animationDelay: `${((i * 7 + seed) % 11) * 0.3}s` }} />
    ));
  const nodes = [{ x: 78, y: 70 }, { x: 200, y: 42 }, { x: 322, y: 72 }];
  return (
    <>
      <line x1="0" y1="250" x2="400" y2="250" stroke={CYAN} strokeOpacity="0.3" />
      <g fill="#0b2a66" stroke={CYAN} strokeOpacity="0.4">
        <rect x="26" y="158" width="62" height="92" rx="3" />
        <rect x="94" y="196" width="44" height="54" rx="3" />
        <rect x="268" y="142" width="62" height="108" rx="3" />
        <rect x="336" y="190" width="40" height="60" rx="3" />
      </g>
      {windows(36, 170, 4, 4, 1)}
      {windows(102, 208, 3, 2, 5)}
      {windows(278, 154, 4, 5, 3)}
      {windows(344, 202, 2, 3, 8)}
      <g>
        <path d="M148 152L200 114L252 152Z" fill="#0b2a66" stroke={CYAN} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="200" cy="138" r="4.5" fill={CYAN} />
        <rect x="146" y="152" width="108" height="8" rx="2" fill="#13306f" stroke={CYAN} strokeOpacity="0.7" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={156 + i * 20} y="160" width="9" height="76" rx="2" fill={CYAN} fillOpacity="0.55" />)}
        <rect x="140" y="236" width="120" height="7" rx="2" fill="#13306f" stroke={CYAN} strokeOpacity="0.6" />
        <rect x="132" y="243" width="136" height="7" rx="2" fill="#13306f" stroke={CYAN} strokeOpacity="0.5" />
      </g>
      {nodes.map((n, i) => {
        const d = `M200 114L${n.x} ${n.y}`;
        return (
          <g key={i}>
            <path className="sc-flow" d={d} fill="none" stroke={CYAN} strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round" />
            <circle className="sc-travel" r="3.6" fill="#fff" style={{ offsetPath: `path("${d}")`, animationDelay: `${i * 0.8}s` }} />
            <circle className="sc-ping" cx={n.x} cy={n.y} r="8" fill="none" stroke={CYAN} strokeWidth="1.5" style={{ animationDelay: `${i * 0.7}s` }} />
            <circle cx={n.x} cy={n.y} r="8" fill="#13306f" stroke={CYAN} strokeWidth="1.8" />
            <circle cx={n.x} cy={n.y} r="3" fill={CYAN} />
          </g>
        );
      })}
    </>
  );
}

// Cảnh Tài chính mở: ngân hàng và ví số trao đổi hai chiều qua lớp bảo mật (khoá), giao dịch hoàn tất hiện dấu tích.
function Finance() {
  const bankPath = "M126 168H274";
  return (
    <>
      <g transform="translate(78 170)">
        <circle r="46" fill="#0b2a66" stroke={CYAN} strokeOpacity="0.45" />
        <path d="M-26 -8L0 -28L26 -8Z" fill="none" stroke={CYAN} strokeWidth="2.4" strokeLinejoin="round" />
        {[-17, -6, 5, 16].map((x) => <rect key={x} x={x - 2.5} y="-5" width="5" height="22" rx="1.5" fill={CYAN} fillOpacity="0.8" />)}
        <rect x="-28" y="19" width="56" height="5" rx="2" fill={CYAN} />
      </g>
      <g transform="translate(322 170)">
        <circle r="46" fill="#0b2a66" stroke={CYAN} strokeOpacity="0.45" />
        <rect x="-18" y="-30" width="36" height="60" rx="8" fill="#13306f" stroke={CYAN} strokeWidth="2" />
        <rect x="-11" y="-20" width="22" height="14" rx="3" fill={CYAN} fillOpacity="0.7" />
        <rect x="-11" y="-1" width="22" height="4" rx="2" fill="#fff" fillOpacity="0.5" />
        <rect x="-11" y="8" width="14" height="4" rx="2" fill="#fff" fillOpacity="0.3" />
        <circle cx="0" cy="22" r="2.4" fill={CYAN} />
      </g>
      <path className="sc-flow" d={bankPath} fill="none" stroke={CYAN} strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <path className="sc-flow" d="M274 188H126" fill="none" stroke={CYAN} strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" style={{ animationDirection: "reverse" }} />
      <circle className="sc-travel" r="5" fill="#fff" style={{ offsetPath: `path("${bankPath}")`, animationDuration: "2.2s" }} />
      <circle className="sc-travel" r="5" fill="#fff" style={{ offsetPath: `path("${bankPath}")`, animationDuration: "2.2s", animationDelay: "1.1s" }} />
      <g className="sc-glow" transform="translate(200 168)">
        <path d="M0 -26L20 -18V2C20 16 9 24 0 28C-9 24 -20 16 -20 2V-18Z" fill="#0b1f4d" stroke={CYAN} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="-7" y="-4" width="14" height="11" rx="2.5" fill={CYAN} />
        <path d="M-4 -4v-4a4 4 0 0 1 8 0v4" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="translate(150 52)">
        <rect width="100" height="62" rx="9" fill="#13306f" stroke={CYAN} strokeOpacity="0.6" />
        <rect y="14" width="100" height="10" fill="#0b1f4d" />
        <rect x="12" y="34" width="22" height="16" rx="3.5" fill={CYAN} fillOpacity="0.8" />
        <rect x="46" y="38" width="42" height="5" rx="2.5" fill="#fff" fillOpacity="0.45" />
        <rect x="46" y="47" width="28" height="5" rx="2.5" fill="#fff" fillOpacity="0.25" />
      </g>
      <g className="sc-pop" transform="translate(200 238)">
        <circle r="15" fill="#19c37d" />
        <path d="M-6 1l4 5 9-11" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

// Cảnh Dữ liệu và AI: tài liệu được số hoá (OCR sáng từng dòng) chảy vào kho dữ liệu, các tầng sáng lần lượt khi xử lý, rồi kết quả
// đi ra đám mây và ba nút phân tích bên dưới (điểm sáng chạy theo hướng dữ liệu, nút nhận xung khi điểm sáng tới).
function Data() {
  const inPath = "M108 128H152";
  const outPath = "M248 128H292";
  const dividers = [146, 182]; // hai mép tầng giữa nắp (110) và đáy (218), cách đều 36
  const outs = [[96, 250], [200, 270], [304, 250]];
  return (
    <>
      <g transform="translate(42 86)">
        <rect width="66" height="88" rx="7" fill="#0b2a66" stroke={CYAN} strokeOpacity="0.55" />
        <path d="M44 0L66 22H44Z" fill="#13306f" stroke={CYAN} strokeOpacity="0.55" />
        {[22, 34, 46, 58, 70].map((y, i) => (
          <rect key={y} className="sc-line" x="9" y={y} width={i % 2 ? 36 : 46} height="5" rx="2.5" fill={CYAN} style={{ animationDelay: `${i * 0.45}s` }} />
        ))}
      </g>
      <path className="sc-flow" d={inPath} fill="none" stroke={CYAN} strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
      <circle className="sc-travel" r="3.6" fill="#fff" style={{ offsetPath: `path("${inPath}")` }} />
      <g>
        <rect x="154" y="110" width="92" height="108" fill="#0b2a66" />
        <line x1="154" y1="110" x2="154" y2="218" stroke={CYAN} strokeOpacity="0.6" />
        <line x1="246" y1="110" x2="246" y2="218" stroke={CYAN} strokeOpacity="0.6" />
        {dividers.map((y, i) => <path key={y} className="sc-layer" d={`M154 ${y}a46 12 0 0 0 92 0`} fill="none" stroke={CYAN} strokeWidth="2" style={{ animationDelay: `${0.4 + i * 0.5}s` }} />)}
        <path d="M154 218a46 12 0 0 0 92 0" fill="none" stroke={CYAN} strokeWidth="2" />
        <ellipse cx="200" cy="110" rx="46" ry="12" fill="#13306f" stroke={CYAN} strokeWidth="2" />
        <ellipse className="sc-glow" cx="200" cy="110" rx="20" ry="4.5" fill={CYAN} fillOpacity="0.5" />
      </g>
      <path className="sc-flow" d={outPath} fill="none" stroke={CYAN} strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
      <circle className="sc-travel" r="3.6" fill="#fff" style={{ offsetPath: `path("${outPath}")`, animationDelay: "1.3s" }} />
      <g transform="translate(298 98)">
        <path d="M6 44a13 13 0 0 1 4-25a18 18 0 0 1 34-3a14 14 0 0 1 6 28Z" fill="#13306f" stroke={CYAN} strokeWidth="2" strokeLinejoin="round" />
        <circle className="sc-ping" cx="28" cy="32" r="6" fill="none" stroke={CYAN} strokeWidth="1.5" />
        <circle cx="28" cy="32" r="3.2" fill={CYAN} />
      </g>
      {outs.map(([x, y], i) => {
        const d = `M200 230L${x} ${y}`;
        return (
          <g key={i}>
            <path className="sc-flow" d={d} fill="none" stroke={CYAN} strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
            <circle className="sc-travel" r="3" fill="#fff" style={{ offsetPath: `path("${d}")`, animationDelay: `${1.3 + i * 0.4}s` }} />
            <circle className="sc-ping" cx={x} cy={y} r="6" fill="none" stroke={CYAN} strokeWidth="1.4" style={{ animationDelay: `${1.3 + i * 0.4 + 2.2}s` }} />
            <circle cx={x} cy={y} r="5" fill={CYAN} fillOpacity="0.9" />
          </g>
        );
      })}
    </>
  );
}

const SCENES: Record<SceneKind, React.ReactNode> = {
  identity: <Identity />,
  cyber: <Cyber />,
  gov: <Gov />,
  finance: <Finance />,
  data: <Data />,
};
