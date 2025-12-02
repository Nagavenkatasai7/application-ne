/**
 * NextAuth.js API Route Handler
 *
 * Re-exports the handlers from the @resume-maker/auth package.
 */

import { handlers } from "@resume-maker/auth";

export const { GET, POST } = handlers;
