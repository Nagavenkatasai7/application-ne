/**
 * Jobs API Routes
 *
 * GET /api/jobs - List all jobs
 * POST /api/jobs - Create a job (manual entry)
 */

import { db, jobs, desc } from "@resume-maker/db";
import { v4 as uuidv4 } from "uuid";
import {
  successWithMeta,
  successResponse,
  errorResponse,
  parseRequestBody,
} from "@resume-maker/api-utils";
import { createJobSchema } from "@resume-maker/types";

// GET /api/jobs - List all jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

    const query = db.select().from(jobs).orderBy(desc(jobs.createdAt));

    const allJobs = await query.limit(limit).offset(offset);

    return successWithMeta(allJobs, { limit, offset, total: allJobs.length });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return errorResponse("FETCH_ERROR", "Failed to fetch jobs");
  }
}

// POST /api/jobs - Create a job (manual entry)
export async function POST(request: Request) {
  try {
    // Validate request body with Zod schema
    const parsed = await parseRequestBody(request, createJobSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const body = parsed.data;

    const newJob = {
      id: uuidv4(),
      platform: body.platform,
      externalId: body.externalId || null,
      title: body.title,
      companyId: null,
      companyName: body.companyName || null,
      location: body.location || null,
      description: body.description || null,
      requirements: body.requirements,
      skills: body.skills,
      salary: body.salary || null,
      postedAt: null,
      cachedAt: new Date(),
    };

    await db.insert(jobs).values(newJob);

    return successResponse(newJob, 201);
  } catch (error) {
    console.error("Error creating job:", error);
    return errorResponse("CREATE_ERROR", "Failed to create job");
  }
}
