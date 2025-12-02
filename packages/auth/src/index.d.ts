/**
 * @resume-maker/auth - Type Declarations
 */

import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

// Re-export Session type augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

// NextAuth exports
export declare const handlers: {
  GET: (request: Request) => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
};

export declare function auth(): Promise<{
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
} | null>;

export declare function signIn(
  provider?: string,
  options?: { redirectTo?: string; redirect?: boolean }
): Promise<void>;

export declare function signOut(options?: {
  redirectTo?: string;
  redirect?: boolean;
}): Promise<void>;

// Password utilities re-exports
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean>;
export declare function generateSecurityCode(): string;
export declare function generateVerificationToken(): string;
export declare function getTokenExpiration(hours?: number): Date;
export declare function getSecurityCodeExpiration(): Date;
export declare function isTokenExpired(expirationDate: Date | null): boolean;

// Middleware utilities re-exports
export declare function withAuth(
  request: NextRequest
): Promise<NextResponse<unknown>>;
export declare function isAuthenticated(request: NextRequest): Promise<boolean>;
export declare function getUserId(request: NextRequest): Promise<string | null>;
export declare const publicPaths: string[];
export declare function isPublicPath(pathname: string): boolean;
