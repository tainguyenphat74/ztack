# api

A lightweight, structured HTTP API built with [Hono](https://hono.dev) on Node,
with [zod](https://zod.dev) request validation.

## Quick start

```bash
npm install   # or bun / pnpm
npm run dev   # http://localhost:3000
```

## Endpoints

| Method | Path         | Body                          | Description          |
| ------ | ------------ | ----------------------------- | -------------------- |
| GET    | `/`          | —                             | Service info         |
| GET    | `/health`    | —                             | Health + uptime      |
| GET    | `/todos`     | —                             | List todos           |
| POST   | `/todos`     | `{ "title": string }`         | Create a todo        |
| GET    | `/todos/:id` | —                             | Get one todo         |
| PATCH  | `/todos/:id` | `{ title?, done? }`           | Update a todo        |
| DELETE | `/todos/:id` | —                             | Delete a todo        |

The `todos` resource uses an in-memory store — swap it for a real database.

## Layout

```
src/
  app.ts            # Hono app: middleware, routes, error handling
  index.ts          # server bootstrap
  lib/env.ts        # typed env (zod)
  routes/
    health.ts
    todos.ts        # example CRUD resource with zod validation
test/
  app.test.ts       # bun:test using app.request()
```

## Environment variables

No env files are committed (`.env*` is gitignored). Create `.env.local` if
needed; `PORT` overrides the default `3000`.

## Scripts

| Script      | Description           |
| ----------- | --------------------- |
| `dev`       | Watch-mode dev server |
| `start`     | Run once              |
| `test`      | `bun test`            |
| `typecheck` | `tsc --noEmit`        |
