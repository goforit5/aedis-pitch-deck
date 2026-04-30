# Motion clips

HyperFrames compositions rendered to deterministic MP4 for embedding in the MARP deck.

## Compositions

| Name | Duration | Used in | Status |
| --- | --- | --- | --- |
| `phi-boundary` | 9s | slide 6 (PHI handling) | rendered |

## Render workflow

```bash
# From repo root
npm run build:motion
```

The script walks every subdirectory of `motion/` that contains an `index.html` and renders it to `motion/dist/<name>.mp4` at 1920×1080 / 30 fps / high quality. Rendered files are then copied into `dist/motion/` by `scripts/copy-assets.mjs`.

## Authoring rules

- **One composition per folder.** Folder name becomes MP4 name (`motion/foo/index.html` → `motion/dist/foo.mp4`).
- **Deterministic only.** No `Math.random`, no `Date.now`, no wall-clock animation. HyperFrames seeks the GSAP timeline frame by frame.
- **Mapped fonts only.** Use `Inter` (sans) and `JetBrains Mono` (mono). System fonts like SF Pro / Menlo do not render deterministically — see [HyperFrames font docs](https://hyperframes.heygen.com/docs/fonts).
- **Paused GSAP timeline.** Register on `window.__timelines["<composition-id>"]` with `gsap.timeline({ paused: true })`.
- **Brand alignment.** Reuse the Aedis oklch palette: bg `oklch(0.990 0.002 250)`, accent `oklch(0.620 0.160 258)`, accent-weak `oklch(0.955 0.035 258)`, ink-1 `oklch(0.200 0.010 250)`, ink-3 `oklch(0.540 0.008 250)`. Match the design tokens in `revamp/src/tokens.css` in the main Aedis repo.
- **16:9 always.** `data-width="1920"`, `data-height="1080"`.
- **Self-contained.** No external font/script downloads beyond GSAP CDN (which HyperFrames inlines automatically).

## Future clips (deferred)

Two additional motion ideas were scoped but deferred to keep build time reasonable:

1. **HITL flow (slide 7)** — agent suggests action → decision card materializes → human approves → audit row appends. Replace with static SVG/HTML diagram if pursued.
2. **Architecture overview (slide 5)** — six SaaS dashboards collapse into one Aedis control plane. Currently a static stacked-rows diagram (`section .arch`) which works well at 16:9 and is maintained inline in `slides.md`.

If/when added, follow the same naming convention: `motion/hitl-flow/index.html`, `motion/architecture-collapse/index.html`. The build pipeline is generic — no code changes needed.

## Troubleshooting

**Render fails with FFmpeg error** — install FFmpeg locally (`brew install ffmpeg` on macOS, `apt install ffmpeg` on Linux). HyperFrames shells out to FFmpeg for encoding.

**Output is garbled / fonts wrong** — confirm only mapped fonts are referenced. Run `npx hyperframes lint .` inside the composition folder to catch common mistakes.

**Slow render on first run** — HyperFrames calibrates worker count by sampling frame capture cost. The first 60 frames may emit a "calibration" warning; subsequent renders use cached calibration data.

**MP4 missing on slide preview PNGs** — MARP `--images png` exports a single-frame snapshot at frame 0. Video doesn't autoplay during snapshot, so you'll see the poster image (or empty space). The HTML deck (`dist/aedis-pitch.html`) plays motion correctly when opened in a browser.
