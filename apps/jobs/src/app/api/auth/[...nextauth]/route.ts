/**
 * NextAuth Route Handler
 *
 * Re-exports auth handlers from shared auth package.
 * This allows the jobs zone to share session state with other zones.
 */

import { handlers } from "@resume-maker/auth";

export const { GET, POST } = handlers;
