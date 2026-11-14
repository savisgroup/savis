import type { NextConfig } from "next";
import { defaultLocale } from "./src/lib/i18n";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: `/${defaultLocale}`, permanent: false }];
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
