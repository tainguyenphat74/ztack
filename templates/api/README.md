# api

A lightweight HTTP API built with [Hono](https://hono.dev) on Node.

> 🧪 This is a starter stub — extend it with routing, validation, and a
> database layer as needed.

## Quick start

```bash
npm install   # or bun / pnpm
npm run dev   # http://localhost:3000
```

## Endpoints

| Method | Path      | Description     |
| ------ | --------- | --------------- |
| GET    | `/`       | Service info    |
| GET    | `/health` | Health check    |

## Environment variables

No env files are committed (`.env*` is gitignored). Create `.env.local` if you
need configuration; `PORT` overrides the default `3000`.

## Scripts

| Script      | Description           |
| ----------- | --------------------- |
| `dev`       | Watch-mode dev server |
| `start`     | Run once              |
| `typecheck` | `tsc --noEmit`        |
