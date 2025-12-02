/**
 * @resume-maker/auth - Auth Middleware
 *
 * Middleware utilities for protecting routes across zones.
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication middleware for protecting routes
 * Redirects unauthenticated users to login page
 */
export async function withAuth(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Check if a request has a valid session token
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  return !!token;
}

/**
 * Get the user ID from the session token
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  return token?.sub || null;
}

/**
 * Public paths that don't require authentication
 */
export const publicPaths = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/verify-request",
  "/auth/auth-error",
  "/api/auth",
];

/**
 * Check if a path is public (doesn't require authentication)
 */
export function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => {
    if (path.endsWith("*")) {
      return pathname.startsWith(path.slice(0, -1));
    }
    return pathname === path || pathname.startsWith(path + "/");
  });
}
