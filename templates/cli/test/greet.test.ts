import { expect, test } from "bun:test";

import { greetMessage } from "../src/commands/greet";

test("greetMessage formats the name", () => {
  expect(greetMessage("Ada")).toBe("Hello, Ada!");
  expect(greetMessage("world")).toBe("Hello, world!");
});
