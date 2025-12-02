/**
 * @resume-maker/db - Database Connection & Exports
 *
 * Provides Drizzle ORM instance connected to PostgreSQL.
 * Supports both Vercel Postgres (production) and standard pg (development/CI).
 */

import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Determine if we're in Vercel environment
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;

// Create appropriate database connection
function createDb() {
  if (isVercel) {
    // Use Vercel Postgres in production
    // Dynamic import to avoid bundling issues
    const { sql } = require("@vercel/postgres");
    return drizzleVercel(sql, { schema });
  } else {
    // Use standard pg for development/CI
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("POSTGRES_URL or DATABASE_URL environment variable is required");
    }
    const pool = new Pool({ connectionString });
    return drizzlePg(pool, { schema });
  }
}

export const db = createDb();

// Re-export schema for convenience
export * from "./schema";

// Re-export commonly used drizzle operators
export { eq, and, or, gt, gte, lt, lte, ne, isNull, isNotNull, inArray, notInArray, like, ilike, desc, asc, sql as sqlOperator } from "drizzle-orm";

// Export db instance type for type inference
export type Database = typeof db;
