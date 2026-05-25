#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import { runSetup } from "./setup.js";
import { readConfig } from "./config.js";
import { getCommand } from "./ai.js";
import { confirmAndRun } from "./runner.js";
import { showConfig, resetConfig } from "./configCmd.js";
import { saveHistory, showHistory } from "./history.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const args = process.argv.slice(2);
const query = args.join(" ").trim();

if (!query) {
  console.log(
    "\n  " + chalk.bold("lemme") + chalk.dim(" — natural language to shell commands") + "\n",
  );
  console.log("  " + chalk.dim("Usage:"));
  console.log("    " + chalk.cyan("lemme") + " " + chalk.white("<what you want to do>") + "\n");
  console.log("  " + chalk.dim("Management:"));
  console.log(
    "    " + chalk.cyan("lemme config") + "            " + chalk.dim("configure AI provider & preferences"),
  );
  console.log(
    "    " + chalk.cyan("lemme config --show") + "     " + chalk.dim("show current config"),
  );
  console.log(
    "    " + chalk.cyan("lemme config --reset") + "    " + chalk.dim("reset config and API key"),
  );
  console.log(
    "    " + chalk.cyan("lemme history") + "           " + chalk.dim("show recent command history"),
  );
  console.log(
    "    " + chalk.cyan("lemme --version") + "         " + chalk.dim("show version"),
  );
  console.log(chalk.dim("\n  Example:"));
  console.log("    " + chalk.dim("lemme push my branch to origin") + "\n");
  process.exit(0);
}

if (query === "--version" || query === "-v") {
  console.log("  " + chalk.bold("lemme") + " " + chalk.dim(`v${version}`));
  process.exit(0);
}

if (query === "config") {
  await runSetup();
  process.exit(0);
}

if (query === "config --show") {
  showConfig();
  process.exit(0);
}

if (query === "config --reset") {
  await resetConfig();
  process.exit(0);
}

if (query === "history") {
  showHistory();
  process.exit(0);
}

const config = readConfig();

if (!config) {
  console.log(
    chalk.yellow("\n  ⚠  No config found. Run: ") + chalk.cyan("lemme config") + "\n",
  );
  process.exit(1);
}

const spinner = ora({
  text: chalk.dim(`Asking ${config.provider}…`),
  color: "cyan",
  prefixText: " ",
}).start();

const command = await getCommand(query, config);
spinner.stop();

if (command.startsWith("ERROR:")) {
  console.error(chalk.red(`\n  ✖  ${command}\n`));
  process.exit(1);
}

await confirmAndRun(command, config.autoRun);

if (config.history) {
  saveHistory(query, command);
}
