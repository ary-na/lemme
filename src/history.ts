import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";

const HISTORY_DIR = join(homedir(), ".config", "lemme");
const HISTORY_PATH = join(HISTORY_DIR, "history.json");

export interface HistoryEntry {
  query: string;
  command: string;
  timestamp: string;
}

export function saveHistory(query: string, command: string): void {
  const entry: HistoryEntry = {
    query,
    command,
    timestamp: new Date().toISOString(),
  };

  let entries: HistoryEntry[] = [];

  if (existsSync(HISTORY_PATH)) {
    try {
      const raw = readFileSync(HISTORY_PATH, "utf-8");
      entries = JSON.parse(raw) as HistoryEntry[];
    } catch {
      entries = [];
    }
  }

  entries.unshift(entry);

  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }

  writeFileSync(HISTORY_PATH, JSON.stringify(entries, null, 2));
}

export function showHistory(): void {
  if (!existsSync(HISTORY_PATH)) {
    console.log(chalk.yellow("\n⚠ No history found.\n"));
    process.exit(1);
  }

  try {
    const raw = readFileSync(HISTORY_PATH, "utf-8");
    const entries = JSON.parse(raw) as HistoryEntry[];

    if (entries.length === 0) {
      console.log(chalk.yellow("\n⚠ No history found.\n"));
      process.exit(1);
    }

    console.log("\n" + chalk.bold.cyan("🤖 lemme history") + "\n");

    entries.forEach((entry, i) => {
      const date = new Date(entry.timestamp).toLocaleString();
      console.log(chalk.dim(`${i + 1}.`) + " " + chalk.bold(entry.command));
      console.log("   " + chalk.dim(`"${entry.query}"`));
      console.log("   " + chalk.dim(date));
      console.log();
    });
  } catch {
    console.error(chalk.red("\n✖ Could not read history file.\n"));
    process.exit(1);
  }
}
