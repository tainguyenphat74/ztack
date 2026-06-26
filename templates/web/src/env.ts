import { z } from "zod";

/**
 * Validated, typed environment variables. Importing `env` anywhere will throw
 * at startup if a required variable is missing or malformed — fail fast rather
 * than at the first request.
 *
 * Only server-side variables belong here. Client-exposed values must be
 * prefixed with `NEXT_PUBLIC_` and read directly from `process.env`.
 */
const serverSchema = z.object({
  DATABASE_URL: z.url(),
  CLERK_SECRET_KEY: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
