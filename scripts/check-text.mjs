import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skippedDirs = new Set([".git", ".next", "node_modules"]);
const checkedExtensions = new Set([".ts", ".tsx", ".md", ".mjs", ".json"]);
const badPatterns = [
  /�/,
  /[РС][\u00a0-\u00bf\u0400-\u042f\u0450-\u045f]/,
  /вЂ/,
  /в‰/,
  /рџ/,
  /пё/,
  /����/,
  /\bx\?/,
  /\bb\?/,
  /\bax\?/,
];

function extensionOf(file) {
  const dot = file.lastIndexOf(".");
  return dot === -1 ? "" : file.slice(dot);
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const failures = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!skippedDirs.has(entry.name)) {
        failures.push(...walk(join(dir, entry.name)));
      }
      continue;
    }

    if (!entry.isFile() || !checkedExtensions.has(extensionOf(entry.name))) continue;

    const fullPath = join(dir, entry.name);
    if (fullPath.endsWith(join("scripts", "check-text.mjs"))) continue;

    const text = readFileSync(fullPath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (badPatterns.some((pattern) => pattern.test(line))) {
        failures.push(`${fullPath}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  return failures;
}

const failures = walk(root);

if (failures.length > 0) {
  console.error("Found suspicious mojibake or replacement characters:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Text check passed.");
