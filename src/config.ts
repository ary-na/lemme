import { homedir, platform } from "os";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export type Provider = "claude" | "openai" | "groq" | "gemini";
export type Shell = "zsh" | "bash" | "fish";
export type OS = "macos" | "linux" | "windows";

export interface Config {
  provider: Provider;
  apiKey: string;
  model: string;
  shell: Shell;
  os: OS;
  autoRun: boolean;
  history: boolean;
}

const CONFIG_DIR = join(homedir(), ".config", "lemme");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export function readConfig(): Config | null {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw) as Config;
  } catch {
    return null;
  }
}

export function writeConfig(config: Config): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function getDefaultModel(provider: Provider): string {
  switch (provider) {
    case "claude":
      return "claude-sonnet-4-20250514";
    case "openai":
      return "gpt-4o";
    case "groq":
      return "llama-3.3-70b-versatile";
    case "gemini":
      return "gemini-2.0-flash";
  }
}

export function detectOS(): OS {
  switch (platform()) {
    case "darwin":
      return "macos";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
}

export function detectShell(): Shell {
  const shell = process.env["SHELL"] ?? "";
  if (shell.includes("zsh")) return "zsh";
  if (shell.includes("fish")) return "fish";
  return "bash";
}
