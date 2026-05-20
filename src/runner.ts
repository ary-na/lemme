import * as readline from "readline";
import { exec } from "child_process";
import chalk from "chalk";

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export async function confirmAndRun(command: string): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n" + chalk.bold("Command: ") + chalk.cyan(command));

  const answer = await prompt(rl, chalk.dim("\nRun it? (y/n): "));
  rl.close();

  if (answer.trim().toLowerCase() !== "y") {
    console.log(chalk.yellow("\n⊘ Cancelled.\n"));
    process.exit(0);
  }

  console.log();

  exec(command, (error, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(chalk.dim(stderr));
    if (error) {
      console.error(chalk.red(`\n✖ Command failed: ${error.message}\n`));
      process.exit(1);
    }
  });
}
