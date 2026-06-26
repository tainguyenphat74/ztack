#!/usr/bin/env node
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    name: { type: "string", short: "n" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

function printHelp(): void {
  console.log(`Usage: cli [command] [options]

Commands:
  greet            Print a greeting

Options:
  -n, --name <s>   Name to greet
  -h, --help       Show this help
`);
}

function main(): void {
  if (values.help) {
    printHelp();
    return;
  }

  const command = positionals[0] ?? "greet";

  switch (command) {
    case "greet":
      console.log(`Hello, ${values.name ?? "world"}!`);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exitCode = 1;
  }
}

main();
