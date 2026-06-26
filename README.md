# ztack

A personal CLI for scaffolding project boilerplates. One command, pick a
template, answer a few questions, and you have a ready-to-run project.

```bash
bunx ztack my-app
# or
npx ztack my-app
```

## Templates

| Template | Stack                                                                 | Status |
| -------- | --------------------------------------------------------------------- | ------ |
| `web`    | Next.js 16 · TypeScript · Tailwind · shadcn/ui · Clerk · Drizzle      | ✅ ready |
| `api`    | Hono · TypeScript · zod (CRUD example + tests)                        | ✅ ready |
| `cli`    | TypeScript Node CLI · @clack/prompts (command router + tests)         | ✅ ready |

See each template's own README under [`templates/`](templates/).

## What the CLI does

1. Asks for a project name (or takes it as an argument).
2. Asks which template to use.
3. For `web`, asks which database target (Supabase or self-hosted Postgres).
4. Copies the template, rewrites the project name, and **generates a local
   `.env.local`** from your answers (never committed).
5. Optionally installs dependencies and initializes a git repo.

## Repo layout

```
ztack/
├─ packages/
│  └─ cli/            # the `ztack` CLI (Bun + @clack/prompts)
└─ templates/
   ├─ web/            # Next.js 16 boilerplate
   ├─ api/            # Hono API stub
   └─ cli/            # Node CLI stub
```

## Develop

```bash
bun install
bun run cli -- my-app          # run the CLI from source
```

## Environment policy

No env files are ever committed anywhere in this repo (`.env*` is gitignored).
The CLI writes a project's `.env.local` on the user's machine at scaffold time;
each template documents its required variables in its own README.

## License

[MIT](LICENSE)
