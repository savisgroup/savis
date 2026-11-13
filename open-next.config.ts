import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Chưa cấu hình incremental cache (R2/KV): ISR `revalidate` chưa hoạt động trên Workers.
// Xem README, mục Triển khai Cloudflare.
export default defineCloudflareConfig();
