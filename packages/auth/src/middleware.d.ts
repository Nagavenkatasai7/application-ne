/**
 * @resume-maker/auth/middleware - Type Declarations
 */

import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

/**
 * Authentication middleware for protecting routes
 * Redirects unauthenticated users to login page
 */
export declare function withAuth(
  request: NextRequest
): Promise<NextResponse<unknown>>;

/**
 * Check if a request has a valid session token
 */
export declare function isAuthenticated(request: NextRequest): Promise<boolean>;

/**
 * Get the user ID from the session token
 */
export declare function getUserId(request: NextRequest): Promise<string | null>;

/**
 * Public paths that don't require authentication
 */
export declare const publicPaths: string[];

/**
 * Check if a path is public (doesn't require authentication)
 */
export declare function isPublicPath(pathname: string): boolean;
