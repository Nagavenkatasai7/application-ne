import { db, resumes, jobs, eq, and } from "@resume-maker/db";
import { auth } from "@resume-maker/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@resume-maker/api-utils";
import {
  tailorResume,
  tailorRequestSchema,
  TailorError,
  isAIConfigured,
} from "@resume-maker/ai";
import type { ResumeContent } from "@resume-maker/types";

export const maxDuration = 180;

/**
 * POST /api/resumes/:id/tailor - Tailor a resume for a specific job
 *
 * Request body:
 * {
 *   jobId: string (UUID of the job to tailor for)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     tailoredResume: ResumeContent,
 *     changes: {
 *       summaryModified: boolean,
 *       experienceBulletsModified: number,
 *       skillsReordered: boolean,
 *       sectionsReordered: boolean
 *     }
 *   }
 * }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resumeId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    // Check if AI is configured
    if (!isAIConfigured()) {
      return errorResponse(
        "AI_NOT_CONFIGURED",
        "AI features are not configured. Please add your API key.",
        503
      );
    }

    // Parse and validate request body
    let body: { jobId?: string };
    try {
      body = await request.json();
    } catch {
      return validationErrorResponse("Invalid JSON in request body");
    }

    // Validate input
    const validation = tailorRequestSchema.safeParse({
      resumeId,
      jobId: body.jobId,
    });

    if (!validation.success) {
      return validationErrorResponse(
        validation.error.issues[0]?.message || "Invalid request"
      );
    }

    const { jobId } = validation.data;

    // Fetch the resume and verify ownership
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)));

    if (!resume) {
      return notFoundResponse("Resume");
    }

    // Fetch the job
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

    if (!job) {
      return notFoundResponse("Job");
    }

    // Ensure we have valid resume content
    const resumeContent = resume.content as ResumeContent | null;
    if (!resumeContent || !resumeContent.contact) {
      return errorResponse(
        "INVALID_RESUME",
        "Resume has no content to tailor",
        400
      );
    }

    // Ensure job has a description
    if (!job.description) {
      return errorResponse(
        "INVALID_JOB",
        "Job has no description for tailoring",
        400
      );
    }

    // Call the tailoring service
    const result = await tailorResume({
      resume: resumeContent,
      jobTitle: job.title,
      companyName: job.companyName || "Company",
      jobDescription: job.description,
      requirements: (job.requirements as string[]) || [],
      skills: (job.skills as string[]) || [],
    });

    return successResponse(result);
  } catch (error) {
    console.error("Error tailoring resume:", error);

    // Handle TailorError with specific error codes
    if (error instanceof TailorError) {
      const statusMap: Record<string, number> = {
        AI_NOT_CONFIGURED: 503,
        FEATURE_DISABLED: 503,
        AUTH_ERROR: 401,
        RATE_LIMIT: 429,
        SERVICE_UNAVAILABLE: 503,
        TIMEOUT: 504,
        PARSE_ERROR: 500,
        VALIDATION_ERROR: 500,
        API_ERROR: 500,
        UNKNOWN_ERROR: 500,
      };

      return errorResponse(
        error.code,
        error.message,
        statusMap[error.code] || 500
      );
    }

    return errorResponse("TAILOR_ERROR", "Failed to tailor resume");
  }
}
