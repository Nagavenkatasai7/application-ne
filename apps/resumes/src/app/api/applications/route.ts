import { auth } from "@resume-maker/auth";
import { successWithMeta, unauthorizedResponse } from "@resume-maker/api-utils";

/**
 * GET /api/applications - Stub endpoint for dashboard stats
 * Returns empty list - applications are managed by the applications zone
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  // Return empty list - actual applications are in the applications zone
  return successWithMeta([], { total: 0, limit: 50, offset: 0 });
}
