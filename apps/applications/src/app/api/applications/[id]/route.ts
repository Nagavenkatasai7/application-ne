import { NextRequest } from "next/server";
import { db, applications, eq, and } from "@resume-maker/db";
import { auth } from "@resume-maker/auth";
import { errorResponse, successResponse, notFoundResponse } from "@resume-maker/api-utils";
import { updateApplicationSchema } from "@/lib/validations/application";

// GET /api/applications/:id - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("UNAUTHORIZED", "You must be logged in", 401);
    }
    const userId = session.user.id;

    const [application] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    if (!application) {
      return notFoundResponse("Application");
    }

    return successResponse(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return errorResponse("FETCH_ERROR", "Failed to fetch application");
  }
}

// PATCH /api/applications/:id - Update an application
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("UNAUTHORIZED", "You must be logged in", 401);
    }
    const userId = session.user.id;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON in request body", 400);
    }

    const validation = updateApplicationSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(
        "VALIDATION_ERROR",
        firstError?.message || "Invalid request body",
        400
      );
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    if (!existing) {
      return notFoundResponse("Application");
    }

    const { status, resumeId, appliedAt, notes } = validation.data;

    await db
      .update(applications)
      .set({
        status: status ?? existing.status,
        resumeId: resumeId !== undefined ? resumeId : existing.resumeId,
        appliedAt: appliedAt !== undefined ? appliedAt : existing.appliedAt,
        notes: notes !== undefined ? notes : existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id));

    const [updatedApplication] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));

    return successResponse(updatedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    return errorResponse("UPDATE_ERROR", "Failed to update application");
  }
}

// DELETE /api/applications/:id - Delete an application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("UNAUTHORIZED", "You must be logged in", 401);
    }
    const userId = session.user.id;

    // Verify ownership
    const [existing] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    if (!existing) {
      return notFoundResponse("Application");
    }

    await db.delete(applications).where(eq(applications.id, id));

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return errorResponse("DELETE_ERROR", "Failed to delete application");
  }
}
