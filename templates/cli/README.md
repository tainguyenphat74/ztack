# cli

A TypeScript Node CLI starter with a small command router and interactive
prompts via [@clack/prompts](https://github.com/bombshell-dev/clack).

## Quick start

```bash
npm install                 # or bun / pnpm
npm run dev greet --name Ada
# → Hello, Ada!

npm run dev greet           # prompts for a name interactively
```

## Build

```bash
npm run build               # bundles to dist/ with tsup
node dist/index.js greet -n Bob
```

## Layout

```
src/
  index.ts            # arg parsing + command dispatch
  commands/greet.ts   # example command (pure core + interactive wrapper)
test/
  greet.test.ts       # bun:test on the pure core
```

Add new commands under `src/commands/` and wire them into the `switch` in
`src/index.ts`.

## Scripts

| Script      | Description           |
| ----------- | --------------------- |
| `dev`       | Run from source (tsx) |
| `build`     | Bundle to `dist/`     |
| `start`     | Run the built CLI     |
| `test`      | `bun test`            |
| `typecheck` | `tsc --noEmit`        |
