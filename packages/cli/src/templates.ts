export type DbChoice = "supabase" | "self-host";

export interface TemplateDef {
  id: string;
  label: string;
  hint: string;
  /** Whether to ask the database question and write DB env vars. */
  supportsDb: boolean;
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: "web",
    label: "Web app",
    hint: "Next.js 16 · Tailwind · shadcn/ui · Clerk · Drizzle",
    supportsDb: true,
  },
  {
    id: "api",
    label: "API",
    hint: "Hono · TypeScript (lightweight HTTP API)",
    supportsDb: false,
  },
  {
    id: "cli",
    label: "CLI",
    hint: "TypeScript Node CLI starter",
    supportsDb: false,
  },
];

export function getTemplate(id: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Build the `.env.local` contents for a freshly scaffolded project. Returns
 * `null` when the template needs no env file.
 */
export function buildEnvFile(
  template: TemplateDef,
  db: DbChoice | undefined,
): string | null {
  const lines: string[] = [];

  if (template.id === "web") {
    lines.push(
      "# Clerk — https://dashboard.clerk.com → API keys",
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=",
      "CLERK_SECRET_KEY=",
      "NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in",
      "NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up",
      "",
    );
  }

  if (template.supportsDb && db) {
    lines.push("# Database");
    if (db === "supabase") {
      lines.push(
        "# Supabase: Settings → Database → Connection string (Transaction pooler, port 6543)",
        "DATABASE_URL=",
      );
    } else {
      lines.push(
        "# Self-hosted Postgres (see docker-compose.yml)",
        "DATABASE_URL=postgres://postgres:postgres@localhost:5432/app",
      );
    }
    lines.push("");
  }

  return lines.length > 0 ? lines.join("\n") : null;
}
