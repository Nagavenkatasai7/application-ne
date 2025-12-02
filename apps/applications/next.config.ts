import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: [
    "@resume-maker/ui",
    "@resume-maker/db",
    "@resume-maker/auth",
    "@resume-maker/api-utils",
    "@resume-maker/types",
  ],
  turbopack: {},
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
