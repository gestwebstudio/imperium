import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
  // Картинки машин в будущем будут приходить внешними URL (со стороны клиента).
  // Домены добавим сюда, когда будет известен источник:
  // images: { remotePatterns: [{ protocol: "https", hostname: "..." }] },
};

export default nextConfig;
