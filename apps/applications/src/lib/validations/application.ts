import { z } from "zod";

/**
 * Application status enum matching database schema
 */
export const applicationStatusEnum = z.enum([
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
]);

export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;

/**
 * All possible application statuses
 */
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
];

/**
 * Schema for creating a new application
 */
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  resumeId: z.string().optional(),
  status: applicationStatusEnum.default("saved"),
  appliedAt: z.coerce.date().optional(),
  notes: z.string().max(5000, "Notes must be less than 5000 characters").optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

/**
 * Schema for updating an application
 */
export const updateApplicationSchema = z.object({
  status: applicationStatusEnum.optional(),
  resumeId: z.string().nullable().optional(),
  appliedAt: z.coerce.date().nullable().optional(),
  notes: z.string().max(5000, "Notes must be less than 5000 characters").nullable().optional(),
});

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

/**
 * Get display label for application status
 */
export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    saved: "Saved",
    applied: "Applied",
    interviewing: "Interviewing",
    offered: "Offered",
    rejected: "Rejected",
  };
  return labels[status];
}

/**
 * Get text color class for application status
 */
export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    saved: "text-slate-500",
    applied: "text-blue-500",
    interviewing: "text-amber-500",
    offered: "text-green-500",
    rejected: "text-red-500",
  };
  return colors[status];
}

/**
 * Get background color class for application status badge
 */
export function getStatusBgColor(status: ApplicationStatus): string {
  const bgColors: Record<ApplicationStatus, string> = {
    saved: "bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300",
    applied: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
    interviewing: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
    offered: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300",
    rejected: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300",
  };
  return bgColors[status];
}
