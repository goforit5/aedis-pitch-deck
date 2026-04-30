#!/usr/bin/env node
/**
 * Build all HyperFrames compositions to MP4.
 * Resilient: if hyperframes is unavailable or a render fails, the script
 * exits non-zero only if --strict is set, otherwise it warns and continues
 * so the slide deck can still build with whatever motion already exists.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const MOTION_DIR = join(ROOT, "motion");
const DIST_DIR = join(MOTION_DIR, "dist");

const strict = process.argv.includes("--strict");

mkdirSync(DIST_DIR, { recursive: true });

if (!existsSync(MOTION_DIR)) {
  console.log("[build-motion] No motion/ directory; skipping.");
  process.exit(0);
}

const compositions = readdirSync(MOTION_DIR)
  .filter((name) => {
    const path = join(MOTION_DIR, name);
    if (!statSync(path).isDirectory()) return false;
    return existsSync(join(path, "index.html"));
  });

if (compositions.length === 0) {
  console.log("[build-motion] No compositions found; skipping.");
  process.exit(0);
}

console.log(
  `[build-motion] Found ${compositions.length} composition(s): ${compositions.join(", ")}`
);

let failed = 0;
for (const name of compositions) {
  const compDir = join(MOTION_DIR, name);
  const out = join(DIST_DIR, `${name}.mp4`);
  console.log(`[build-motion] Rendering ${name} -> ${out}`);
  try {
    execFileSync(
      "npx",
      [
        "-y",
        "hyperframes",
        "render",
        ".",
        "--output",
        out,
        "--fps",
        "30",
        "--quality",
        "high",
        "--quiet",
      ],
      { cwd: compDir, stdio: "inherit", timeout: 8 * 60 * 1000 }
    );
  } catch (err) {
    failed++;
    console.error(`[build-motion] FAILED to render ${name}: ${err.message}`);
    if (strict) process.exit(1);
  }
}

if (failed > 0 && !strict) {
  console.warn(
    `[build-motion] ${failed} composition(s) failed; continuing because --strict not set.`
  );
}
