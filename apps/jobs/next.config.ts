import type { NextConfig } from "next";

/**
 * Jobs Zone Configuration
 *
 * Handles job management and LinkedIn job search.
 * Runs on port 3003 in development.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  // Transpile monorepo packages to ensure React contexts work properly
  transpilePackages: [
    "@resume-maker/ui",
    "@resume-maker/db",
    "@resume-maker/auth",
    "@resume-maker/api-utils",
    "@resume-maker/types",
  ],

  // Turbopack config (Next.js 16 default bundler)
  turbopack: {
    // Turbopack handles most configurations automatically
  },

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

export default nextConfig;
