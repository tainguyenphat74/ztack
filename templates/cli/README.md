# cli

A TypeScript Node CLI starter using the built-in `node:util` arg parser (no
runtime dependencies).

> 🧪 This is a starter stub — add commands and prompts (e.g. `@clack/prompts`)
> as your tool grows.

## Quick start

```bash
npm install        # or bun / pnpm
npm run dev greet --name Ada
# → Hello, Ada!
```

## Build

```bash
npm run build      # bundles to dist/ with tsup
node dist/index.js greet
```

## Scripts

| Script      | Description           |
| ----------- | --------------------- |
| `dev`       | Run from source (tsx) |
| `build`     | Bundle to `dist/`     |
| `start`     | Run the built CLI     |
| `typecheck` | `tsc --noEmit`        |
