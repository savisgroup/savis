import type { NextConfig } from "next";
import { defaultLocale } from "./src/lib/i18n";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: `/${defaultLocale}`, permanent: false },
      // Tiếng Việt đang tắt (xem src/lib/i18n.ts): đưa đường dẫn /vi cũ về bản tiếng Anh tương ứng.
      { source: "/vi/:path*", destination: "/en/:path*", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
