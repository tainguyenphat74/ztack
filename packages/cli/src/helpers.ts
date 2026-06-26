import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SKIP = new Set([
  "node_modules",
  ".next",
  "dist",
  ".git",
  ".turbo",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
]);

/** Recursively copy a directory, skipping build artifacts. */
export async function copyDir(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(from, to);
    } else {
      await cp(from, to);
    }
  }
}

/**
 * Locate the bundled `templates/` directory. Works both when running from
 * source (templates live at the repo root) and when published (templates are
 * copied next to the built CLI).
 */
export function resolveTemplatesDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "templates"),
    join(here, "..", "templates"),
    join(here, "..", "..", "templates"),
    join(here, "..", "..", "..", "templates"),
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, "web", "package.json"))) return dir;
  }
  throw new Error(
    "Could not locate the templates directory. This is a packaging bug.",
  );
}

export async function isEmptyDir(path: string): Promise<boolean> {
  if (!existsSync(path)) return true;
  const s = await stat(path);
  if (!s.isDirectory()) return false;
  const entries = await readdir(path);
  return entries.length === 0;
}

/** Turn an arbitrary input into a safe npm package name. */
export function toPackageName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-~][^a-z0-9-._~]*/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 214) || "app";
}
