import * as readline from "readline";
import { exec } from "child_process";
import chalk from "chalk";

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function run(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(chalk.dim(stderr));
      if (error) reject(error);
      else resolve();
    });
  });
}

export async function confirmAndRun(command: string, autoRun: boolean): Promise<void> {
  if (autoRun) {
    console.log("\n" + chalk.dim("⚡ auto-run  ") + chalk.bold.cyan("$ " + command));
  } else {
    console.log("\n" + chalk.dim("   command  ") + chalk.bold.cyan("$ " + command));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await prompt(rl, chalk.dim("\n  Run it? [Y/n] "));
    rl.close();

    const trimmed = answer.trim().toLowerCase();
    if (trimmed !== "" && trimmed !== "y") {
      console.log(chalk.yellow("\n  ⊘  Cancelled.\n"));
      process.exit(0);
    }
  }

  process.stdout.write("\n");

  try {
    await run(command);
    console.log(chalk.dim("\n  ✔  Done.\n"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red(`\n  ✖  Command failed: ${message}\n`));
    process.exit(1);
  }
}
