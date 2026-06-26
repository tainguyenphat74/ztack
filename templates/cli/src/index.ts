#!/usr/bin/env node
import { parseArgs } from "node:util";

import { greet } from "./commands/greet";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    name: { type: "string", short: "n" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

function printHelp(): void {
  console.log(`Usage: cli <command> [options]

Commands:
  greet            Print a greeting (prompts when --name is omitted)

Options:
  -n, --name <s>   Name to greet
  -h, --help       Show this help
`);
}

async function main(): Promise<void> {
  if (values.help) {
    printHelp();
    return;
  }

  const command = positionals[0] ?? "greet";

  switch (command) {
    case "greet":
      await greet(values.name);
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      printHelp();
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
