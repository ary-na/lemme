import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
import { type Config } from "./config.js";

const SYSTEM_PROMPT = `You are a shell command expert.
The user will describe what they want to do in natural language.
Respond with ONLY the exact shell command to run, nothing else.
No explanations, no markdown, no backticks, just the raw command.
If the request is ambiguous or cannot be expressed as a shell command, respond with: ERROR: <reason>`;

export async function getCommand(
  query: string,
  config: Config,
): Promise<string> {
  try {
    switch (config.provider) {
      case "claude":
        return await askClaude(query, config);
      case "openai":
        return await askOpenAI(query, config);
      case "groq":
        return await askGroq(query, config);
      case "gemini":
        return await askGemini(query, config);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(chalk.red(`\n✖ AI error: ${message}\n`));
    process.exit(1);
  }
}

async function askClaude(query: string, config: Config): Promise<string> {
  const client = new Anthropic({ apiKey: config.apiKey });
  const response = await client.messages.create({
    model: config.model,
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: query }],
  });
  const block = response.content[0];
  if (!block || block.type !== "text") return "";
  return block.text.trim();
}

async function askOpenAI(query: string, config: Config): Promise<string> {
  const client = new OpenAI({ apiKey: config.apiKey });
  const response = await client.chat.completions.create({
    model: config.model,
    max_tokens: 256,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}

async function askGroq(query: string, config: Config): Promise<string> {
  const client = new Groq({ apiKey: config.apiKey });
  const response = await client.chat.completions.create({
    model: config.model,
    max_tokens: 256,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}

async function askGemini(query: string, config: Config): Promise<string> {
  const client = new GoogleGenerativeAI(config.apiKey);
  const model = client.getGenerativeModel({
    model: config.model,
    systemInstruction: SYSTEM_PROMPT,
  });
  const response = await model.generateContent(query);
  return response.response.text().trim();
}
