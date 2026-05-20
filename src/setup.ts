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

export async function runSetup(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n" + chalk.bold.cyan("🤖 lemme setup") + "\n");

  // provider
  console.log(chalk.bold("Which AI provider do you want to use?"));
  console.log(chalk.dim("  1.") + " Claude");
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

  // api key
  const apiKey = await prompt(
    rl,
    chalk.cyan(`\nEnter your ${chalk.bold(provider)} API key: `),
  );

  if (!apiKey.trim()) {
    console.error(chalk.red("\n✖ API key cannot be empty.\n"));
    rl.close();
    process.exit(1);
  }

  // shell
  const detectedShell = detectShell();
  console.log(chalk.bold("\nWhich shell do you use?"));
  console.log(
    chalk.dim("  1.") +
      " zsh  " +
      (detectedShell === "zsh" ? chalk.green("(detected)") : ""),
  );
  console.log(
    chalk.dim("  2.") +
      " bash " +
      (detectedShell === "bash" ? chalk.green("(detected)") : ""),
  );
  console.log(
    chalk.dim("  3.") +
      " fish " +
      (detectedShell === "fish" ? chalk.green("(detected)") : ""),
  );

  const shellChoice = await prompt(
    rl,
    chalk.cyan(`\nEnter 1, 2 or 3 (or press enter for ${detectedShell}): `),
  );

  const shellMap: Record<string, Shell> = {
    "1": "zsh",
    "2": "bash",
    "3": "fish",
  };
  const shell: Shell = shellMap[shellChoice.trim()] ?? detectedShell;

  // autorun
  const autoRunAnswer = await prompt(
    rl,
    chalk.cyan("\nAuto-run commands without confirmation? (y/n): "),
  );
  const autoRun = autoRunAnswer.trim().toLowerCase() === "y";

  // history
  const historyAnswer = await prompt(
    rl,
    chalk.cyan("Save command history to ~/.config/lemme/history.json? (y/n): "),
  );
  const history = historyAnswer.trim().toLowerCase() === "y";

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

  console.log(
    "\n" +
      chalk.green("✔ Config saved to ") +
      chalk.dim("~/.config/lemme/config.json"),
  );
  console.log(chalk.dim("  Provider : ") + chalk.bold(provider));
  console.log(chalk.dim("  Model    : ") + chalk.bold(model));
  console.log(chalk.dim("  Shell    : ") + chalk.bold(shell));
  console.log(chalk.dim("  OS       : ") + chalk.bold(os));
  console.log(chalk.dim("  Auto-run : ") + chalk.bold(autoRun ? "yes" : "no"));
  console.log(chalk.dim("  History  : ") + chalk.bold(history ? "yes" : "no"));
  console.log(
    "\n" +
      chalk.bold("You're all set! Try: ") +
      chalk.cyan("lemme push my branch to origin") +
      "\n",
  );

  rl.close();
}
