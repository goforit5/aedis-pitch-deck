# Aedis CTO pitch deck

Internal MARP slide deck + HyperFrames motion clips for Andrew's pitch to Ensign Group's CTO and tech team.

- **Live deck**: <https://goforit5.github.io/aedis-pitch-deck/>
- **Source**: [`slides.md`](slides.md)
- **Theme**: [`assets/theme.css`](assets/theme.css) — Apple HIG, oklch palette matching `revamp/src/tokens.css` in [`goforit5/Aedis`](https://github.com/goforit5/Aedis)
- **Motion**: [`motion/phi-boundary/index.html`](motion/phi-boundary/index.html) — HyperFrames composition rendering the PHI tokenization boundary clip

## Stack

| Layer | Tool | Version |
| --- | --- | --- |
| Slides | [`@marp-team/marp-cli`](https://github.com/marp-team/marp-cli) | ^4.3.1 |
| Motion | [`hyperframes`](https://github.com/heygen-com/hyperframes) | 0.4.x |
| Animation | GSAP timeline (paused, deterministic seek) | 3.14.2 |
| Render | Headless Chrome + FFmpeg | bundled |
| Hosting | GitHub Pages | gh-pages |

## Local build

```bash
npm install               # one-time
npm run build:motion      # renders motion/<name>/index.html → motion/dist/<name>.mp4
npm run build:slides      # renders slides.md → dist/aedis-pitch.html
npm run build:pdf         # renders slides.md → dist/aedis-pitch.pdf
npm run build             # all of the above
```

Open `dist/index.html` in a browser to view the deck. The PHI-boundary motion clip autoplays inline on slide 6.

## Authoring

- Slides are MARP markdown — see the [MARP docs](https://marpit.marp.app/) for syntax.
- Speaker notes are HTML comments inside each slide section. They are not rendered to viewers but are included in the HTML source for archival.
- Custom utility classes (`.card`, `.grid.cols-2`, `.pill`, `.arch`, `.arch-row`) are defined in `assets/theme.css`.
- Slides 5–11 cite specific HIPAA Security Rule sections (§164.502(d), §164.312(b), §164.312(a)(1), §164.308(a)(4), §164.312(c)(1)) and NIST SP 800-53 / SP 800-66r2 controls. Keep citations accurate when editing.

## Motion compositions

Each subdirectory of `motion/` is a standalone HyperFrames project with an `index.html` entry. The build script (`scripts/build-motion.mjs`) walks `motion/` and renders every composition that has an `index.html`.

To add a new clip:

1. `mkdir motion/<name>`
2. Author `motion/<name>/index.html` following the HyperFrames composition pattern (data-composition-id, data-duration, paused GSAP timeline registered on `window.__timelines`)
3. Reference the rendered MP4 from `slides.md` as `<video class="motion" src="motion/<name>.mp4" autoplay muted loop playsinline></video>`
4. `npm run build` will render and copy the MP4 into `dist/motion/`

Use mapped fonts (`Inter`, `JetBrains Mono`) for deterministic rendering — see HyperFrames' [font deterministic mapping](https://hyperframes.heygen.com/docs/fonts).

## CI / deploy

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Renders motion clips (cached on `motion/**/*.html` hash to save ~3 min when sources unchanged)
2. Builds MARP HTML + PDF
3. Copies rendered MP4s into `dist/motion/`
4. Uploads `dist/` as a Pages artifact and deploys to `https://goforit5.github.io/aedis-pitch-deck/`

## Audience reference

This deck is **architecture-focused**, designed for Ensign's CTO and tech team — not Barry directly. The business pitch lives in [`goforit5/Aedis`](https://github.com/goforit5/Aedis) under `public/presentation.html`. Both decks share design language but have different content emphasis.

## Privacy

Repo is **private** under `goforit5`. Per Andrew's global rule, all repos under this org are private; the deck is published to GitHub Pages but the source remains internal.
