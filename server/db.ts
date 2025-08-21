import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please add your Supabase connection string as DATABASE_URL in secrets.",
  );
}

// Use the DATABASE_URL directly from Supabase
const dbUrl = process.env.DATABASE_URL;

const sql = postgres(dbUrl, { 
  max: 1,
  ssl: 'require'
});

export const db = drizzle(sql, { schema });