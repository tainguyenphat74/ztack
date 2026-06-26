# next-boilerplate

A production-ready starting point for web apps.

**Stack**

| Concern   | Choice                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router)                                     |
| Language  | TypeScript                                                                        |
| Styling   | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)                              |
| Icons     | [lucide-react](https://lucide.dev)                                                |
| Theming   | [next-themes](https://github.com/pacocoursey/next-themes) (light / dark / system) |
| Auth      | [Clerk](https://clerk.com)                                                        |
| Database  | [Drizzle ORM](https://orm.drizzle.team) + Postgres                                |
| Tooling   | ESLint, Prettier (+ Tailwind plugin)                                              |

> **Note on Next.js 16:** the `middleware` file convention was renamed to
> `proxy`. Clerk's middleware lives in [`src/proxy.ts`](src/proxy.ts).

## Quick start

```bash
bun install            # or npm / pnpm
# create .env.local with the variables below, then:
bun run db:push        # create tables
bun run dev            # http://localhost:3000
```

## Environment variables

No env files are committed (everything matching `.env*` is gitignored). Create a
local `.env.local` with these variables:

| Variable                            | Required | Description                                                  |
| ----------------------------------- | -------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes      | Clerk publishable key (`pk_test_…`)                          |
| `CLERK_SECRET_KEY`                  | yes      | Clerk secret key (`sk_test_…`)                               |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | no       | Defaults to `/sign-in`                                       |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | no       | Defaults to `/sign-up`                                       |
| `DATABASE_URL`                      | yes      | Postgres connection string (Supabase **or** self-hosted)    |

Clerk keys come from the [Clerk dashboard](https://dashboard.clerk.com) → API
keys. For `DATABASE_URL`, see the two options below.

## Database — two options

The app uses a **single `DATABASE_URL`**; switch providers by changing its value.

### Option 1 — Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the **Transaction pooler** connection string (port `6543`) from
   _Settings → Database_ into `DATABASE_URL`.
3. `bun run db:push`.

### Option 2 — Self-hosted Postgres on a VPS

A [`docker-compose.yml`](docker-compose.yml) is included.

```bash
docker compose up -d
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/app
bun run db:push
```

On a real VPS, change the password and bind Postgres to `127.0.0.1` only.

### Drizzle scripts

| Script        | What it does                     |
| ------------- | -------------------------------- |
| `db:push`     | Push schema directly (fast, dev) |
| `db:generate` | Generate SQL migration files     |
| `db:migrate`  | Apply generated migrations       |
| `db:studio`   | Open Drizzle Studio              |

Schema lives in [`src/db/schema.ts`](src/db/schema.ts); the client in
[`src/db/index.ts`](src/db/index.ts).

## Auth (Clerk)

- Provider is mounted in [`src/app/layout.tsx`](src/app/layout.tsx).
- Routes are protected in [`src/proxy.ts`](src/proxy.ts) — `/dashboard` is
  protected by default; add patterns to `isProtectedRoute`.
- `/sign-in` and `/sign-up` render Clerk's prebuilt components.

## Project structure

```
src/
  app/
    dashboard/        # protected example route
    sign-in/, sign-up/
    layout.tsx        # ClerkProvider + ThemeProvider
    page.tsx
  components/
    ui/               # shadcn/ui components
    site-header.tsx, theme-toggle.tsx, theme-provider.tsx
  db/                 # Drizzle schema + client
  env.ts              # validated env vars
  proxy.ts            # Clerk middleware (Next 16 naming)
```

## Deploy to Vercel

1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
2. Add the env vars from `.env.example` in the Vercel project settings.
3. Deploy. Next.js is auto-detected — no extra config needed.

## Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `dev`             | Start dev server         |
| `build` / `start` | Production build / serve |
| `lint`            | ESLint                   |
| `typecheck`       | `tsc --noEmit`           |
| `format`          | Prettier write           |
