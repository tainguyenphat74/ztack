import { afterAll, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  copyDir,
  resolveTemplatesDir,
  toPackageName,
} from "../src/helpers.ts";
import { buildEnvFile, getTemplate, TEMPLATES } from "../src/templates.ts";

const work = await mkdtemp(join(tmpdir(), "ztack-test-"));
afterAll(() => rm(work, { recursive: true, force: true }));

test("toPackageName sanitizes input", () => {
  expect(toPackageName("My App!")).toBe("my-app");
  expect(toPackageName("  Spaced  Name ")).toBe("spaced-name");
  expect(toPackageName("@scope/pkg")).toBe("scope-pkg");
});

test("resolveTemplatesDir finds the web template", () => {
  const dir = resolveTemplatesDir();
  expect(existsSync(join(dir, "web", "package.json"))).toBe(true);
});

test.each(TEMPLATES.map((t) => t.id))(
  "template '%s' copies without build artifacts",
  async (id) => {
    const dir = resolveTemplatesDir();
    const dest = join(work, id);
    await copyDir(join(dir, id), dest);
    expect(existsSync(join(dest, "package.json"))).toBe(true);
    expect(existsSync(join(dest, "node_modules"))).toBe(false);
    expect(existsSync(join(dest, ".next"))).toBe(false);
    // `gitignore` must be restored to `.gitignore` on copy.
    expect(existsSync(join(dest, ".gitignore"))).toBe(true);
    expect(existsSync(join(dest, "gitignore"))).toBe(false);
  },
);

test("web template has expected files and no committed env", async () => {
  const dir = join(resolveTemplatesDir(), "web");
  expect(existsSync(join(dir, "src", "proxy.ts"))).toBe(true);
  expect(existsSync(join(dir, ".env.example"))).toBe(false);
  const pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf8"));
  expect(pkg.scripts["db:push"]).toBeTruthy();
});

test("package.json name patch works on a copy", async () => {
  const dest = join(work, "patched");
  await copyDir(join(resolveTemplatesDir(), "web"), dest);
  const pkgPath = join(dest, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  pkg.name = toPackageName("Demo Web");
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  const after = JSON.parse(await readFile(pkgPath, "utf8"));
  expect(after.name).toBe("demo-web");
});

test("buildEnvFile produces correct env per template/db", () => {
  const web = getTemplate("web")!;
  const supa = buildEnvFile(web, "supabase")!;
  expect(supa).toContain("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=");
  expect(supa).toContain("DATABASE_URL=");

  const self = buildEnvFile(web, "self-host")!;
  expect(self).toContain("postgres://postgres:postgres@localhost:5432/app");

  expect(buildEnvFile(getTemplate("api")!, undefined)).toBeNull();
  expect(buildEnvFile(getTemplate("cli")!, undefined)).toBeNull();
});
