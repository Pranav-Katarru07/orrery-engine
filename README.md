# Orrery Engine

A highly detailed, date-accurate, fully interactive 3D orrery of the solar system — built with Three.js and vanilla JavaScript, styled as a dark glassmorphic exhibit rather than a technical dashboard. Explore in real time, scrub through five centuries of history and future, click any body to focus and read its story, or hit spacebar and jump straight to it.

Desktop only — no mobile/touch support.

The full build brief this project was built from lives at [orrery-project-spec.md](orrery-project-spec.md).

## Quick start

```sh
npm install
npm run fetch-assets   # one-time: downloads textures + star catalogs (~17 MB)
npm run dev            # → http://localhost:5199
```

`npm run build` produces a static production bundle in `dist/`; `npm run preview` serves it locally.

## Controls

| Input | Action |
|---|---|
| Click a body or label | Cinematic fly-to camera move + opens its info panel |
| Drag | Orbit the focused body, or look around in free-fly |
| Scroll | Zoom / dolly |
| `W A S D`, `Q` / `E` (+ `Shift` to boost) | Free-fly through the scene |
| `Space` | Spotlight-style search — jump to any body or mission by name |
| `G` | Open the Gallery — a grid of every body; click a tile to visit it |
| `Esc` | Release focus / close panel, search, gallery, or lightbox |

## What's inside

- **61 explorable targets** — the Sun, 8 planets, 9 dwarf planets (Pluto, Ceres, Eris, Haumea, Makemake, Gonggong, Quaoar, Sedna, Orcus), 31 moons (from the Galileans down to Pluto's chaotically tumbling Styx), 3 large asteroids (Vesta, Pallas, Hygiea), the Kuiper Belt contact binary Arrokoth, 3 notable comets (Halley, Hale–Bopp, 67P), and 5 historic missions (Voyager 1 & 2, Cassini, New Horizons, Perseverance) with simplified static trajectories. Every body carries a full encyclopedic panel: Overview (summary + top-5 facts), Orbit (elements + true-shape-vs-circle diagram), and a type-specific deep-dive tab with subtabs (Physical, Atmosphere, Composition, Magnetosphere, Moons, Exploration, Fun Facts).
- **Real ephemerides** — the 8 planets, Pluto, the Moon, and the 4 Galilean moons are positioned live via `astronomy-engine`; the remaining dwarfs, minor moons, and comets propagate from JPL osculating Keplerian elements. Orbits are true ellipses with real eccentricity, inclination, and argument of periapsis — not circles.
- **Scrubbable timeline** — 1750 to 2250, playback from real-time up to a century per second, forward or reverse, defaulting to "right now."
- **Two scale modes** — realistic (true distances/sizes) and compressed (whole system visible at once), morphing smoothly between them; every mapping — body positions, radii, moon systems, orbit lines, asteroid/Kuiper belts — blends through one shared parameter.
- **Visual fidelity** — real NASA/Solar-System-Scope/Stellarium texture maps; an Earth day/night/city-lights shader with drifting clouds; atmospheric limb glow on ten bodies; ring systems for all four giant planets (not just Saturn); comet comas and tails that ignite near perihelion; correct IAU pole orientations and true (including retrograde) rotation rates; an accurate starfield built from a real star catalog with toggleable constellation lines; procedural asteroid and Kuiper belt populations (56,000 particles, orbits animated entirely in-shader).
- **Real imagery & galleries** — around 270 curated public-domain photos from the [NASA Images Library](https://images.nasa.gov/) cover 52 of the bodies. A **Gallery** window (toolbar button or `G`) shows a thumbnail of every world grouped by type; each body's Overview tab ends with a scrollable photo strip that opens a near-fullscreen lightbox with captions, credits, a filmstrip, and arrow-key/swipe navigation.
- **In-depth reference text** — beneath the headline facts, each major body has several researched paragraphs with source footnotes linking to NASA fact sheets and Wikipedia. Key astronomy terms are underlined and reveal a definition on hover, backed by a ~70-term glossary.
- **Interactive panel visuals** — hover-interactive layered interior cross-sections for 20 bodies, and animated magnetosphere diagrams for the 8 bodies with real magnetic fields.
- **Design system** — dark glassmorphism: translucent blurred glass, soft rounded corners, ambient gradient orbs. Global chrome stays strictly neutral grayscale; selecting a body dynamically re-skins its info panel, the scene's selection ring, and related UI accents to that body's real signature color, with a contrast-boosted variant used for text.

## Project structure

```
src/
  consts.js            shared constants: units, time range, easing
  core/
    scene.js            renderer, composer, bloom, lighting rig
    camera.js            free-fly + cinematic focus/orbit camera rig
  sim/
    ephemeris.js         position provider (engine + Keplerian, unified)
    kepler.js            generic Keplerian element propagator
    time.js              simulation clock (play/pause/speed/scrub)
  data/
    bodies.js            the body catalog: elements, physical data, accents
    missions.js          mission waypoints → resolved spline trajectories
    content/             hand-written encyclopedic panel content, per body type
    references.js        extended in-depth text + source citations
    gallery.js           curated NASA image lists per body (see public/gallery/)
    glossary.js          astronomy term definitions for the hover popovers
    visuals.js           interior cross-section + magnetosphere diagram data
  render/
    bodies.js            textured meshes, shaders, rings, rotation/tilt
    starfield.js         star catalog + constellation lines + Milky Way
    belts.js             procedural asteroid/Kuiper belt point clouds
    orbits.js             contextual orbit-line rendering
    labels.js             screen-space smart labels + selection ring
    scale.js             realistic ↔ compressed coordinate mapping
  ui/
    chrome.js            top bar: toggles, scale switch, search + gallery entries
    timeline.js          scrubber + playback controls
    search.js            Spotlight-style fuzzy search overlay
    gallery.js           global gallery grid window
    lightbox.js          near-fullscreen image slideshow
    thumbs.js            thumbnail source resolver (photo → texture → orb)
    panel.js             info panel: tabs, subtabs, visualizations, galleries
    viz.js               cross-section + magnetosphere SVG builders
    theme.js             accent re-skinning via CSS custom properties
  main.js                wiring: frame loop, selection state, picking
```

## Architecture notes

- The world frame is heliocentric ecliptic J2000; 1 scene unit = 1,000,000 km.
- Rendering is **camera-relative**: the GL camera stays fixed at the origin, and every object's mesh position is computed as `world position − camera position` in JS doubles before being handed to Three.js. This avoids float32 precision jitter at Kuiper Belt / Sedna range, where a naive world-space camera would visibly shake.
- Camera focus offsets are stored in units of the target body's radius, so the realistic ↔ compressed scale morph preserves visual framing automatically instead of requiring separate camera logic per mode.

## Known simplifications

- Minor-moon orbital phase angles (not radius, period, or inclination) are not observationally pinned in this dataset — geometry and timing are physically correct, but a given moon's exact position along its orbit at a specific date is illustrative rather than measured.
- Comet propagation uses a fixed mean orbital period; real short-period comets drift by months to years per apparition under planetary perturbation, so returns centuries from a comet's reference epoch may be off by roughly that much.
- Mission trajectories are simplified static paths through real flyby dates/positions, not continuously tracked telemetry, per the project spec.

## Asset licenses

Texture maps: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0), [Stellarium](https://github.com/Stellarium/stellarium) (GPL). Star and constellation data: [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3-Clause). Content figures sourced from NASA, JPL, and ESA public fact sheets.
