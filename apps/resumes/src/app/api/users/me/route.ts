import { db, users, eq } from "@resume-maker/db";
import { auth } from "@resume-maker/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@resume-maker/api-utils";

/**
 * GET /api/users/me - Get current user info
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return unauthorizedResponse();
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("FETCH_ERROR", "Failed to fetch user");
  }
}
