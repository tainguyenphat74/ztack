# ztack

Scaffold a new project from a set of opinionated boilerplates with one command.

```bash
bunx ztack my-app
# or
npx ztack my-app
```

## Templates

| Template | Stack                                                            |
| -------- | --------------------------------------------------------------- |
| `web`    | Next.js 16 · TypeScript · Tailwind · shadcn/ui · Clerk · Drizzle |
| `api`    | Hono · TypeScript                                               |
| `cli`    | TypeScript Node CLI                                             |

## What it does

1. Prompts for a project name (or pass it as an argument).
2. Asks which template to use.
3. For `web`, asks the database target (Supabase or self-hosted Postgres).
4. Copies the template, rewrites the package name, and writes a local-only
   `.env.local` (never committed).
5. Optionally installs dependencies and initializes a git repository.

## Environment policy

No env files are ever committed. The CLI writes `.env.local` on your machine at
scaffold time; each template documents its variables in its own README.

## License

[MIT](https://github.com/tainguyenphat74/ztack/blob/main/LICENSE)
