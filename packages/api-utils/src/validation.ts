/**
 * @resume-maker/api-utils - API Request Validation Utilities
 *
 * Provides consistent request validation across all API routes.
 */

import { z } from "zod";
import { validationErrorResponse } from "./responses";

/**
 * Parse and validate request body with a Zod schema
 * Returns the parsed data or a validation error response
 */
export async function parseRequestBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<
  { success: true; data: z.infer<T> } | { success: false; response: Response }
> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return {
        success: false,
        response: validationErrorResponse(errors),
      };
    }

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      response: validationErrorResponse("Invalid JSON body"),
    };
  }
}

/**
 * Parse and validate URL search params with a Zod schema
 */
export function parseSearchParams<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; response: Response } {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return {
      success: false,
      response: validationErrorResponse(errors),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Sanitize a filename to prevent path traversal attacks
 * Removes directory components and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  // Handle empty/whitespace input
  if (!filename || !filename.trim()) {
    return "untitled";
  }

  // Remove any path components (directory traversal prevention)
  const basename = filename.split(/[/\\]/).pop() || "";

  // Remove or replace dangerous characters
  // Allow: alphanumeric, dots, hyphens, underscores, spaces
  const sanitized = basename
    .replace(/[<>:"|?*]/g, "") // Remove Windows-forbidden chars
    .replace(/\.{2,}/g, ".") // Collapse multiple dots to single dot
    .replace(/^\.+/, "") // Remove leading dots
    .trim();

  // Ensure we have a valid filename
  return sanitized || "untitled";
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Escapes dangerous characters
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate UUID format
 */
export function isValidUuid(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * User update schema for profile updates
 */
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email must be 255 characters or less")
    .optional(),
});
export type UserUpdate = z.infer<typeof userUpdateSchema>;

/**
 * Pagination schema for list endpoints
 */
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Sort schema for list endpoints
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type Sort = z.infer<typeof sortSchema>;
