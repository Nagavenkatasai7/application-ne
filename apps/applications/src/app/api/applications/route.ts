import { NextRequest } from "next/server";
import { db, applications, jobs, resumes, eq, desc } from "@resume-maker/db";
import { auth } from "@resume-maker/auth";
import { errorResponse, successResponse, successWithMeta } from "@resume-maker/api-utils";
import { v4 as uuidv4 } from "uuid";
import { createApplicationSchema } from "@/lib/validations/application";

// GET /api/applications - List all applications for current user with job data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("UNAUTHORIZED", "You must be logged in to view applications", 401);
    }
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Fetch applications with related job and resume data
    const userApplications = await db
      .select({
        id: applications.id,
        userId: applications.userId,
        jobId: applications.jobId,
        resumeId: applications.resumeId,
        status: applications.status,
        appliedAt: applications.appliedAt,
        notes: applications.notes,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
        // Job data
        jobTitle: jobs.title,
        jobCompanyName: jobs.companyName,
        jobLocation: jobs.location,
        // Resume data
        resumeName: resumes.name,
      })
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(resumes, eq(applications.resumeId, resumes.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));

    // Transform to include nested job/resume objects
    const transformedApplications = userApplications.map((app) => ({
      id: app.id,
      userId: app.userId,
      jobId: app.jobId,
      resumeId: app.resumeId,
      status: app.status,
      appliedAt: app.appliedAt,
      notes: app.notes,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      job: {
        id: app.jobId,
        title: app.jobTitle,
        companyName: app.jobCompanyName,
        location: app.jobLocation,
      },
      resume: app.resumeId
        ? {
            id: app.resumeId,
            name: app.resumeName,
          }
        : null,
    }));

    // Filter by status if provided
    const filtered = status
      ? transformedApplications.filter((app) => app.status === status)
      : transformedApplications;

    return successWithMeta(filtered, { limit: filtered.length, offset: 0, total: filtered.length });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return errorResponse("FETCH_ERROR", "Failed to fetch applications");
  }
}

// POST /api/applications - Create a new application
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("UNAUTHORIZED", "You must be logged in to create applications", 401);
    }
    const userId = session.user.id;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON in request body", 400);
    }

    const validation = createApplicationSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(
        "VALIDATION_ERROR",
        firstError?.message || "Invalid request body",
        400
      );
    }

    const { jobId, resumeId, status, appliedAt, notes } = validation.data;

    const newApplication = {
      id: uuidv4(),
      userId,
      jobId,
      resumeId: resumeId || null,
      status: status || "saved",
      appliedAt: appliedAt || null,
      notes: notes || null,
    };

    await db.insert(applications).values(newApplication);

    return successResponse(newApplication, 201);
  } catch (error) {
    console.error("Error creating application:", error);
    return errorResponse("CREATE_ERROR", "Failed to create application");
  }
}
