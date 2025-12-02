/**
 * @resume-maker/db - Database Connection & Exports
 *
 * Provides Drizzle ORM instance connected to Vercel Postgres.
 */

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

// Create Drizzle instance with Vercel Postgres
// Uses POSTGRES_URL environment variable automatically
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from "./schema";

// Re-export commonly used drizzle operators
export { eq, and, or, gt, gte, lt, lte, ne, isNull, isNotNull, inArray, notInArray, like, ilike, desc, asc, sql as sqlOperator } from "drizzle-orm";

// Export db instance type for type inference
export type Database = typeof db;
