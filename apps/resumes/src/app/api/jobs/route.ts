import { auth } from "@resume-maker/auth";
import { successWithMeta, unauthorizedResponse } from "@resume-maker/api-utils";

/**
 * GET /api/jobs - Stub endpoint for dashboard stats
 * Returns empty list - jobs are managed by the jobs zone
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  // Return empty list - actual jobs are in the jobs zone
  return successWithMeta([], { total: 0, limit: 50, offset: 0 });
}
