# 🤖 lemme

> Natural language to shell commands, powered by Claude, OpenAI, Groq, or Gemini.

[![npm version](https://img.shields.io/npm/v/lemme?color=black&style=flat-square)](https://www.npmjs.com/package/lemme)
[![npm downloads](https://img.shields.io/npm/dm/lemme?color=black&style=flat-square)](https://www.npmjs.com/package/lemme)
[![license](https://img.shields.io/npm/l/lemme?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/lemme?color=black&style=flat-square)](https://nodejs.org)

---

## The problem

You know what you want to do, but not the exact command:

```bash
# what was it again...
git push origin $(git rev-parse --abbrev-ref HEAD)
find . -name "*.log" -mtime +7 -delete
tar -czf archive.tar.gz ./src --exclude=node_modules
```

So you context switch — open a browser, ask ChatGPT, copy, paste, tweak, run. Every. Single. Time.

---

## The solution

```bash
lemme push my branch to origin
lemme delete log files older than 7 days
lemme compress the src folder excluding node modules
```

lemme translates what you mean into the exact shell command, shows it to you, and runs it on confirmation. No browser. No context switch. Stay in the terminal.

---

## Install

```bash
npm install -g lemme
```

---

## Setup

```bash
lemme config
```

Walks you through choosing your AI provider, entering your API key, and configuring your shell and preferences. Config is saved to `~/.config/lemme/config.json`.

---

## Usage

```bash
# any natural language query
lemme push my branch to origin
lemme undo my last commit but keep the changes
lemme find all files over 10mb in this directory
lemme kill the process running on port 3000
lemme compress all logs older than 7 days
lemme show me what changed in the last commit
```

lemme will show you the generated command and ask for confirmation before running anything.

---

## Commands

```bash
# run setup wizard
lemme config

# view current config
lemme config --show

# reset and re-run setup
lemme config --reset

# view command history
lemme history

# print installed version
lemme --version
lemme -v
```

---

## Providers

| Provider           | Model                      |
| ------------------ | -------------------------- |
| Claude (Anthropic) | `claude-sonnet-4-20250514` |
| OpenAI             | `gpt-4o`                   |
| Groq               | `llama-3.3-70b-versatile`  |
| Gemini (Google)    | `gemini-2.0-flash`         |

The default model is set automatically based on your chosen provider during setup.

---

## Config

Stored at `~/.config/lemme/config.json`:

| Field      | Description                                     | Default          |
| ---------- | ----------------------------------------------- | ---------------- |
| `provider` | AI provider to use                              | set during setup |
| `apiKey`   | API key for your provider                       | set during setup |
| `model`    | Model to use                                    | provider default |
| `shell`    | Your shell (`zsh`, `bash`, `fish`)              | auto-detected    |
| `os`       | Your OS (`macos`, `linux`, `windows`)           | auto-detected    |
| `autoRun`  | Skip confirmation and run immediately           | `false`          |
| `history`  | Save commands to `~/.config/lemme/history.json` | `false`          |

---

## How it works

```
1. you type    →  lemme push my branch to origin
2. lemme reads →  ~/.config/lemme/config.json
3. lemme asks  →  your AI provider with a strict system prompt
4. AI returns  →  git push origin my-branch
5. lemme shows →  Command: git push origin my-branch
6. you confirm →  Run it? (y/n)
7. lemme runs  →  ✔ done
```

The system prompt instructs the model to return only the raw shell command — no explanation, no markdown, no backticks. If the request can't be expressed as a shell command, it returns an error instead of guessing.

---

## History

If `history` is enabled in your config, every confirmed command is saved to `~/.config/lemme/history.json`:

```json
[
  {
    "query": "push my branch to origin",
    "command": "git push origin my-branch",
    "timestamp": "2026-05-20T10:32:00.000Z"
  }
]
```

View it anytime with:

```bash
lemme history
```

---

## Requirements

- Node.js `>=18`
- An API key from [Anthropic](https://console.anthropic.com), [OpenAI](https://platform.openai.com), [Groq](https://console.groq.com), or [Google AI Studio](https://aistudio.google.com)

---

## License

MIT © [arii.dev](https://arii.dev)
