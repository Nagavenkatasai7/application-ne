import { db, resumes, eq, and } from "@resume-maker/db";
import { auth } from "@resume-maker/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@resume-maker/api-utils";

/**
 * GET /api/resumes/:id - Get a specific resume
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    if (!resume) {
      return notFoundResponse("Resume");
    }

    return successResponse(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    return errorResponse("FETCH_ERROR", "Failed to fetch resume");
  }
}

/**
 * PATCH /api/resumes/:id - Update a resume
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Verify ownership
    const [existing] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    if (!existing) {
      return notFoundResponse("Resume");
    }

    await db
      .update(resumes)
      .set({
        name: body.name ?? existing.name,
        content: body.content ?? existing.content,
        templateId: body.templateId ?? existing.templateId,
        isMaster: body.isMaster ?? existing.isMaster,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id));

    const [updatedResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id));

    return successResponse(updatedResume);
  } catch (error) {
    console.error("Error updating resume:", error);
    return errorResponse("UPDATE_ERROR", "Failed to update resume");
  }
}

/**
 * DELETE /api/resumes/:id - Delete a resume
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    if (!existing) {
      return notFoundResponse("Resume");
    }

    await db.delete(resumes).where(eq(resumes.id, id));

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return errorResponse("DELETE_ERROR", "Failed to delete resume");
  }
}
