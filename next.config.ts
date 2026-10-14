import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const imageHost = new URL(API_URL);

const nextConfig: NextConfig = {
  images: {
    // Static list so production builds work regardless of which
    // NEXT_PUBLIC_API_URL value was present at build time.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin-devtrend.vercel.app",
        pathname: "/uploads/**",
      },
      {
        protocol: imageHost.protocol.slice(0, -1) as "http" | "https",
        hostname: imageHost.hostname,
        port: imageHost.port,
        pathname: "/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
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
