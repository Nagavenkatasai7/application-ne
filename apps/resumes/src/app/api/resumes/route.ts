import { db, resumes, eq } from "@resume-maker/db";
import { desc } from "@resume-maker/db";
import { auth } from "@resume-maker/auth";
import { v4 as uuidv4 } from "uuid";
import {
  successResponse,
  successWithMeta,
  errorResponse,
  unauthorizedResponse,
} from "@resume-maker/api-utils";

/**
 * GET /api/resumes - List all resumes for current user
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, session.user.id))
      .orderBy(desc(resumes.updatedAt));

    return successWithMeta(userResumes, { total: userResumes.length, limit: 100, offset: 0 });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return errorResponse("FETCH_ERROR", "Failed to fetch resumes");
  }
}

/**
 * POST /api/resumes - Create a new resume
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    const newResume = {
      id: uuidv4(),
      userId: session.user.id,
      name: body.name || "Untitled Resume",
      content: body.content || {},
      templateId: body.templateId || null,
      isMaster: body.isMaster || false,
    };

    await db.insert(resumes).values(newResume);

    const [createdResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, newResume.id));

    return successResponse(createdResume, 201);
  } catch (error) {
    console.error("Error creating resume:", error);
    return errorResponse("CREATE_ERROR", "Failed to create resume");
  }
}
