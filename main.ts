// Fix Human Sleep: Funniest Patch Note — one changelog line announcing
// that human sleep has been fixed, in genuine release-note voice.
//
// The line is baked in as a plain constant: no network, no clock, no
// randomness, so every run produces the exact same entry file.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 160;

const NOTE =
  "v2.1.0: Fixed human sleep — 8 hours now counts as 8 hours. Known issue: Mondays still load slowly.";

// Count visible characters by code point, so multi-byte glyphs are not
// under-counted the way a raw UTF-16 length would under-count them.
function charCount(text: string): number {
  return [...text].length;
}

function assertEntry(text: string): void {
  const n = charCount(text);
  if (n < 1 || text.trim().length === 0) {
    throw new Error("entry is empty or only whitespace");
  }
  if (n > MAX_CHARS) {
    throw new Error(
      `entry is ${n} characters, ${n - MAX_CHARS} over the ${MAX_CHARS} limit`,
    );
  }
  if (text.trim() !== text) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function main(): void {
  assertEntry(NOTE);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), NOTE, "utf8");
  console.log(`wrote ${charCount(NOTE)}-character entry to ${join(dir, "entry.txt")}`);
}

main();
