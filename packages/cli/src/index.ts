import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  note,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";

import { copyDir, isEmptyDir, resolveTemplatesDir, toPackageName } from "./helpers";
import { buildEnvFile, getTemplate, TEMPLATES, type DbChoice } from "./templates";

function bail(message = "Cancelled."): never {
  cancel(message);
  process.exit(0);
}

function unwrap<T>(value: T | symbol): T {
  if (isCancel(value)) bail();
  return value as T;
}

function detectPackageManager(): "bun" | "npm" {
  const ok = spawnSync("bun", ["--version"], { stdio: "ignore" });
  return ok.status === 0 ? "bun" : "npm";
}

async function main() {
  const argName = process.argv.slice(2).find((a) => !a.startsWith("-"));

  intro("ztack — scaffold a new project");

  const projectName = unwrap(
    argName ??
      (await text({
        message: "Project name?",
        placeholder: "my-app",
        validate: (v) => (v.trim().length === 0 ? "Required" : undefined),
      })),
  );

  const targetDir = resolve(process.cwd(), projectName);
  if (existsSync(targetDir) && !(await isEmptyDir(targetDir))) {
    bail(`Directory "${projectName}" already exists and is not empty.`);
  }

  const templateId = unwrap(
    await select({
      message: "Which template?",
      options: TEMPLATES.map((t) => ({
        value: t.id,
        label: t.label,
        hint: t.hint,
      })),
    }),
  );
  const template = getTemplate(templateId)!;

  let db: DbChoice | undefined;
  if (template.supportsDb) {
    db = unwrap(
      await select<DbChoice>({
        message: "Database target?",
        options: [
          { value: "supabase", label: "Supabase", hint: "managed Postgres" },
          {
            value: "self-host",
            label: "Self-hosted Postgres",
            hint: "VPS / docker-compose",
          },
        ],
      }),
    );
  }

  const doInstall = unwrap(
    await confirm({ message: "Install dependencies now?", initialValue: true }),
  );
  const doGit = unwrap(
    await confirm({ message: "Initialize a git repository?", initialValue: true }),
  );

  // --- Scaffold ---------------------------------------------------------------
  const templatesDir = resolveTemplatesDir();
  const templateDir = join(templatesDir, template.id);
  if (!existsSync(templateDir)) {
    bail(`Template "${template.id}" is not available yet.`);
  }

  const s = spinner();
  s.start(`Creating ${projectName}`);
  await copyDir(templateDir, targetDir);

  // Rewrite the package name.
  const pkgPath = join(targetDir, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
    pkg.name = toPackageName(projectName);
    pkg.version = "0.1.0";
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }

  // Write a local-only .env.local (never committed).
  const envContent = buildEnvFile(template, db);
  if (envContent) {
    await writeFile(join(targetDir, ".env.local"), envContent);
  }
  s.stop(`Created ${projectName}`);

  const pm = detectPackageManager();

  if (doInstall) {
    const inst = spinner();
    inst.start(`Installing dependencies with ${pm}`);
    const res = spawnSync(pm, ["install"], { cwd: targetDir, stdio: "ignore" });
    if (res.status === 0) {
      inst.stop("Dependencies installed");
    } else {
      inst.stop("Dependency install failed — run it manually later");
    }
  }

  if (doGit) {
    spawnSync("git", ["init", "-q"], { cwd: targetDir, stdio: "ignore" });
    spawnSync("git", ["add", "-A"], { cwd: targetDir, stdio: "ignore" });
    spawnSync(
      "git",
      ["commit", "-q", "-m", "Initial commit from ztack"],
      { cwd: targetDir, stdio: "ignore" },
    );
    log.success("Initialized git repository");
  }

  // --- Next steps -------------------------------------------------------------
  const steps = [`cd ${projectName}`];
  if (!doInstall) steps.push(`${pm} install`);
  if (envContent) steps.push("# fill in .env.local");
  if (template.supportsDb) steps.push(`${pm} run db:push`);
  steps.push(`${pm} run dev`);

  note(steps.join("\n"), "Next steps");
  outro("Done. Happy building! 🚀");
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
