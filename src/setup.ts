import * as readline from "readline";
import chalk from "chalk";
import {
  writeConfig,
  getDefaultModel,
  detectShell,
  detectOS,
  type Provider,
  type Shell,
} from "./config.js";

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function step(n: number, total: number, title: string): void {
  console.log(
    "\n  " + chalk.dim(`[${n}/${total}]`) + " " + chalk.bold(title),
  );
}

export async function runSetup(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const STEPS = 5;

  console.log("\n  " + chalk.bold("lemme setup") + "\n");

  // provider
  step(1, STEPS, "AI provider");
  console.log();
  console.log("    " + chalk.dim("1.") + "  Claude  " + chalk.dim("(Anthropic)"));
  console.log("    " + chalk.dim("2.") + "  OpenAI");
  console.log("    " + chalk.dim("3.") + "  Groq");
  console.log("    " + chalk.dim("4.") + "  Gemini  " + chalk.dim("(Google)"));

  const providerChoice = await prompt(rl, chalk.dim("\n  Enter 1, 2, 3 or 4: "));

  const providerMap: Record<string, Provider> = {
    "1": "claude",
    "2": "openai",
    "3": "groq",
    "4": "gemini",
  };

  const provider = providerMap[providerChoice.trim()];

  if (!provider) {
    console.error(chalk.red("\n  ✖  Invalid choice. Run lemme config to try again.\n"));
    rl.close();
    process.exit(1);
  }

  // api key
  step(2, STEPS, "API key");
  const apiKey = await prompt(
    rl,
    chalk.dim(`\n  Enter your ${provider} API key: `),
  );

  if (!apiKey.trim()) {
    console.error(chalk.red("\n  ✖  API key cannot be empty.\n"));
    rl.close();
    process.exit(1);
  }

  // shell
  const detectedShell = detectShell();
  step(3, STEPS, "Shell");
  console.log();
  console.log(
    "    " + chalk.dim("1.") + "  zsh   " +
      (detectedShell === "zsh" ? chalk.green("← detected") : ""),
  );
  console.log(
    "    " + chalk.dim("2.") + "  bash  " +
      (detectedShell === "bash" ? chalk.green("← detected") : ""),
  );
  console.log(
    "    " + chalk.dim("3.") + "  fish  " +
      (detectedShell === "fish" ? chalk.green("← detected") : ""),
  );

  const shellChoice = await prompt(
    rl,
    chalk.dim(`\n  Enter 1, 2 or 3 (Enter for ${detectedShell}): `),
  );

  const shellMap: Record<string, Shell> = {
    "1": "zsh",
    "2": "bash",
    "3": "fish",
  };
  const shell: Shell = shellMap[shellChoice.trim()] ?? detectedShell;

  // autorun
  step(4, STEPS, "Auto-run");
  const autoRunAnswer = await prompt(
    rl,
    chalk.dim("\n  Run commands without confirmation? [y/N] "),
  );
  const autoRun = autoRunAnswer.trim().toLowerCase() === "y";

  // history
  step(5, STEPS, "History");
  const historyAnswer = await prompt(
    rl,
    chalk.dim("\n  Save command history to ~/.config/lemme/history.json? [Y/n] "),
  );
  const trimmed = historyAnswer.trim().toLowerCase();
  const history = trimmed === "" || trimmed === "y";

  const os = detectOS();
  const model = getDefaultModel(provider);

  writeConfig({
    provider,
    apiKey: apiKey.trim(),
    model,
    shell,
    os,
    autoRun,
    history,
  });

  console.log("\n  " + chalk.green("✔  Config saved.") + "\n");
  console.log("    " + chalk.dim("Provider :") + "  " + chalk.bold(provider));
  console.log("    " + chalk.dim("Model    :") + "  " + chalk.bold(model));
  console.log("    " + chalk.dim("Shell    :") + "  " + chalk.bold(shell));
  console.log("    " + chalk.dim("OS       :") + "  " + chalk.bold(os));
  console.log("    " + chalk.dim("Auto-run :") + "  " + chalk.bold(autoRun ? "yes" : "no"));
  console.log("    " + chalk.dim("History  :") + "  " + chalk.bold(history ? "yes" : "no"));
  console.log(
    "\n  " + chalk.dim("Try: ") + chalk.cyan("lemme push my branch to origin") + "\n",
  );

  rl.close();
}
