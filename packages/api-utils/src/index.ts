/**
 * @resume-maker/api-utils - Main Entry Point
 *
 * Shared API utilities for all resume-maker zones.
 */

// Response utilities
export {
  successResponse,
  successWithMeta,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  rateLimitResponse,
  internalErrorResponse,
  badRequestResponse,
  conflictResponse,
  type ApiSuccessResponse,
  type ApiSuccessWithMetaResponse,
  type ApiErrorResponse,
  type ApiResponse,
} from "./responses";

// Validation utilities
export {
  parseRequestBody,
  parseSearchParams,
  sanitizeFilename,
  sanitizeHtml,
  isValidUuid,
  userUpdateSchema,
  paginationSchema,
  sortSchema,
  type UserUpdate,
  type Pagination,
  type Sort,
} from "./validation";

// Rate limiting utilities
export {
  checkRateLimit,
  getClientIdentifier,
  withRateLimit,
  clearRateLimitStore,
  RATE_LIMITS,
  type RateLimitType,
  type RateLimitResult,
} from "./rate-limit";
