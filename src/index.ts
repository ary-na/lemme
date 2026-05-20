#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import { runSetup } from "./setup.js";
import { readConfig } from "./config.js";
import { getCommand } from "./ai.js";
import { confirmAndRun } from "./runner.js";

const args = process.argv.slice(2);
const query = args.join(" ").trim();

if (!query) {
  console.log(chalk.bold("\nUsage:"));
  console.log("  " + chalk.cyan("lemme <what you want to do>"));
  console.log("  " + chalk.cyan("lemme config"));
  console.log(chalk.dim("\nExample:"));
  console.log("  " + chalk.dim("lemme push my branch to origin\n"));
  process.exit(1);
}

if (query === "config") {
  await runSetup();
  process.exit(0);
}

const config = readConfig();

if (!config) {
  console.log(
    chalk.yellow("\n⚠ No config found. Run: ") + chalk.cyan("lemme config\n"),
  );
  process.exit(1);
}

const spinner = ora({ text: chalk.dim("Thinking..."), color: "cyan" }).start();
const command = await getCommand(query, config);
spinner.stop();

if (command.startsWith("ERROR:")) {
  console.error(chalk.red(`\n✖ ${command}\n`));
  process.exit(1);
}

await confirmAndRun(command);
