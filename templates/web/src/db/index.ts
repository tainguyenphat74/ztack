import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * A single postgres-js connection pool, reused across hot reloads in dev.
 *
 * The same `DATABASE_URL` works for both deployment targets:
 *   • Supabase     — use the connection string from Project → Database.
 *   • Self-hosted  — Postgres running on your VPS (see docker-compose.yml).
 *
 * If you use Supabase's transaction pooler (port 6543), keep `prepare: false`.
 */
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.client ?? postgres(env.DATABASE_URL, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
