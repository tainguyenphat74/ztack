import { cancel, isCancel, text } from "@clack/prompts";

/** Pure, testable core of the command. */
export function greetMessage(name: string): string {
  return `Hello, ${name}!`;
}

export async function greet(name?: string): Promise<void> {
  let value = name;
  if (!value) {
    const answer = await text({
      message: "Who should I greet?",
      placeholder: "world",
    });
    if (isCancel(answer)) {
      cancel("Cancelled.");
      process.exit(0);
    }
    value = answer || "world";
  }
  console.log(greetMessage(value));
}
