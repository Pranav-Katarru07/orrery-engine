import { AU_KM } from '../consts.js';

// The celestial body catalog. Positions come from the provider noted per body:
// the 8 planets, Pluto, the Moon, and the Galilean moons are engine-computed
// (full accuracy); remaining dwarfs/comets use JPL osculating elements
// (epoch 2020-05-31 unless noted); minor moons use parent-centric elements
// referenced to the parent's IAU equatorial plane — correct orbit geometry
// and period, unconstrained phase angle at epoch.
//
// accent.glow — the body's literal signature hue (scene highlights, glows)
// accent.ui   — contrast-boosted variant for text/controls on dark glass

const kmAU = (km) => km / AU_KM;
const EPOCH_2020 = Date.UTC(2020, 4, 31);

// Parent-centric moon orbit: a in km, period in days, i in deg relative to
// the parent's equator. Node/periapsis/phase angles are not observationally
// pinned for these; spread deterministically so systems don't look aligned.
function moonEl(aKm, periodDays, i, e = 0, seed = 0) {
  return {
    a: kmAU(aKm),
    e,
    i,
    om: (seed * 137.508) % 360,
    w: (seed * 73.13 + 40) % 360,
    M0: (seed * 251.7 + 113) % 360,
    epochMs: EPOCH_2020,
    periodDays,
  };
}

export const BODIES = [
  // ── Star ────────────────────────────────────────────────────────────────
  {
    id: 'sun', name: 'Sun', type: 'star', parent: null, provider: 'origin',
    radiusKm: 695700, rotationHours: 609.12,
    pole: { ra: 286.13, dec: 63.87 },
    texture: 'sun.jpg', emissive: true,
    accent: { glow: '#FFB627', ui: '#FFC966' },
    aliases: ['sol', 'the sun', 'star'],
    labelRank: 0,
  },

  // ── Planets ─────────────────────────────────────────────────────────────
  {
    id: 'mercury', name: 'Mercury', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 2439.7, rotationHours: 1407.6,
    pole: { ra: 281.01, dec: 61.42 },
    texture: 'mercury.jpg',
    accent: { glow: '#9C8F86', ui: '#CBBBAE' },
    orbitAU: 0.387, labelRank: 1,
  },
  {
    id: 'venus', name: 'Venus', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 6051.8, rotationHours: -5832.5,
    pole: { ra: 272.76, dec: 67.16 },
    texture: 'venus_atmosphere.jpg', surfaceTexture: 'venus_surface.jpg',
    atmosphere: { color: '#e8cf9a', intensity: 0.9, scale: 1.03 },
    accent: { glow: '#E8B96F', ui: '#F5CE8C' },
    orbitAU: 0.723, labelRank: 1,
  },
  {
    id: 'earth', name: 'Earth', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 6371, rotationHours: 23.9345,
    pole: { ra: 0, dec: 90 },
    texture: 'earth_day.jpg', nightTexture: 'earth_night.jpg', cloudTexture: 'earth_clouds.jpg',
    atmosphere: { color: '#6fa8ff', intensity: 1.0, scale: 1.035 },
    accent: { glow: '#4D9DE0', ui: '#74B9F2' },
    orbitAU: 1.0, labelRank: 1,
  },
  {
    id: 'mars', name: 'Mars', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 3389.5, rotationHours: 24.6229,
    pole: { ra: 317.68, dec: 52.89 },
    texture: 'mars.jpg',
    atmosphere: { color: '#d8a27a', intensity: 0.35, scale: 1.02 },
    accent: { glow: '#D1603D', ui: '#F0825C' },
    aliases: ['red planet'], orbitAU: 1.524, labelRank: 1,
  },
  {
    id: 'jupiter', name: 'Jupiter', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 69911, rotationHours: 9.925,
    pole: { ra: 268.06, dec: 64.5 },
    texture: 'jupiter.jpg',
    atmosphere: { color: '#e0c39a', intensity: 0.45, scale: 1.02 },
    rings: { innerKm: 122500, outerKm: 129000, opacity: 0.12, color: '#a99884' },
    accent: { glow: '#C99A6B', ui: '#E5BA8A' },
    orbitAU: 5.203, labelRank: 1,
  },
  {
    id: 'saturn', name: 'Saturn', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 58232, rotationHours: 10.656,
    pole: { ra: 40.59, dec: 83.54 },
    texture: 'saturn.jpg',
    atmosphere: { color: '#e6d3a3', intensity: 0.4, scale: 1.02 },
    rings: { innerKm: 74500, outerKm: 140220, opacity: 0.95, texture: 'saturn_rings.png' },
    accent: { glow: '#D8B56C', ui: '#EDCB85' },
    orbitAU: 9.537, labelRank: 1,
  },
  {
    id: 'uranus', name: 'Uranus', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 25362, rotationHours: -17.24,
    pole: { ra: 257.31, dec: -15.18 },
    texture: 'uranus.jpg',
    atmosphere: { color: '#9adfe0', intensity: 0.5, scale: 1.025 },
    rings: { innerKm: 41837, outerKm: 51149, opacity: 0.22, color: '#7d8b92' },
    accent: { glow: '#7FD4D4', ui: '#9AE6E4' },
    orbitAU: 19.19, labelRank: 1,
  },
  {
    id: 'neptune', name: 'Neptune', type: 'planet', parent: 'sun', provider: 'engine',
    radiusKm: 24622, rotationHours: 16.11,
    pole: { ra: 299.36, dec: 43.46 },
    texture: 'neptune.jpg',
    atmosphere: { color: '#5a7cf0', intensity: 0.55, scale: 1.025 },
    rings: { innerKm: 41900, outerKm: 62930, opacity: 0.16, color: '#6e7d95' },
    accent: { glow: '#3E66F9', ui: '#7490FF' },
    orbitAU: 30.07, labelRank: 1,
  },

  // ── Dwarf planets ───────────────────────────────────────────────────────
  {
    id: 'pluto', name: 'Pluto', type: 'dwarf', parent: 'sun', provider: 'engine',
    radiusKm: 1188.3, rotationHours: -153.29,
    pole: { ra: 132.99, dec: -6.16 },
    texture: 'pluto.png',
    atmosphere: { color: '#a8c4e0', intensity: 0.18, scale: 1.03 },
    accent: { glow: '#C9A78A', ui: '#E0C3A6' },
    orbitAU: 39.48, labelRank: 2,
  },
  {
    id: 'ceres', name: 'Ceres', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 2.766, e: 0.076, i: 10.594, om: 80.305, w: 73.597, M0: 77.372, epochMs: EPOCH_2020, periodDays: 1683.15 },
    radiusKm: 469.7, rotationHours: 9.074,
    pole: { ra: 291.42, dec: 66.76 },
    texture: 'ceres.jpg',
    accent: { glow: '#8E8E93', ui: '#B7B7BD' },
    orbitAU: 2.766, labelRank: 2,
  },
  {
    id: 'eris', name: 'Eris', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 67.86, e: 0.436, i: 44.04, om: 35.95, w: 151.64, M0: 205.99, epochMs: EPOCH_2020, periodDays: 203830 },
    radiusKm: 1163, rotationHours: 378.9,
    pole: { ra: 0, dec: 90 },
    texture: 'eris.jpg',
    accent: { glow: '#D8DDE4', ui: '#E9EDF3' },
    orbitAU: 67.86, labelRank: 2,
  },
  {
    id: 'haumea', name: 'Haumea', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 43.18, e: 0.191, i: 28.21, om: 122.16, w: 238.78, M0: 217.77, epochMs: EPOCH_2020, periodDays: 103410 },
    radiusKm: 780, rotationHours: 3.915,
    pole: { ra: 0, dec: 90 },
    texture: 'haumea.jpg',
    accent: { glow: '#CFD6DE', ui: '#E2E8F0' },
    orbitAU: 43.18, labelRank: 2,
  },
  {
    id: 'makemake', name: 'Makemake', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 45.43, e: 0.161, i: 28.98, om: 79.62, w: 294.83, M0: 165.51, epochMs: EPOCH_2020, periodDays: 111845 },
    radiusKm: 715, rotationHours: 22.83,
    pole: { ra: 0, dec: 90 },
    texture: 'makemake.jpg',
    accent: { glow: '#C58B5A', ui: '#E0A876' },
    orbitAU: 45.43, labelRank: 2,
  },
  {
    id: 'gonggong', name: 'Gonggong', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 67.33, e: 0.503, i: 30.74, om: 336.85, w: 207.67, M0: 106.0, epochMs: EPOCH_2020, periodDays: 202000 },
    radiusKm: 615, rotationHours: 22.4,
    pole: { ra: 0, dec: 90 },
    accent: { glow: '#B55239', ui: '#D97757' },
    aliases: ['2007 or10'], orbitAU: 67.33, labelRank: 3,
  },
  {
    id: 'quaoar', name: 'Quaoar', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 43.69, e: 0.039, i: 7.99, om: 188.83, w: 147.48, M0: 301.1, epochMs: EPOCH_2020, periodDays: 105495 },
    radiusKm: 545, rotationHours: 17.68,
    pole: { ra: 0, dec: 90 },
    accent: { glow: '#8A6E5C', ui: '#B29078' },
    orbitAU: 43.69, labelRank: 3,
  },
  {
    id: 'sedna', name: 'Sedna', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 506, e: 0.855, i: 11.93, om: 144.25, w: 311.35, M0: 358.16, epochMs: EPOCH_2020, periodDays: 4163000 },
    radiusKm: 500, rotationHours: 10.27,
    pole: { ra: 0, dec: 90 },
    accent: { glow: '#B04A32', ui: '#D66A4C' },
    orbitAU: 506, labelRank: 3,
  },
  {
    id: 'orcus', name: 'Orcus', type: 'dwarf', parent: 'sun', provider: 'kepler',
    elements: { a: 39.4, e: 0.226, i: 20.59, om: 268.8, w: 72.9, M0: 181.7, epochMs: EPOCH_2020, periodDays: 90180 },
    radiusKm: 458, rotationHours: 13.19,
    pole: { ra: 0, dec: 90 },
    accent: { glow: '#9AA3AD', ui: '#BFC8D2' },
    orbitAU: 39.4, labelRank: 3,
  },

  // ── Moons ───────────────────────────────────────────────────────────────
  {
    id: 'moon', name: 'The Moon', type: 'moon', parent: 'earth', provider: 'moon-engine',
    radiusKm: 1737.4, rotationHours: 655.72,
    pole: { ra: 266.86, dec: 65.64 },
    texture: 'moon.jpg',
    accent: { glow: '#AEB4BD', ui: '#CDD3DC' },
    aliases: ['luna', 'moon'], moonDistKm: 384400, labelRank: 2,
  },
  {
    id: 'phobos', name: 'Phobos', type: 'moon', parent: 'mars', provider: 'moon-kepler',
    elements: moonEl(9376, 0.3189, 1.08, 0.0151, 1),
    radiusKm: 11.1, rotationHours: 7.65, pole: { ra: 317.68, dec: 52.89 },
    texture: 'phobos.png',
    accent: { glow: '#8D8177', ui: '#B8AB9F' },
    moonDistKm: 9376, labelRank: 4,
  },
  {
    id: 'deimos', name: 'Deimos', type: 'moon', parent: 'mars', provider: 'moon-kepler',
    elements: moonEl(23463, 1.2624, 1.79, 0.0002, 2),
    radiusKm: 6.2, rotationHours: 30.3, pole: { ra: 317.68, dec: 52.89 },
    texture: 'deimos.png',
    accent: { glow: '#948A80', ui: '#BFB3A6' },
    moonDistKm: 23463, labelRank: 4,
  },
  {
    id: 'io', name: 'Io', type: 'moon', parent: 'jupiter', provider: 'jupmoon', jupmoonKey: 'io',
    radiusKm: 1821.6, rotationHours: 42.46, pole: { ra: 268.06, dec: 64.5 },
    texture: 'io.png',
    accent: { glow: '#D9C24A', ui: '#EDD968' },
    moonDistKm: 421700, labelRank: 3,
  },
  {
    id: 'europa', name: 'Europa', type: 'moon', parent: 'jupiter', provider: 'jupmoon', jupmoonKey: 'europa',
    radiusKm: 1560.8, rotationHours: 85.23, pole: { ra: 268.06, dec: 64.5 },
    texture: 'europa.png',
    accent: { glow: '#C7A97E', ui: '#E2C79B' },
    moonDistKm: 670900, labelRank: 3,
  },
  {
    id: 'ganymede', name: 'Ganymede', type: 'moon', parent: 'jupiter', provider: 'jupmoon', jupmoonKey: 'ganymede',
    radiusKm: 2634.1, rotationHours: 171.71, pole: { ra: 268.06, dec: 64.5 },
    texture: 'ganymede.png',
    accent: { glow: '#97897C', ui: '#C0B2A2' },
    moonDistKm: 1070400, labelRank: 3,
  },
  {
    id: 'callisto', name: 'Callisto', type: 'moon', parent: 'jupiter', provider: 'jupmoon', jupmoonKey: 'callisto',
    radiusKm: 2410.3, rotationHours: 400.54, pole: { ra: 268.06, dec: 64.5 },
    texture: 'callisto.png',
    accent: { glow: '#7A7268', ui: '#A69C8E' },
    moonDistKm: 1882700, labelRank: 3,
  },
  {
    id: 'mimas', name: 'Mimas', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(185539, 0.942, 1.57, 0.0196, 3),
    radiusKm: 198.2, rotationHours: 22.6, pole: { ra: 40.59, dec: 83.54 },
    texture: 'mimas.png',
    accent: { glow: '#A8ACB2', ui: '#C9CDD4' },
    moonDistKm: 185539, labelRank: 4,
  },
  {
    id: 'enceladus', name: 'Enceladus', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(238042, 1.37, 0.009, 0.0047, 4),
    radiusKm: 252.1, rotationHours: 32.9, pole: { ra: 40.59, dec: 83.54 },
    texture: 'enceladus.png',
    accent: { glow: '#DCE6EE', ui: '#ECF3F9' },
    moonDistKm: 238042, labelRank: 3,
  },
  {
    id: 'tethys', name: 'Tethys', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(294672, 1.888, 1.09, 0.0001, 5),
    radiusKm: 531, rotationHours: 45.3, pole: { ra: 40.59, dec: 83.54 },
    texture: 'tethys.png',
    accent: { glow: '#B2B8BF', ui: '#D2D8DF' },
    moonDistKm: 294672, labelRank: 4,
  },
  {
    id: 'dione', name: 'Dione', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(377415, 2.737, 0.02, 0.0022, 6),
    radiusKm: 561.4, rotationHours: 65.7, pole: { ra: 40.59, dec: 83.54 },
    texture: 'dione.png',
    accent: { glow: '#AFB4BB', ui: '#D0D5DC' },
    moonDistKm: 377415, labelRank: 4,
  },
  {
    id: 'rhea', name: 'Rhea', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(527068, 4.518, 0.35, 0.001, 7),
    radiusKm: 763.8, rotationHours: 108.4, pole: { ra: 40.59, dec: 83.54 },
    texture: 'rhea.png',
    accent: { glow: '#A9AEB5', ui: '#CBD0D7' },
    moonDistKm: 527068, labelRank: 4,
  },
  {
    id: 'titan', name: 'Titan', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(1221870, 15.945, 0.35, 0.0288, 8),
    radiusKm: 2574.7, rotationHours: 382.7, pole: { ra: 40.59, dec: 83.54 },
    texture: 'titan.png',
    atmosphere: { color: '#e0a84e', intensity: 0.85, scale: 1.06 },
    accent: { glow: '#D9A441', ui: '#EFC163' },
    moonDistKm: 1221870, labelRank: 3,
  },
  {
    id: 'iapetus', name: 'Iapetus', type: 'moon', parent: 'saturn', provider: 'moon-kepler',
    elements: moonEl(3560840, 79.33, 15.47, 0.0283, 9),
    radiusKm: 734.5, rotationHours: 1904, pole: { ra: 40.59, dec: 83.54 },
    texture: 'iapetus.png',
    accent: { glow: '#8F8677', ui: '#BCB2A0' },
    moonDistKm: 3560840, labelRank: 4,
  },
  {
    id: 'miranda', name: 'Miranda', type: 'moon', parent: 'uranus', provider: 'moon-kepler',
    elements: moonEl(129900, 1.413, 4.34, 0.0013, 10),
    radiusKm: 235.8, rotationHours: 33.9, pole: { ra: 257.31, dec: -15.18 },
    texture: 'miranda.png',
    accent: { glow: '#9FA6AE', ui: '#C5CCD4' },
    moonDistKm: 129900, labelRank: 4,
  },
  {
    id: 'ariel', name: 'Ariel', type: 'moon', parent: 'uranus', provider: 'moon-kepler',
    elements: moonEl(190900, 2.52, 0.04, 0.0012, 11),
    radiusKm: 578.9, rotationHours: 60.5, pole: { ra: 257.31, dec: -15.18 },
    texture: 'ariel.png',
    accent: { glow: '#AAB1B9', ui: '#CDD4DC' },
    moonDistKm: 190900, labelRank: 4,
  },
  {
    id: 'umbriel', name: 'Umbriel', type: 'moon', parent: 'uranus', provider: 'moon-kepler',
    elements: moonEl(266000, 4.144, 0.13, 0.0039, 12),
    radiusKm: 584.7, rotationHours: 99.5, pole: { ra: 257.31, dec: -15.18 },
    texture: 'umbriel.png',
    accent: { glow: '#7E848C', ui: '#ADB4BD' },
    moonDistKm: 266000, labelRank: 4,
  },
  {
    id: 'titania', name: 'Titania', type: 'moon', parent: 'uranus', provider: 'moon-kepler',
    elements: moonEl(436300, 8.706, 0.08, 0.0011, 13),
    radiusKm: 788.4, rotationHours: 208.9, pole: { ra: 257.31, dec: -15.18 },
    texture: 'titania.png',
    accent: { glow: '#A39E96', ui: '#C9C4BB' },
    moonDistKm: 436300, labelRank: 3,
  },
  {
    id: 'oberon', name: 'Oberon', type: 'moon', parent: 'uranus', provider: 'moon-kepler',
    elements: moonEl(583500, 13.46, 0.07, 0.0014, 14),
    radiusKm: 761.4, rotationHours: 323.1, pole: { ra: 257.31, dec: -15.18 },
    texture: 'oberon.png',
    accent: { glow: '#9B948B', ui: '#C3BCB2' },
    moonDistKm: 583500, labelRank: 4,
  },
  {
    id: 'triton', name: 'Triton', type: 'moon', parent: 'neptune', provider: 'moon-kepler',
    elements: moonEl(354759, 5.877, 156.9, 0.00002, 15),
    radiusKm: 1353.4, rotationHours: 141.0, pole: { ra: 299.36, dec: 43.46 },
    texture: 'triton.png',
    atmosphere: { color: '#cfd8e4', intensity: 0.15, scale: 1.02 },
    accent: { glow: '#D3B8B0', ui: '#E7D0C8' },
    moonDistKm: 354759, labelRank: 3,
  },
  {
    id: 'charon', name: 'Charon', type: 'moon', parent: 'pluto', provider: 'moon-kepler',
    elements: moonEl(19591, 6.387, 0.08, 0.0002, 16),
    radiusKm: 606, rotationHours: 153.29, pole: { ra: 132.99, dec: -6.16 },
    texture: 'charon.png',
    accent: { glow: '#A99C93', ui: '#CCBFB4' },
    moonDistKm: 19591, labelRank: 4,
  },

  // ── Comets ──────────────────────────────────────────────────────────────
  // M0 = 0 at a perihelion epoch; fixed-period propagation (real comet
  // periods wander by a few years per apparition — noted in content).
  {
    id: 'halley', name: "Halley's Comet", type: 'comet', parent: 'sun', provider: 'kepler',
    elements: { a: 17.83, e: 0.967, i: 162.26, om: 58.42, w: 111.33, M0: 0, epochMs: Date.UTC(1986, 1, 9), periodDays: 27510 },
    radiusKm: 5.5, rotationHours: 52.8, pole: { ra: 0, dec: 90 },
    accent: { glow: '#7FD6E8', ui: '#A2E4F1' },
    aliases: ['1p/halley', 'comet halley'], orbitAU: 17.83, labelRank: 3,
  },
  {
    id: 'halebopp', name: 'Comet Hale–Bopp', type: 'comet', parent: 'sun', provider: 'kepler',
    elements: { a: 186, e: 0.995, i: 89.43, om: 282.47, w: 130.59, M0: 0, epochMs: Date.UTC(1997, 3, 1), periodDays: 926000 },
    radiusKm: 30, rotationHours: 11.35, pole: { ra: 0, dec: 90 },
    accent: { glow: '#8FD8E0', ui: '#AEE7ED' },
    aliases: ['hale-bopp', 'c/1995 o1'], orbitAU: 186, labelRank: 3,
  },
  {
    id: 'churyumov', name: '67P/Churyumov–Gerasimenko', type: 'comet', parent: 'sun', provider: 'kepler',
    elements: { a: 3.462, e: 0.641, i: 7.04, om: 50.14, w: 12.78, M0: 0, epochMs: Date.UTC(2015, 7, 13), periodDays: 2355 },
    radiusKm: 2.0, rotationHours: 12.4, pole: { ra: 69.3, dec: 64.1 },
    accent: { glow: '#9BCFDC', ui: '#B9E0EA' },
    aliases: ['67p', 'churyumov-gerasimenko', 'rosetta comet'], orbitAU: 3.462, labelRank: 4,
  },
];

export const CATALOG = new Map(BODIES.map((b) => [b.id, b]));

export const childrenOf = (id) => BODIES.filter((b) => b.parent === id);
