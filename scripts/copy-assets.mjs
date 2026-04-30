#!/usr/bin/env node
/**
 * Copy rendered motion clips into dist/motion/ so the published HTML deck
 * can reference them at relative path motion/<name>.mp4.
 * Also generates a simple index.html landing page that loads the deck.
 */
import { existsSync, mkdirSync, copyFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC_MOTION = join(ROOT, "motion", "dist");
const DEST_MOTION = join(ROOT, "dist", "motion");
const DIST = join(ROOT, "dist");

mkdirSync(DEST_MOTION, { recursive: true });

if (existsSync(SRC_MOTION)) {
  for (const name of readdirSync(SRC_MOTION)) {
    const src = join(SRC_MOTION, name);
    if (!statSync(src).isFile()) continue;
    const dest = join(DEST_MOTION, name);
    copyFileSync(src, dest);
    console.log(`[copy-assets] ${name} → dist/motion/${name}`);
  }
} else {
  console.warn(`[copy-assets] ${SRC_MOTION} does not exist — no motion clips copied.`);
}

// Write a tiny landing page so /aedis-pitch-deck/ doesn't 404
const landing = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Aedis · CTO Pitch Deck</title>
  <meta name="description" content="Aedis — Agentic OS for Healthcare. CTO pitch deck for Ensign Group tech team.">
  <meta http-equiv="refresh" content="0; url=aedis-pitch.html">
  <style>
    html, body {
      margin: 0;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
      background: oklch(0.990 0.002 250);
      color: oklch(0.200 0.010 250);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
      letter-spacing: -0.005em;
    }
    a {
      color: oklch(0.620 0.160 258);
      text-decoration: none;
      font-weight: 600;
    }
    a:hover { text-decoration: underline; }
    .hint {
      font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
      color: oklch(0.580 0.006 250);
      font-size: 13px;
      letter-spacing: 0.04em;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
    }
  </style>
</head>
<body>
  <h1>Aedis · CTO pitch</h1>
  <p>Loading slides…</p>
  <p class="hint">If you are not redirected, <a href="aedis-pitch.html">open the deck</a> · <a href="aedis-pitch.pdf">PDF</a></p>
</body>
</html>
`;
writeFileSync(join(DIST, "index.html"), landing);
console.log("[copy-assets] wrote dist/index.html");

// Ensure .nojekyll so GitHub Pages serves files prefixed with _
writeFileSync(join(DIST, ".nojekyll"), "");
console.log("[copy-assets] wrote dist/.nojekyll");
