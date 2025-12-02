/**
 * @resume-maker/api-utils - Rate Limiting Configuration
 *
 * Uses Upstash Redis for production rate limiting.
 * Falls back to in-memory storage for development.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis is configured
function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// In-memory storage for development (per-instance, resets on restart)
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

/**
 * In-memory rate limiter result type
 */
type InMemoryLimiterResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

/**
 * In-memory rate limiter type
 */
type InMemoryLimiter = {
  limit: (identifier: string) => Promise<InMemoryLimiterResult>;
};

/**
 * Simple in-memory rate limiter for development
 */
function createInMemoryLimiter(
  limit: number,
  windowMs: number
): InMemoryLimiter {
  return {
    limit: async (identifier: string): Promise<InMemoryLimiterResult> => {
      const now = Date.now();
      const record = inMemoryStore.get(identifier);

      if (!record || now >= record.resetTime) {
        inMemoryStore.set(identifier, {
          count: 1,
          resetTime: now + windowMs,
        });
        return {
          success: true,
          remaining: limit - 1,
          reset: now + windowMs,
        };
      }

      if (record.count >= limit) {
        return {
          success: false,
          remaining: 0,
          reset: record.resetTime,
        };
      }

      record.count++;
      return {
        success: true,
        remaining: limit - record.count,
        reset: record.resetTime,
      };
    },
  };
}

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  // API: 100 requests per minute per IP
  api: { limit: 100, window: "1m" as const, windowMs: 60 * 1000 },
  // Upload: 10 requests per minute (expensive operation)
  upload: { limit: 10, window: "1m" as const, windowMs: 60 * 1000 },
  // AI: 20 requests per minute (expensive)
  ai: { limit: 20, window: "1m" as const, windowMs: 60 * 1000 },
  // Auth: 5 requests per minute (prevent brute force)
  auth: { limit: 5, window: "1m" as const, windowMs: 60 * 1000 },
  // Search: 30 requests per minute
  search: { limit: 30, window: "1m" as const, windowMs: 60 * 1000 },
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Rate limit result
 */
export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

// Lazy-initialized rate limiters
let rateLimiters: Record<RateLimitType, InMemoryLimiter | Ratelimit> | null =
  null;

/**
 * Initialize rate limiters based on environment
 */
function getRateLimiters(): Record<RateLimitType, InMemoryLimiter | Ratelimit> {
  if (rateLimiters) {
    return rateLimiters;
  }

  rateLimiters = {} as Record<RateLimitType, InMemoryLimiter | Ratelimit>;

  if (isUpstashConfigured()) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    for (const [key, config] of Object.entries(RATE_LIMITS)) {
      rateLimiters[key as RateLimitType] = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.limit, config.window),
        analytics: true,
        prefix: `ratelimit:${key}`,
      });
    }
  } else {
    // Development fallback
    for (const [key, config] of Object.entries(RATE_LIMITS)) {
      rateLimiters[key as RateLimitType] = createInMemoryLimiter(
        config.limit,
        config.windowMs
      );
    }
  }

  return rateLimiters;
}

/**
 * Check rate limit for a given identifier and type
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = "api"
): Promise<RateLimitResult> {
  const limiters = getRateLimiters();
  const limiter = limiters[type];
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Get client identifier from request (IP-based)
 */
export function getClientIdentifier(request: Request): string {
  // Try various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  // Use the first IP from x-forwarded-for, or fall back to others
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    "anonymous";

  return ip;
}

/**
 * Create a rate-limited middleware wrapper
 * Returns null if rate limit passed, or an error response if exceeded
 */
export async function withRateLimit(
  request: Request,
  type: RateLimitType = "api"
): Promise<RateLimitResult & { identifier: string }> {
  const identifier = getClientIdentifier(request);
  const result = await checkRateLimit(identifier, type);
  return { ...result, identifier };
}

/**
 * Clear in-memory rate limit store (for testing)
 */
export function clearRateLimitStore(): void {
  inMemoryStore.clear();
}
