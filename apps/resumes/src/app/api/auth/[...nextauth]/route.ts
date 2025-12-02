/**
 * NextAuth.js API Route
 *
 * This route handles authentication via the shared @resume-maker/auth package.
 * Sessions are shared across all zones using the same cookie configuration.
 */

import { handlers } from "@resume-maker/auth";

export const { GET, POST } = handlers;
