#!/usr/bin/env node

const args = process.argv.slice(2);
const query = args.join(" ").trim();

if (!query) {
  console.log("Usage: lemme <what you want to do>");
  console.log("Example: lemme push my branch to origin");
  process.exit(1);
}

console.log(`You asked: ${query}`);
