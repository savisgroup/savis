import { InView } from "@/components/ui/InView";
import { offices } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { MAP_HEIGHT, MAP_LAT_MAX, MAP_LAT_MIN, MAP_WIDTH, WORLD_DOTS_PATH } from "./world-dots";

// Vị trí các văn phòng theo đúng thứ tự mảng `offices` (site.ts): [vĩ độ, kinh độ]. Hoa Kỳ chưa có địa chỉ nên đặt ở tâm lục địa.
const COORDS: [number, number][] = [
  [21.03, 105.85], // Hà Nội (trụ sở)
  [10.78, 106.7], // TP.HCM
  [1.29, 103.85], // Singapore
  [14.6, 120.98], // Manila
  [-37.81, 144.96], // Melbourne
  [25.2, 55.27], // Dubai
  [9.07, 7.49], // Abuja
  [36.75, 3.06], // Algiers
  [-23.55, -46.63], // São Paulo
  [39.8, -98.6], // Hoa Kỳ
];

const project = ([lat, lng]: [number, number]) => ({
  x: ((lng + 180) / 360) * MAP_WIDTH,
  y: ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * MAP_HEIGHT,
});

const ARC_LIFT = 0.28; // độ cong của cung nối, theo tỷ lệ khoảng cách
const MAX_LIFT = 120;
// Cung nối bắt đầu vẽ sau nhịp này, mỗi cung cách nhau ARC_STEP_S giây.
const ARC_START_S = 0.3;
const ARC_STEP_S = 0.22;

// Bản đồ chấm với 10 văn phòng: xung sáng ở mỗi điểm, cung nối từ trụ sở Hà Nội ra các văn phòng xa (vẽ dần khi vào khung nhìn).
// Hình trang trí; thông tin văn phòng đầy đủ nằm ở danh sách thẻ bên dưới. Giảm chuyển động: hiện tĩnh, đủ cung và điểm.
export function PresenceMap({ locale }: { locale: Locale }) {
  if (COORDS.length !== offices.length) throw new Error("PresenceMap: COORDS phải khớp offices");
  const pts = COORDS.map(project);
  const hq = pts[0];
  const far = pts.map((p, i) => ({ p, i })).filter(({ i }) => i > 1); // TP.HCM quá gần Hà Nội để vẽ cung

  return (
    <InView rootMargin="-10% 0px" className="presence-map on-band overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_40%,#13306f_0%,var(--band)_55%,var(--band-2)_100%)] p-3 text-on-band sm:p-6">
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden className="block h-auto w-full">
        <path d={WORLD_DOTS_PATH} fill="none" stroke="#6fe3ff" strokeOpacity={0.34} strokeWidth={3} strokeLinecap="round" />
        {far.map(({ p, i }, k) => {
          const dx = p.x - hq.x;
          const lift = Math.min(MAX_LIFT, Math.abs(dx) * ARC_LIFT);
          const d = `M${hq.x.toFixed(1)} ${hq.y.toFixed(1)}Q${((hq.x + p.x) / 2).toFixed(1)} ${(Math.min(hq.y, p.y) - lift).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          const delay = `${ARC_START_S + k * ARC_STEP_S}s`;
          return (
            <g key={i}>
              <path d={d} pathLength={1} className="map-arc" style={{ animationDelay: delay }} fill="none" stroke="#6fe3ff" strokeWidth={1.6} strokeLinecap="round" />
              <circle r={3.4} className="map-travel" style={{ offsetPath: `path("${d}")`, animationDelay: `${ARC_START_S + k * 0.55}s` }} fill="#fff" />
            </g>
          );
        })}
        {pts.map((p, i) => {
          const isHq = i === 0;
          return (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              <title>{offices[i].name[locale]}</title>
              <circle r={isHq ? 6 : 4} className="map-ping" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} fill="none" stroke="#6fe3ff" strokeWidth={2} />
              <circle r={isHq ? 6 : 4} className="map-ping" style={{ animationDelay: `${((i * 0.37) % 2.4) + 1.2}s` }} fill="none" stroke="#6fe3ff" strokeWidth={2} />
              <circle r={isHq ? 6.5 : 4.4} fill={isHq ? "#ffffff" : "#6fe3ff"} />
              {isHq && <text x={12} y={-10} fill="#ffffff" fontSize={15} fontWeight={700}>{offices[0].name[locale]} · HQ</text>}
            </g>
          );
        })}
      </svg>
    </InView>
  );
}
