// Sinh bản đồ thế giới dạng lưới chấm cho khối "Global presence" (src/components/home/world-dots.ts).
// Không thêm dependency vào dự án: chạy trong thư mục tạm đã cài d3-geo, topojson-client, world-atlas:
//   mkdir map-tmp && cd map-tmp && npm init -y && npm i d3-geo@3 topojson-client@3 world-atlas@2
//   cp <repo>/scripts/map/build-world-dots.mjs . && node build-world-dots.mjs <repo>/src/components/home/world-dots.ts
// Phép chiếu equirectangular, cắt vĩ độ từ LAT_MAX xuống LAT_MIN (bỏ Nam Cực). Land: Natural Earth 110m qua world-atlas.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topology = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topology, topology.objects.land);

const LAT_MAX = 78;
const LAT_MIN = -58;
const STEP_DEG = 2.4;
const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (LAT_MAX - LAT_MIN)) / 360);
const unit = (WIDTH / 360) * STEP_DEG;

const points = [];
for (let lat = LAT_MAX - STEP_DEG / 2; lat > LAT_MIN; lat -= STEP_DEG) {
  for (let lon = -180 + STEP_DEG / 2; lon < 180; lon += STEP_DEG) {
    if (geoContains(land, [lon, lat])) {
      const x = ((lon + 180) / 360) * WIDTH;
      const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * HEIGHT;
      points.push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`);
    }
  }
}

const out = `// Tệp sinh tự động bởi scripts/map/build-world-dots.mjs, không sửa tay.
// Lưới chấm đất liền (${points.length} chấm, bước ${STEP_DEG}°), phép chiếu equirectangular, vĩ độ ${LAT_MAX}° đến ${LAT_MIN}°.
export const MAP_WIDTH = ${WIDTH};
export const MAP_HEIGHT = ${HEIGHT};
export const MAP_LAT_MAX = ${LAT_MAX};
export const MAP_LAT_MIN = ${LAT_MIN};
export const MAP_DOT_UNIT = ${unit.toFixed(2)};
export const WORLD_DOTS_PATH = "${points.join("")}";
`;
writeFileSync(process.argv[2], out);
console.log(points.length, "chấm,", out.length, "byte");
