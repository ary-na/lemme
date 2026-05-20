import chalk from "chalk";
import { readConfig, writeConfig } from "./config.js";
import * as readline from "readline";

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export function showConfig(): void {
  const config = readConfig();

  if (!config) {
    console.log(
      chalk.yellow("\n⚠ No config found. Run: ") + chalk.cyan("lemme config\n"),
    );
    process.exit(1);
  }

  console.log("\n" + chalk.bold.cyan("🤖 lemme config") + "\n");
  console.log(chalk.dim("  Provider : ") + chalk.bold(config.provider));
  console.log(chalk.dim("  Model    : ") + chalk.bold(config.model));
  console.log(chalk.dim("  Shell    : ") + chalk.bold(config.shell));
  console.log(chalk.dim("  OS       : ") + chalk.bold(config.os));
  console.log(
    chalk.dim("  Auto-run : ") + chalk.bold(config.autoRun ? "yes" : "no"),
  );
  console.log(
    chalk.dim("  History  : ") + chalk.bold(config.history ? "yes" : "no"),
  );
  console.log(
    chalk.dim("  API key  : ") +
      chalk.bold("*".repeat(12) + config.apiKey.slice(-4)),
  );
  console.log();
}

export async function resetConfig(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await prompt(
    rl,
    chalk.yellow("\n⚠ Reset your config? This will wipe your API key. (y/n): "),
  );
  rl.close();

  if (answer.trim().toLowerCase() !== "y") {
    console.log(chalk.dim("\nCancelled.\n"));
    process.exit(0);
  }

  const { unlinkSync } = await import("fs");
  const { homedir } = await import("os");
  const { join } = await import("path");

  const configPath = join(homedir(), ".config", "lemme", "config.json");

  try {
    unlinkSync(configPath);
    console.log(chalk.green("\n✔ Config reset.\n"));
  } catch {
    console.error(chalk.red("\n✖ Could not delete config file.\n"));
  }
}
