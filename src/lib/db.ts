import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Only use SSL if we are in production
  ssl: isProduction ? { rejectUnauthorized: false } : false
});