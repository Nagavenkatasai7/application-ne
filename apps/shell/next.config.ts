import type { NextConfig } from "next";

/**
 * Shell Zone - Main Entry Point
 *
 * Routes requests to appropriate zones via rewrites:
 * - Auth zone: /login, /register, /forgot-password, /reset-password, /verify-email
 * - Resumes zone: /resumes/*, /dashboard/*
 * - Jobs zone: /jobs/*, /search/*
 * - Modules zone: /modules/*
 * - Applications zone: /applications/*
 */
const nextConfig: NextConfig = {
  // Enable production optimizations
  reactStrictMode: true,

  // Standalone output for Docker deployment
  output: "standalone",

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Multi-Zones rewrites
  async rewrites() {
    const authZone = process.env.AUTH_ZONE_URL || "http://localhost:3001";
    const resumesZone = process.env.RESUMES_ZONE_URL || "http://localhost:3002";
    const jobsZone = process.env.JOBS_ZONE_URL || "http://localhost:3003";
    const modulesZone = process.env.MODULES_ZONE_URL || "http://localhost:3004";
    const applicationsZone = process.env.APPLICATIONS_ZONE_URL || "http://localhost:3005";

    return {
      beforeFiles: [
        // Auth zone routes
        {
          source: "/login",
          destination: `${authZone}/login`,
        },
        {
          source: "/register",
          destination: `${authZone}/register`,
        },
        {
          source: "/forgot-password",
          destination: `${authZone}/forgot-password`,
        },
        {
          source: "/reset-password",
          destination: `${authZone}/reset-password`,
        },
        {
          source: "/verify-email",
          destination: `${authZone}/verify-email`,
        },
        {
          source: "/verify-request",
          destination: `${authZone}/verify-request`,
        },
        {
          source: "/auth-error",
          destination: `${authZone}/auth-error`,
        },
        // Auth API routes
        {
          source: "/api/auth/:path*",
          destination: `${authZone}/api/auth/:path*`,
        },

        // Resumes zone routes
        {
          source: "/dashboard/:path*",
          destination: `${resumesZone}/dashboard/:path*`,
        },
        {
          source: "/resumes/:path*",
          destination: `${resumesZone}/resumes/:path*`,
        },
        {
          source: "/profile/:path*",
          destination: `${resumesZone}/profile/:path*`,
        },
        {
          source: "/settings/:path*",
          destination: `${resumesZone}/settings/:path*`,
        },
        // Resumes API routes
        {
          source: "/api/resumes/:path*",
          destination: `${resumesZone}/api/resumes/:path*`,
        },
        {
          source: "/api/users/:path*",
          destination: `${resumesZone}/api/users/:path*`,
        },

        // Jobs zone routes
        {
          source: "/jobs/:path*",
          destination: `${jobsZone}/jobs/:path*`,
        },
        {
          source: "/search/:path*",
          destination: `${jobsZone}/search/:path*`,
        },
        // Jobs API routes
        {
          source: "/api/jobs/:path*",
          destination: `${jobsZone}/api/jobs/:path*`,
        },
        {
          source: "/api/linkedin/:path*",
          destination: `${jobsZone}/api/linkedin/:path*`,
        },

        // Modules zone routes
        {
          source: "/modules/:path*",
          destination: `${modulesZone}/modules/:path*`,
        },
        // Modules API routes
        {
          source: "/api/modules/:path*",
          destination: `${modulesZone}/api/modules/:path*`,
        },

        // Applications zone routes
        {
          source: "/applications/:path*",
          destination: `${applicationsZone}/applications/:path*`,
        },
        // Applications API routes
        {
          source: "/api/applications/:path*",
          destination: `${applicationsZone}/api/applications/:path*`,
        },
      ],
    };
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Powered by header removal for security
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Production source maps (can be disabled for better performance)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
