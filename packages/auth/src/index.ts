/**
 * @resume-maker/auth - Main Entry Point
 *
 * NextAuth.js configuration for Multi-Zones with shared sessions.
 */

import NextAuth, { type NextAuthResult } from "next-auth";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db, users, accounts, sessions, verificationTokens } from "@resume-maker/db";
import { loginWithPasswordSchema } from "@resume-maker/types";
import { verifyPassword } from "./password";

// Re-export password utilities
export * from "./password";

// Re-export middleware utilities
export * from "./middleware";

/**
 * Shared cookie configuration for Multi-Zones
 * Sessions are shared across all subdomains using the root domain cookie
 */
const getCookieConfig = () => ({
  sessionToken: {
    name: "resume-maker.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      // Share across all subdomains (e.g., .resume-maker.vercel.app)
      domain: process.env.COOKIE_DOMAIN || undefined,
    },
  },
});

/**
 * NextAuth.js configuration
 * Supports both Magic Link (Resend) and Password (Credentials) authentication
 */
const nextAuth: NextAuthResult = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    // Magic link provider (passwordless email)
    Resend({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    }),

    // Password-based authentication
    Credentials({
      id: "credentials",
      name: "Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        const parsed = loginWithPasswordSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });

        // User not found or no password set (magic-link-only user)
        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          return null;
        }

        // Check if email is verified (required for password users)
        if (!user.emailVerified) {
          // Throw a specific error to be handled by the client
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/auth-error",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: getCookieConfig(),
  callbacks: {
    session: async ({ session, user }) => {
      // Include user.id in session for API routes
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

// Export the NextAuth result with explicit types
export const handlers: NextAuthResult["handlers"] = nextAuth.handlers;
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut;

// Type augmentation for session.user.id
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
