import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `npm run build` chạy OpenNext (lệnh Build của Workers Builds, dùng cho mọi nhánh).
// OpenNext tự gọi lại script build, nên trỏ nó sang `build:next` để không lặp vô hạn.
// Chưa cấu hình incremental cache (R2/KV): ISR `revalidate` chưa hoạt động trên Workers (xem README).
const config = {
  ...defineCloudflareConfig(),
  buildCommand: "npm run build:next",
};

export default config;
