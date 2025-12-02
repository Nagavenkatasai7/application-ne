/**
 * LinkedIn Status API Route
 *
 * GET /api/linkedin/status
 * Check if LinkedIn search is configured and available
 */

import { NextResponse } from "next/server";
import { isApifyConfigured } from "@/lib/linkedin";

export async function GET() {
  const isConfigured = isApifyConfigured();

  return NextResponse.json({
    success: true,
    data: {
      available: isConfigured,
      message: isConfigured
        ? "LinkedIn search is available"
        : "LinkedIn search requires APIFY_API_KEY to be configured",
    },
  });
}
