import * as readline from "readline";
import chalk from "chalk";
import { writeConfig, getDefaultModel, type Provider } from "./config.js";

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export async function runSetup(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n" + chalk.bold.cyan("🤖 lemme setup") + "\n");

  // pick provider
  console.log(chalk.bold("Which AI provider do you want to use?"));
  console.log(chalk.dim("  1.") + " Claude " + chalk.dim("(Anthropic)"));
  console.log(chalk.dim("  2.") + " OpenAI");
  console.log(chalk.dim("  3.") + " Groq");

  const providerChoice = await prompt(rl, chalk.cyan("\nEnter 1, 2 or 3: "));

  const providerMap: Record<string, Provider> = {
    "1": "claude",
    "2": "openai",
    "3": "groq",
  };

  const provider = providerMap[providerChoice.trim()];

  if (!provider) {
    console.error(
      chalk.red("\n✖ Invalid choice, please run lemme config again.\n"),
    );
    rl.close();
    process.exit(1);
  }

  const apiKey = await prompt(
    rl,
    chalk.cyan(`\nEnter your ${chalk.bold(provider)} API key: `),
  );

  if (!apiKey.trim()) {
    console.error(chalk.red("\n✖ API key cannot be empty.\n"));
    rl.close();
    process.exit(1);
  }

  const model = getDefaultModel(provider);

  writeConfig({
    provider,
    apiKey: apiKey.trim(),
    model,
  });

  console.log(
    "\n" +
      chalk.green("✔ Config saved to ") +
      chalk.dim("~/.config/lemme/config.json"),
  );
  console.log(chalk.dim("  Provider : ") + chalk.bold(provider));
  console.log(chalk.dim("  Model    : ") + chalk.bold(model));
  console.log(
    "\n" +
      chalk.bold("You're all set! Try: ") +
      chalk.cyan("lemme push my branch to origin") +
      "\n",
  );

  rl.close();
}
