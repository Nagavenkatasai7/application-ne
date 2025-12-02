/**
 * @resume-maker/api-utils - Shared API Response Utilities
 *
 * Provides consistent response formatting across all API routes.
 */

import { NextResponse } from "next/server";

/**
 * Standard API response types
 */
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiSuccessWithMetaResponse<T> = {
  success: true;
  data: T;
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Success response with data
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Success response with data and metadata (for paginated results)
 */
export function successWithMeta<T>(
  data: T,
  meta: { limit: number; offset: number; total: number },
  status = 200
) {
  return NextResponse.json({ success: true, data, meta }, { status });
}

/**
 * Error response with code and message
 */
export function errorResponse(code: string, message: string, status = 500) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

/**
 * Not found error response
 */
export function notFoundResponse(resource: string) {
  return errorResponse("NOT_FOUND", `${resource} not found`, 404);
}

/**
 * Validation error response
 */
export function validationErrorResponse(message: string) {
  return errorResponse("VALIDATION_ERROR", message, 400);
}

/**
 * Unauthorized error response
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse("UNAUTHORIZED", message, 401);
}

/**
 * Forbidden error response
 */
export function forbiddenResponse(message = "Forbidden") {
  return errorResponse("FORBIDDEN", message, 403);
}

/**
 * Rate limit exceeded response
 */
export function rateLimitResponse(retryAfter?: number) {
  const headers: Record<string, string> = {};
  if (retryAfter) {
    headers["Retry-After"] = String(retryAfter);
  }
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
      },
    },
    { status: 429, headers }
  );
}

/**
 * Internal server error response
 */
export function internalErrorResponse(message = "Internal server error") {
  return errorResponse("INTERNAL_ERROR", message, 500);
}

/**
 * Bad request error response
 */
export function badRequestResponse(message: string) {
  return errorResponse("BAD_REQUEST", message, 400);
}

/**
 * Conflict error response (e.g., duplicate resource)
 */
export function conflictResponse(message: string) {
  return errorResponse("CONFLICT", message, 409);
}
