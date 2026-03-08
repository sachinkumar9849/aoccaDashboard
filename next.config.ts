import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    // turbopack is not experimental in Next 16
  },
  turbopack: {} // put it at root level per next 16 docs
};

export default nextConfig;
