import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";

const HISTORY_DIR = join(homedir(), ".config", "lemme");
const HISTORY_PATH = join(HISTORY_DIR, "history.json");
const MAX_ENTRIES = 100;

export interface HistoryEntry {
  query: string;
  command: string;
  timestamp: string;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
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

  if (entries.length > MAX_ENTRIES) {
    entries = entries.slice(0, MAX_ENTRIES);
  }

  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }

  writeFileSync(HISTORY_PATH, JSON.stringify(entries, null, 2));
}

export function showHistory(): void {
  if (!existsSync(HISTORY_PATH)) {
    console.log(chalk.yellow("\n  ⚠  No history found.\n"));
    process.exit(1);
  }

  try {
    const raw = readFileSync(HISTORY_PATH, "utf-8");
    const entries = JSON.parse(raw) as HistoryEntry[];

    if (entries.length === 0) {
      console.log(chalk.yellow("\n  ⚠  No history found.\n"));
      process.exit(1);
    }

    console.log("\n  " + chalk.bold("lemme history") + chalk.dim(` · ${entries.length} entries`) + "\n");

    entries.forEach((entry, i) => {
      const num = chalk.dim(String(i + 1).padStart(3) + "  ");
      const cmd = chalk.bold.cyan("$ " + entry.command);
      const meta =
        chalk.dim(`"${entry.query}"`) + "  " + chalk.dim(relativeTime(entry.timestamp));
      console.log(num + cmd);
      console.log("       " + meta);
      console.log();
    });
  } catch {
    console.error(chalk.red("\n  ✖  Could not read history file.\n"));
    process.exit(1);
  }
}
