// Encyclopedic content — the major moons.
// Figures from NASA fact sheets, JPL SSD, and mission science summaries.

const orbitStats = (aKm, period, e, i) => [
  { label: 'Distance from parent', value: aKm, unit: 'km' },
  { label: 'Orbital period', value: period },
  { label: 'Eccentricity', value: String(e) },
  { label: 'Inclination', value: i, unit: '°' },
];

export const MOON_CONTENT = {
  // ── Earth ──
  moon: {
    summary:
      'The Moon is Earth’s constant companion and the only other world humans have walked upon. Born from the debris of a giant impact 4.5 billion years ago, it stabilises Earth’s axial tilt, drives the ocean tides, and preserves a pristine record of the early solar system.',
    facts: [
      'The Moon is drifting away from Earth at 3.8 cm per year — measured by laser reflectors left by Apollo crews.',
      'It is tidally locked: the same face has pointed at Earth for billions of years.',
      'Twelve people walked its surface between 1969 and 1972, returning 382 kg of rock.',
      'Relative to its planet it is a giant — over a quarter of Earth’s diameter.',
      'Permanently shadowed polar craters hold water ice at −230 °C, a key resource for future bases.',
    ],
    orbit: {
      e: 0.0549,
      stats: orbitStats('384,400', '27.32 days', 0.0549, '5.14 (to ecliptic)'),
      note:
        'The Moon’s orbit is inclined 5° to the ecliptic, which is why we don’t get eclipses every month — the alignments only occur when a new or full moon happens near the orbit’s nodes.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '1,737.4', unit: 'km' },
              { label: 'Mass', value: '7.35 × 10²²', unit: 'kg' },
              { label: 'Density', value: '3.34', unit: 'g/cm³' },
              { label: 'Gravity', value: '1.62', unit: 'm/s²' },
              { label: 'Day/night temp', value: '+120 / −130', unit: '°C' },
              { label: 'Albedo', value: '0.12' },
            ],
          },
          {
            type: 'p',
            text:
              'The near side is patched with dark maria — ancient lava seas that filled giant impact basins — while the far side is almost all bright, battered highlands. The South Pole–Aitken basin, 2,500 km across, is among the largest impact structures in the solar system.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'Apollo samples show the Moon is made of Earth-mantle-like rock, depleted in volatiles and iron — the signature of the giant-impact origin, in which a Mars-sized body struck the young Earth and the Moon condensed from the incandescent debris.',
          },
          {
            type: 'p',
            text:
              'It has a small (~350 km) partially molten core, a solid mantle, and a feldspar-rich crust that crystallised from a global magma ocean. Moonquakes still rumble faintly within.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Luna 2 first reached it in 1959; Apollo 11 landed Armstrong and Aldrin on 20 July 1969. After a decades-long lull, a new era is underway: China’s Chang’e programme returned the first far-side samples in 2024, India’s Chandrayaan-3 landed near the south pole, and NASA’s Artemis campaign aims to return crews within this decade.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'The Moon and Sun appear almost exactly the same size in our sky — a cosmic coincidence that makes total solar eclipses possible (and temporary: the Moon’s retreat will end them in a few hundred million years).' },
          { type: 'p', text: 'Footprints left by Apollo astronauts should survive for millions of years — there is no wind or rain to erase them.' },
          { type: 'p', text: 'A “month” literally derives from “Moon” — the 29.5-day cycle of phases is humanity’s oldest calendar.' },
        ],
      },
    ],
  },

  // ── Mars ──
  phobos: {
    summary:
      'Phobos is the larger and inner of Mars’s two small moons, a dark, potato-shaped body that skims just 6,000 km above the Martian surface — closer to its planet than any other moon. Tidal forces are dragging it inward toward eventual destruction.',
    facts: [
      'Phobos orbits Mars in 7.7 hours — three times per Martian day, rising in the west and setting in the east.',
      'It spirals inward ~1.8 metres per century; in ~50 million years it will crash or shred into a ring.',
      'The 9 km Stickney crater came within a whisker of shattering the whole moon.',
      'Mysterious parallel grooves striping its surface may be early signs of tidal break-up.',
      'It reflects only ~7% of sunlight — among the darkest objects in the solar system.',
    ],
    orbit: {
      e: 0.0151,
      stats: orbitStats('9,376', '7.66 hours', 0.0151, 1.08),
      note: 'Phobos orbits below the areosynchronous altitude, so tidal drag steadily saps its orbital energy — the opposite of our Moon’s slow retreat.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '27 × 22 × 18', unit: 'km' },
              { label: 'Mass', value: '1.07 × 10¹⁶', unit: 'kg' },
              { label: 'Density', value: '1.86', unit: 'g/cm³' },
              { label: 'Gravity', value: '0.0057', unit: 'm/s²' },
            ],
          },
          {
            type: 'p',
            text:
              'Its low density suggests a rubble pile with significant internal porosity. Whether Phobos is a captured asteroid or debris from a giant impact on Mars is still unresolved — JAXA’s MMX sample-return mission is designed to answer exactly that.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Phobos has been imaged closely by Mars orbiters from Viking to Mars Express, and photographed drifting across the Sun by rovers on the surface. JAXA’s Martian Moons eXploration (MMX) mission plans to land, grab a sample, and return it to Earth in the early 2030s.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'From Mars, Phobos crosses the sky in about four hours — and eclipses the Sun almost daily somewhere on the planet, though it is too small to cover it fully.' },
          { type: 'p', text: 'An astronaut could nearly jump off Phobos: escape velocity is just ~40 km/h.' },
        ],
      },
    ],
  },

  deimos: {
    summary:
      'Deimos is the outer, smaller moon of Mars — a gently smoothed lump of dark rock barely 12 km across. Fine dust fills its craters, giving it a softer look than its battered sibling Phobos.',
    facts: [
      'Deimos takes 30.3 hours per orbit, so from Mars it rises in the east and lingers in the sky for two and a half days.',
      'From the Martian surface it looks scarcely brighter than Venus does from Earth.',
      'Its two named craters, Swift and Voltaire, honour writers who “predicted” Mars’s two moons before their discovery.',
      'Like Phobos, it is tidally locked, always showing Mars the same face.',
      'Unlike Phobos, Deimos orbits high enough that it slowly drifts outward, not inward.',
    ],
    orbit: { e: 0.0002, stats: orbitStats('23,463', '30.3 hours', 0.0002, 1.79) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '15 × 12 × 11', unit: 'km' },
              { label: 'Mass', value: '1.5 × 10¹⁵', unit: 'kg' },
              { label: 'Density', value: '1.47', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.07' },
            ],
          },
          {
            type: 'p',
            text:
              'Deimos’s spectrum resembles D-type asteroids, rich in carbon. In 2023, close flybys by the UAE’s Hope orbiter revealed a composition that may instead match Mars itself — reviving the impact-debris origin theory.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Jonathan Swift wrote of Mars’s two moons in Gulliver’s Travels (1726) — 151 years before Asaph Hall actually found them.' },
          { type: 'p', text: 'Deimos means “dread”; with Phobos (“fear”), the twins are named for the sons of Ares, god of war.' },
        ],
      },
    ],
  },

  // ── Jupiter: the Galileans ──
  io: {
    summary:
      'Io is the most volcanically active body in the solar system — a sulphur-stained moon squeezed relentlessly by Jupiter’s tides until its interior melts. Hundreds of volcanoes resurface it continuously; it is the only moon with essentially no impact craters.',
    facts: [
      'Over 400 active volcanoes erupt on Io, some throwing plumes 500 km into space.',
      'Tidal flexing raises and lowers Io’s solid surface by up to 100 metres — a rock tide.',
      'Its lava lakes, like 200-km Loki Patera, are hotter than any terrestrial eruption today.',
      'Io feeds a plasma torus around Jupiter that powers the giant planet’s aurorae.',
      'Its colours come from sulphur: yellow plains, red rings around vents, white SO₂ frost.',
    ],
    orbit: {
      e: 0.0041,
      stats: orbitStats('421,700', '1.77 days', 0.0041, 0.04),
      note:
        'Io, Europa, and Ganymede are locked in a 1:2:4 Laplace resonance. The rhythmic tugs keep Io’s orbit slightly eccentric, and that eccentricity — worked against Jupiter’s immense tides — is the engine of its volcanism.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '1,821.6', unit: 'km' },
              { label: 'Mass', value: '8.93 × 10²²', unit: 'kg' },
              { label: 'Density', value: '3.53', unit: 'g/cm³' },
              { label: 'Gravity', value: '1.80', unit: 'm/s²' },
              { label: 'Surface temp', value: '−143 (to +1,600 at vents)', unit: '°C' },
            ],
          },
          {
            type: 'p',
            text:
              'Io is the densest moon known, essentially a rocky planet with an iron core. Mountains taller than Everest rise not from volcanism but from crustal blocks tilting as the surface endlessly buries itself in fresh lava.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'Silicate rock around a molten or partially molten interior; magnetometer data hint at a global subsurface magma ocean. A thin, patchy SO₂ atmosphere freezes out every time Io passes through Jupiter’s shadow.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Voyager 1 caught the first extraterrestrial volcanic eruption in 1979 — a plume rising off Io’s limb, spotted by navigation engineer Linda Morabito. Galileo flew through its plumes in the 1990s, and Juno’s 2023–24 flybys passed within 1,500 km, imaging lava lakes glowing in the dark.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Io erupts about 100 times more lava per year than all of Earth’s volcanoes combined.' },
          { type: 'p', text: 'Standing on Io, you would receive a lethal radiation dose in a day or two — it orbits deep inside Jupiter’s radiation belts.' },
        ],
      },
    ],
  },

  europa: {
    summary:
      'Europa hides a global saltwater ocean beneath a shell of fractured ice — an ocean holding perhaps twice the water of all Earth’s seas, kept liquid by tidal heating for four billion years. It is widely considered the most promising place to look for life beyond Earth.',
    facts: [
      'Europa’s ocean likely contains 2–3 times more liquid water than all of Earth’s oceans combined.',
      'Its ice shell is criss-crossed by reddish-brown cracks stained with salts and possibly sulphur compounds.',
      'The surface is one of the smoothest in the solar system — barely any craters, meaning it is geologically young.',
      'Hubble and Galileo data suggest intermittent water plumes venting from the shell.',
      'NASA’s Europa Clipper, the largest planetary spacecraft ever built, arrives in 2030.',
    ],
    orbit: { e: 0.009, stats: orbitStats('670,900', '3.55 days', 0.009, 0.47) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '1,560.8', unit: 'km' },
              { label: 'Mass', value: '4.80 × 10²²', unit: 'kg' },
              { label: 'Density', value: '3.01', unit: 'g/cm³' },
              { label: 'Gravity', value: '1.31', unit: 'm/s²' },
              { label: 'Surface temp', value: '−160', unit: '°C' },
              { label: 'Ice shell', value: '15–25', unit: 'km' },
            ],
          },
          {
            type: 'p',
            text:
              'Beneath the 15–25 km icy lid lies an ocean 60–150 km deep, in direct contact with a rocky seafloor — a configuration that could supply the chemistry life needs. “Chaos terrain” of rafted ice blocks records places where the ocean or shallow lakes have broken through.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'A layered world: iron core, rocky mantle, salty ocean, ice shell. The reddish surface stains are hydrated salts (likely magnesium and sodium sulphates or chlorides) delivered from below — a direct sample of the ocean, readable from orbit.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Galileo’s magnetometer made the key discovery in the late 1990s: an induced magnetic field betraying a conductive, salty, global ocean. Europa Clipper (launched October 2024) will make ~50 close flybys with ice-penetrating radar, and ESA’s JUICE will add two flybys en route to Ganymede.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Europa’s cracks trace looping patterns because the ice shell may rotate slightly faster than the interior, migrating over the ocean.' },
          { type: 'p', text: 'Arthur C. Clarke’s 2010 famously warned: “All these worlds are yours — except Europa. Attempt no landing there.”' },
        ],
      },
    ],
  },

  ganymede: {
    summary:
      'Ganymede is the largest moon in the solar system — bigger than the planet Mercury — and the only moon known to generate its own magnetic field. Beneath its ancient two-toned crust lies a buried saltwater ocean sandwiched between layers of ice.',
    facts: [
      'Ganymede is the solar system’s largest moon: 2,634 km in radius, 8% wider than Mercury.',
      'It is the only moon with an intrinsic magnetic field, complete with its own miniature aurorae.',
      'Hubble’s aurora measurements revealed a subsurface ocean that may hold more water than Earth’s.',
      'Its surface is split between dark, cratered terrain and lighter grooved terrain stretched by ancient tectonics.',
      'ESA’s JUICE spacecraft will become the first orbiter of another planet’s moon when it settles around Ganymede in the 2030s.',
    ],
    orbit: { e: 0.0013, stats: orbitStats('1,070,400', '7.15 days', 0.0013, 0.20) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '2,634.1', unit: 'km' },
              { label: 'Mass', value: '1.48 × 10²³', unit: 'kg' },
              { label: 'Density', value: '1.94', unit: 'g/cm³' },
              { label: 'Gravity', value: '1.43', unit: 'm/s²' },
              { label: 'Surface temp', value: '−163', unit: '°C' },
            ],
          },
          {
            type: 'p',
            text:
              'Though larger than Mercury, Ganymede has less than half its mass — it is roughly half water ice by weight. The bright grooved terrain covering two-thirds of the surface records an ancient episode of global expansion and resurfacing.',
          },
        ],
      },
      {
        id: 'magnetosphere',
        title: 'Magnetosphere',
        blocks: [
          {
            type: 'p',
            text:
              'A convecting liquid-iron core gives Ganymede a magnetic field ~1% of Earth’s — unique among moons — carving a small magnetosphere inside Jupiter’s enormous one. The interplay produces auroral belts whose rocking, measured by Hubble, revealed the conductive ocean below.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'A fully differentiated world: iron core, rock mantle, and a hydrosphere up to 800 km thick in which a salty ocean is likely layered between different phases of ice — an “ice sandwich” structure, with the ocean perhaps 100 km deep.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Voyager mapped it, Galileo discovered its magnetic field in 1996, and Juno flew within 1,038 km in 2021. ESA’s JUICE, launched in 2023, will orbit Ganymede itself — the mission’s final and primary destination.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'If Ganymede orbited the Sun instead of Jupiter, it would comfortably qualify as a planet.' },
          { type: 'p', text: 'Its 7.15-day orbit is exactly four times Io’s and twice Europa’s — the outer anchor of the Laplace resonance.' },
        ],
      },
    ],
  },

  callisto: {
    summary:
      'Callisto is the outermost Galilean moon and the most heavily cratered body in the solar system — a 4-billion-year-old surface essentially unchanged since the era of heavy bombardment. Even this quiet witness likely hides a salty ocean deep beneath its icy crust.',
    facts: [
      'Callisto’s surface is saturated with craters — nowhere is there room for a new crater that doesn’t overlap an old one.',
      'The Valhalla impact basin spans ~3,800 km in concentric rings, like a frozen splash.',
      'It orbits outside Jupiter’s worst radiation belts, making it the favoured site for a future crewed base in the Jovian system.',
      'Galileo data suggest a buried ocean ~250 km down.',
      'It is the least differentiated large moon — a mixed interior of rock and ice that never fully separated.',
    ],
    orbit: { e: 0.0074, stats: orbitStats('1,882,700', '16.69 days', 0.0074, 0.19) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '2,410.3', unit: 'km' },
              { label: 'Mass', value: '1.08 × 10²³', unit: 'kg' },
              { label: 'Density', value: '1.83', unit: 'g/cm³' },
              { label: 'Gravity', value: '1.24', unit: 'm/s²' },
              { label: 'Surface temp', value: '−155', unit: '°C' },
            ],
          },
          {
            type: 'p',
            text:
              'Nearly Mercury-sized, Callisto sits apart from the resonant dance of the inner three Galileans — no tidal heating, no resurfacing, just patient accumulation of craters and dark dust.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'Roughly half rock, half ice, only partially differentiated. Its induced magnetic signature, like Europa’s, points to a conducting saline layer — an ocean insulated beneath a very thick, cold shell.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Studied by Voyager and extensively by Galileo; JUICE will make 21 flybys in the 2030s, refining the case for its hidden ocean.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Callisto’s ancient surface is the solar system’s history book — its crater record calibrates ages across the outer planets.' },
        ],
      },
    ],
  },

  // ── Saturn ──
  mimas: {
    summary:
      'Mimas is Saturn’s innermost major moon, an icy body dominated by the 139-km crater Herschel that gives it an uncanny resemblance to the Death Star. In 2024, subtle wobbles in its rotation revealed something remarkable: a young ocean hiding beneath its battered shell.',
    facts: [
      'The Herschel crater is a third the diameter of Mimas itself; the impact nearly shattered the moon.',
      'Libration measurements imply a global ocean 20–30 km down — geologically young, perhaps under 25 million years old.',
      'Mimas orbits Saturn in less than one Earth day.',
      'Its gravity opened the Cassini Division, the great gap in Saturn’s rings, via a 2:1 resonance.',
      'Despite being mostly ice, its surface shows no cracks or geysers — the “stealth ocean” moon.',
    ],
    orbit: { e: 0.0196, stats: orbitStats('185,539', '22.6 hours', 0.0196, 1.57) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '198.2', unit: 'km' },
              { label: 'Mass', value: '3.75 × 10¹⁹', unit: 'kg' },
              { label: 'Density', value: '1.15', unit: 'g/cm³' },
              { label: 'Gravity', value: '0.064', unit: 'm/s²' },
            ],
          },
          {
            type: 'p',
            text:
              'Mimas is the smallest known body rounded by its own gravity. Its density barely exceeds water ice, and temperature maps from Cassini revealed a bizarre Pac-Man-shaped thermal pattern sculpted by high-energy electrons.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'The Death Star resemblance is pure coincidence — Star Wars was released three years before Voyager 1 imaged Herschel crater.' },
        ],
      },
    ],
  },

  enceladus: {
    summary:
      'Enceladus is a small moon with an outsized reputation: geysers at its south pole blast water from a buried ocean directly into space, where Cassini flew through and tasted them. Salts, silica, hydrogen, and organics in the plume make it a prime astrobiology target.',
    facts: [
      'Over 100 geysers erupt from the south-polar “tiger stripe” fractures, feeding Saturn’s E ring.',
      'Cassini flew through the plume and found salts, molecular hydrogen, and complex organics — the ingredients of habitability.',
      'Its global ocean sits atop a porous rocky core where hydrothermal vents likely operate, Earth-ocean style.',
      'Enceladus reflects nearly all sunlight — the most reflective body in the solar system.',
      'The moon is tiny: it would fit inside the border of Arizona.',
    ],
    orbit: {
      e: 0.0047,
      stats: orbitStats('238,042', '1.37 days', 0.0047, 0.01),
      note: 'A 2:1 resonance with Dione keeps Enceladus’s orbit slightly eccentric, and the resulting tidal kneading powers its geysers.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '252.1', unit: 'km' },
              { label: 'Mass', value: '1.08 × 10²⁰', unit: 'kg' },
              { label: 'Density', value: '1.61', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.99' },
              { label: 'Surface temp', value: '−198', unit: '°C' },
            ],
          },
          {
            type: 'p',
            text:
              'The south pole is startlingly young and crevassed while the north is old and cratered. The ice shell thins from ~25 km to under 5 km over the active pole, where the four tiger-stripe fissures flex and vent with the tides.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'A rocky core beneath a global ocean ~10 km deep, capped by ice. Nano-silica grains found in the E ring imply hot water (>90 °C) reacting with rock at the seafloor — active hydrothermal chemistry, right now.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Cassini transformed Enceladus from a bright dot into a world, diving within 49 km and directly sampling its ocean spray. Dedicated “plume-through” life-detection missions are among the most-proposed concepts in planetary science.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'It snows on Enceladus: plume fallback blankets the south pole in fresh powder estimated at ~100 m thick in places.' },
        ],
      },
    ],
  },

  tethys: {
    summary:
      'Tethys is a mid-sized Saturnian moon of almost pure water ice, scarred by the enormous Odysseus crater and split nearly in two by the vast canyon Ithaca Chasma.',
    facts: [
      'Its density (0.98 g/cm³) is less than water — Tethys is essentially a giant ice ball.',
      'Odysseus crater is 450 km wide, two-fifths the moon’s diameter.',
      'Ithaca Chasma runs 2,000 km — three-quarters of the way around the moon.',
      'Two tiny moons, Telesto and Calypso, share its orbit at the Lagrange points.',
      'Mysterious red arc streaks, seen by Cassini, remain unexplained.',
    ],
    orbit: { e: 0.0001, stats: orbitStats('294,672', '1.89 days', 0.0001, 1.09) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '531.1', unit: 'km' },
              { label: 'Mass', value: '6.17 × 10²⁰', unit: 'kg' },
              { label: 'Density', value: '0.98', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.80' },
            ],
          },
          {
            type: 'p',
            text:
              'Ithaca Chasma may have formed as Tethys’s early internal ocean froze and expanded, cracking the shell — or as the crust flexed under the shock of the Odysseus impact directly opposite.',
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'Tethys was discovered by Giovanni Cassini in 1684 — the spacecraft that later mapped it carried his name.' }] },
    ],
  },

  dione: {
    summary:
      'Dione is an icy moon wrapped in “wispy terrain” — bright networks of ice cliffs hundreds of metres high — with hints of a residual subsurface ocean and a whisper-thin oxygen exosphere.',
    facts: [
      'Its bright wisps are tectonic ice cliffs, not frost streaks as first thought.',
      'Cassini detected a faint O₂ exosphere — one molecule per 11 cm³.',
      'Gravity data hint at a buried ocean ~100 km down.',
      'Dione holds Enceladus in the 2:1 resonance that powers the latter’s geysers.',
      'Two co-orbital moons, Helene and Polydeuces, ride its Lagrange points.',
    ],
    orbit: { e: 0.0022, stats: orbitStats('377,415', '2.74 days', 0.0022, 0.02) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '561.4', unit: 'km' },
              { label: 'Mass', value: '1.10 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.48', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.70' },
            ],
          },
          {
            type: 'p',
            text:
              'Dione’s trailing hemisphere is darker and redder, coated by radiation-processed material, while the leading side is polished by E-ring ice dust from Enceladus.',
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'Like most Saturnian moons, Dione is named from Greek mythology — a Titaness, mother of Aphrodite in some tellings.' }] },
    ],
  },

  rhea: {
    summary:
      'Rhea is Saturn’s second-largest moon, a heavily cratered ice world. In 2008 Cassini data even hinted it might possess its own faint rings — which would have been a first for any moon — though later imaging left the question unresolved-to-negative.',
    facts: [
      'Rhea is about a third ice-free rock by mass; the rest is water ice.',
      'Its thin exosphere of oxygen and CO₂ was the first directly sampled at any icy moon.',
      'Possible ring arcs suggested by Cassini’s dust instruments were never confirmed by imaging.',
      'Two giant impact basins, Tirawa and Mamaldi, overlap on its leading face.',
      'It is named for the Titaness mother of the Olympian gods.',
    ],
    orbit: { e: 0.001, stats: orbitStats('527,068', '4.52 days', 0.001, 0.35) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '763.8', unit: 'km' },
              { label: 'Mass', value: '2.31 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.24', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.65' },
            ],
          },
          {
            type: 'p',
            text:
              'Rhea appears only partially differentiated — a nearly uniform mix of ice and rock, suggesting it never grew warm enough inside to fully separate into layers.',
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'From Rhea’s surface, Saturn would loom 30 times wider than the full Moon in Earth’s sky.' }] },
    ],
  },

  titan: {
    summary:
      'Titan is Saturn’s giant moon and one of the most Earth-like worlds in the solar system — the only moon with a dense atmosphere and the only place besides Earth with standing liquid on its surface: rivers, lakes, and seas of methane and ethane beneath an orange smog.',
    facts: [
      'Titan’s atmosphere is 1.45× denser than Earth’s at the surface — thick enough that a human could strap on wings and fly.',
      'Kraken Mare, its largest sea, is bigger than the Caspian and possibly 300 m deep.',
      'It rains methane: slow, fat drops falling through air 4× denser than ours.',
      'Beneath the ice crust lies a salty water ocean — a second, hidden habitable zone.',
      'Huygens’ 2005 touchdown remains the most distant landing in history.',
    ],
    orbit: { e: 0.0288, stats: orbitStats('1,221,870', '15.95 days', 0.0288, 0.35) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '2,574.7', unit: 'km' },
              { label: 'Mass', value: '1.35 × 10²³', unit: 'kg' },
              { label: 'Density', value: '1.88', unit: 'g/cm³' },
              { label: 'Gravity', value: '1.35', unit: 'm/s²' },
              { label: 'Surface temp', value: '−179', unit: '°C' },
              { label: 'Surface pressure', value: '1.45', unit: 'bar' },
            ],
          },
          {
            type: 'p',
            text:
              'Titan has weather, seasons, dunes, shorelines, and river deltas — a full “hydrologic” cycle running on methane at −179 °C. Its equatorial dune fields are built from organic sand; its poles cradle the lakes.',
          },
        ],
      },
      {
        id: 'atmosphere',
        title: 'Atmosphere',
        blocks: [
          {
            type: 'bars',
            items: [
              { label: 'Nitrogen', frac: 0.954, display: '95.4%' },
              { label: 'Methane', frac: 0.049, display: '4.9%' },
              { label: 'Hydrogen & organics', frac: 0.003, display: 'traces' },
            ],
          },
          {
            type: 'p',
            text:
              'Sunlight shatters methane high in the atmosphere, building an orange photochemical haze of complex organics that slowly snows onto the surface — a planet-scale chemistry experiment resembling early Earth’s, frozen mid-reaction.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'Layers of rock, high-pressure ice, a salty internal water ocean, and an ice shell ~100 km thick. The methane in the atmosphere must be replenished — cryovolcanism venting from the interior is the leading suspect.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Cassini mapped Titan by radar through 127 flybys, and ESA’s Huygens probe parachuted to its surface on 14 January 2005, transmitting from a frozen riverbed strewn with ice pebbles. NASA’s Dragonfly — a nuclear-powered octocopter — launches in 2028 to hop across the dunes in the mid-2030s.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Titan is the only place where you could stand beside a lake, watch rain fall, and see rivers flow — and none of it would be water.' },
          { type: 'p', text: 'Its haze hides the surface so completely that Titan’s landscapes were essentially unknown until Cassini’s radar arrived in 2004.' },
        ],
      },
    ],
  },

  iapetus: {
    summary:
      'Iapetus is Saturn’s two-faced moon: one hemisphere is coal-black, the other snow-bright — a mystery that puzzled astronomers for three centuries. It also wears a bizarre 13-km-high mountain ridge running precisely along its equator, like a seam on a walnut.',
    facts: [
      'Its leading face is ten times darker than its trailing face — Cassini (the astronomer) inferred this in the 1670s.',
      'The equatorial ridge rises 13 km, among the tallest mountain chains in the solar system.',
      'The dark coating is debris from the retrograde moon Phoebe, swept up like bugs on a windshield, amplified by thermal ice migration.',
      'Iapetus orbits far from Saturn at a steep 15.5° tilt — the only major moon with a good view of the rings.',
      'Its slightly squashed “walnut” shape is frozen in from a much faster ancient spin.',
    ],
    orbit: { e: 0.0283, stats: orbitStats('3,560,840', '79.3 days', 0.0283, 15.47) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '734.5', unit: 'km' },
              { label: 'Mass', value: '1.81 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.09', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.04–0.5' },
            ],
          },
          {
            type: 'p',
            text:
              'The two-tone pattern is self-reinforcing: dark regions absorb sunlight, warm up, and drive their ice to migrate to bright cold regions — darkening the dark side and brightening the bright side over eons.',
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'In 2001: A Space Odyssey (the novel), the monolith gateway sits on Iapetus — Arthur C. Clarke chose it for its strange two-toned face.' }] },
    ],
  },

  // ── Uranus ──
  miranda: {
    summary:
      'Miranda is the smallest and strangest of Uranus’s major moons — a jumbled patchwork of cliffs, grooves, and racetrack-like “coronae” that looks like a world smashed apart and reassembled. It hosts Verona Rupes, the tallest known cliff in the solar system.',
    facts: [
      'Verona Rupes drops up to 20 km — in Miranda’s feeble gravity, a fall would last about 12 minutes.',
      'Its three coronae are giant ovoid scars, likely from rising diapirs of warm ice.',
      'The chaotic surface may record an ancient episode of tidal heating in a now-broken resonance.',
      'Miranda was Voyager 2’s closest target at Uranus, imaged from just 29,000 km.',
      'It is named for Prospero’s daughter in The Tempest.',
    ],
    orbit: { e: 0.0013, stats: orbitStats('129,900', '1.41 days', 0.0013, 4.34) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '235.8', unit: 'km' },
              { label: 'Mass', value: '6.6 × 10¹⁹', unit: 'kg' },
              { label: 'Density', value: '1.20', unit: 'g/cm³' },
            ],
          },
          {
            type: 'p',
            text:
              'For a body so small, Miranda’s geology is absurdly energetic. The favoured explanation is tidal heating during past orbital resonances with Umbriel or Ariel, partially melting and remobilising its icy interior.',
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'Because of Uranus’s extreme tilt, Miranda’s poles — like its planet’s — spend decades in continuous sun or darkness.' }] },
    ],
  },

  ariel: {
    summary:
      'Ariel is the brightest of Uranus’s moons, with the youngest surface of the five — broad rift valleys with smooth floors suggest icy flows resurfaced it relatively recently in its history.',
    facts: [
      'Ariel’s canyons are floored with smooth material — possible ancient cryovolcanic flows.',
      'It reflects more light than any other Uranian moon.',
      'CO₂ ice detected on its trailing side may leak from a subsurface ocean.',
      'JWST spectra strengthen the case for internal activity.',
      'Its name comes from spirits in both Shakespeare’s Tempest and Pope’s Rape of the Lock.',
    ],
    orbit: { e: 0.0012, stats: orbitStats('190,900', '2.52 days', 0.0012, 0.04) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '578.9', unit: 'km' },
              { label: 'Mass', value: '1.25 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.59', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.53' },
            ],
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'Voyager 2 saw only Ariel’s southern half — its northern hemisphere has never been imaged.' }] },
    ],
  },

  umbriel: {
    summary:
      'Umbriel is the dark twin among Uranus’s moons — an ancient, heavily cratered surface reflecting barely 16% of sunlight, its gloom broken by one enigmatic bright ring: the floor of the crater Wunda.',
    facts: [
      'Umbriel is the darkest of Uranus’s major moons.',
      'Wunda’s bright ring, 131 km across, may be a deposit of CO₂ frost.',
      'Its surface is the oldest-looking of the five majors — almost untouched since formation.',
      'The name comes from the “dusky melancholy sprite” in Pope’s Rape of the Lock.',
      'Like all major Uranian moons, it orbits in the planet’s tipped equatorial plane.',
    ],
    orbit: { e: 0.0039, stats: orbitStats('266,000', '4.14 days', 0.0039, 0.13) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '584.7', unit: 'km' },
              { label: 'Mass', value: '1.28 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.46', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.16' },
            ],
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'Umbriel’s darkness is unexplained — its neighbours formed from the same material yet shine far brighter.' }] },
    ],
  },

  titania: {
    summary:
      'Titania is the largest moon of Uranus and the eighth largest in the solar system — an ice-rock world laced with enormous fault canyons that hint at an interior that once expanded as it froze, and possibly a thin residual ocean at depth.',
    facts: [
      'Messina Chasmata, its great canyon system, runs ~1,500 km.',
      'Titania is nearly half rock — dense for an outer-planet moon.',
      'Models allow a thin liquid layer at the ice–rock boundary even today.',
      'It was discovered by William Herschel in 1787, six years after he found Uranus itself.',
      'It is named for the queen of the fairies in A Midsummer Night’s Dream.',
    ],
    orbit: { e: 0.0011, stats: orbitStats('436,300', '8.71 days', 0.0011, 0.08) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '788.4', unit: 'km' },
              { label: 'Mass', value: '3.42 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.66', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.35' },
            ],
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'A 2001 stellar occultation showed Titania has no detectable atmosphere — surface pressure is under 10–20 nanobar.' }] },
    ],
  },

  oberon: {
    summary:
      'Oberon is the outermost major moon of Uranus, an old, deeply cratered ice-rock world whose craters are floored with mysterious dark material — possibly organic-rich matter erupted from within.',
    facts: [
      'A mountain ~6 km tall juts from Oberon’s limb in Voyager 2 images.',
      'Dark patches on crater floors may be cryovolcanic deposits.',
      'Oberon is the second largest Uranian moon after Titania.',
      'It spends part of each Uranian year outside the planet’s magnetosphere, directly exposed to the solar wind.',
      'It is named for the fairy king of A Midsummer Night’s Dream.',
    ],
    orbit: { e: 0.0014, stats: orbitStats('583,500', '13.46 days', 0.0014, 0.07) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '761.4', unit: 'km' },
              { label: 'Mass', value: '3.08 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.56', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.31' },
            ],
          },
        ],
      },
      { id: 'funfacts', title: 'Fun Facts', blocks: [{ type: 'p', text: 'Every feature on Oberon is named after Shakespearean tragedy — Hamlet, Othello, Macbeth, and Lear are all craters here.' }] },
    ],
  },

  // ── Neptune ──
  triton: {
    summary:
      'Triton is Neptune’s great moon and the solar system’s most spectacular captive: it orbits backwards, a kidnapped Kuiper Belt dwarf planet that likely resembles Pluto’s twin. Nitrogen geysers erupt through its polar ice cap on the coldest measured surface of any world.',
    facts: [
      'Triton orbits retrograde — the only large moon that does — the smoking gun of gravitational capture.',
      'Voyager 2 measured −235 °C, the coldest surface temperature ever recorded on a solar system body.',
      'Dark geysers of nitrogen gas jet 8 km high and streak downwind across the polar cap.',
      'Tidal decay is pulling Triton inward; in ~3.6 billion years Neptune will tear it into a ring.',
      'Its “cantaloupe terrain” of dimpled ice is found nowhere else.',
    ],
    orbit: {
      e: 0.000016,
      stats: orbitStats('354,759', '5.88 days (retrograde)', 0.000016, '157 (retrograde)'),
      note: 'Capture from the Kuiper Belt circularised Triton’s orbit almost perfectly — it is the most circular orbit of any large body known.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '1,353.4', unit: 'km' },
              { label: 'Mass', value: '2.14 × 10²²', unit: 'kg' },
              { label: 'Density', value: '2.06', unit: 'g/cm³' },
              { label: 'Gravity', value: '0.78', unit: 'm/s²' },
              { label: 'Surface temp', value: '−235', unit: '°C' },
            ],
          },
          {
            type: 'p',
            text:
              'Triton’s surface is young, sparsely cratered nitrogen and methane ice over a probable water-ammonia ocean kept liquid by tidal and radiogenic heat. Its thin nitrogen atmosphere (~14 microbar) even supports clouds and haze.',
          },
        ],
      },
      {
        id: 'atmosphere',
        title: 'Atmosphere',
        blocks: [
          {
            type: 'p',
            text:
              'A tenuous nitrogen envelope with traces of methane, in vapour equilibrium with the surface ice — when the ice warms slightly, the atmosphere thickens. Voyager saw haze layers and wind-blown plumes proving weather exists even at 14 millionths of Earth’s pressure.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'Denser than almost any outer-planet moon, Triton is roughly two-thirds rock beneath ices of N₂, CH₄, CO, CO₂, and water — a composition strikingly like Pluto’s, supporting a shared Kuiper Belt origin.',
          },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Only Voyager 2 has seen Triton up close — 40% of the surface, for a few hours, in 1989. The proposed Trident mission would return to map the rest and test whether an ocean truly hides inside.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'When captured, Triton probably had a companion (like Pluto has Charon) that was flung away in the exchange — the price of Neptune’s new moon.' },
        ],
      },
    ],
  },

  // ── Pluto ──
  charon: {
    summary:
      'Charon is Pluto’s giant companion — fully half its parent’s diameter, making Pluto–Charon the closest thing to a true double planet in the solar system. The two are mutually tidally locked, forever showing each other the same face across a 19,600-km gap.',
    facts: [
      'Charon is so large relative to Pluto that the pair orbit a point in open space between them.',
      'Its north pole is stained rust-red — “Mordor Macula” — by methane escaping from Pluto and freezing there.',
      'A colossal canyon system, Serenity Chasma, suggests an ancient internal ocean froze and burst the crust outward.',
      'A day on Charon, a day on Pluto, and their mutual orbit are all the same: 6.39 Earth days.',
      'It was discovered in 1978 as a subtle bump on blurry images of Pluto.',
    ],
    orbit: { e: 0.0002, stats: orbitStats('19,591', '6.39 days', 0.0002, 0.08) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '606', unit: 'km' },
              { label: 'Mass', value: '1.59 × 10²¹', unit: 'kg' },
              { label: 'Density', value: '1.70', unit: 'g/cm³' },
              { label: 'Gravity', value: '0.29', unit: 'm/s²' },
            ],
          },
          {
            type: 'p',
            text:
              'New Horizons revealed a surprisingly dramatic world: the smooth Vulcan Planitia plains (likely a frozen cryolava sea), tectonic belts, and mountains that appear to float in nitrogen-softened crust.',
          },
        ],
      },
      {
        id: 'composition',
        title: 'Composition',
        blocks: [
          {
            type: 'p',
            text:
              'Water ice dominates the surface — unlike Pluto’s volatile nitrogen frosts — over a rock-rich interior. Ammonia hydrates detected in fresh craters hint that briny slush may persist at depth.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Discoverer James Christy named Charon for the ferryman of Hades — but pronounced it “SHAR-on,” after his wife Charlene. Both pronunciations survive.' },
        ],
      },
    ],
  },

  // ── Jupiter (inner) ──
  amalthea: {
    summary:
      'Amalthea is Jupiter’s battered inner moon — a deep-red, potato-shaped rubble pile circling less than two Jupiter radii above the cloud tops. It is the reddest object known in the solar system, painted by sulphur blasted off Io.',
    facts: [
      'Amalthea radiates slightly more heat than it receives from the Sun, warmed by Jupiter’s tidal flexing and its intense radiation belt.',
      'It was the last moon discovered by eye at a telescope — Edward Barnard, 1892; every moon since has been found photographically.',
      'It orbits Jupiter in under 12 hours, deep inside Io’s orbit.',
      'Its density is below that of water ice — a loosely-bound pile of rubble that would fly apart if it spun much faster.',
      'The crater Pan is 100 km across — on a moon only ~250 km long.',
    ],
    orbit: { e: 0.003, stats: orbitStats('181,366', '11.95 hours', 0.003, 0.37) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '250 × 146 × 128', unit: 'km' },
              { label: 'Density', value: '0.86', unit: 'g/cm³' },
              { label: 'Albedo', value: '0.09' },
              { label: 'Discovered', value: '1892 (Barnard)' },
            ],
          },
          {
            type: 'p',
            text:
              'From Amalthea’s surface, Jupiter would fill a staggering 46° of sky — ninety times wider than our full Moon. Galileo imaged it repeatedly during its Jupiter tour; its icy-rubble interior suggests it formed farther out and was captured inward.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Amalthea was the nymph (or goat) who nursed the infant Zeus in Greek myth — a fitting name for the moon nestled closest to Jupiter’s great moons.' },
        ],
      },
    ],
  },

  // ── Saturn (irregulars) ──
  hyperion: {
    summary:
      'Hyperion is the solar system’s tumbling sponge: the largest known irregularly-shaped moon, with a porosity so high that impactors punch in rather than splash out, leaving a surface of deep, sharp-rimmed cells. It is the only moon known to rotate chaotically — its day is literally unpredictable.',
    facts: [
      'Hyperion’s rotation is formally chaotic: its spin axis and rate change unpredictably, driven by its odd shape, eccentric orbit, and Titan’s tugs.',
      'It is over 40% empty space — a rubble sponge whose craters stay deep and crisp because debris compresses instead of ejecting.',
      'It orbits in a 4:3 resonance with Titan — four Titan orbits for every three of Hyperion’s.',
      'During Cassini’s 2005 flyby, Hyperion zapped the spacecraft with a burst of static electricity — the first detected charged surface of a moon.',
      'No fixed day length exists — the "120 h" in this model is a stand-in for something nature refuses to pin down.',
    ],
    orbit: { e: 0.123, stats: orbitStats('1,481,010', '21.28 days', 0.123, 0.43) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '360 × 266 × 205', unit: 'km' },
              { label: 'Density', value: '0.54', unit: 'g/cm³' },
              { label: 'Porosity', value: '> 40', unit: '%' },
              { label: 'Albedo', value: '0.3' },
            ],
          },
          {
            type: 'p',
            text:
              'Hyperion may be a fragment of a larger moon shattered by an ancient impact — which would explain both its shape and the debris-strewn chaos of its spin.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Because its rotation is chaotic, you cannot predict where on Hyperion the Sun will rise — not even in principle, no matter how good your measurements.' },
        ],
      },
    ],
  },

  phoebe: {
    summary:
      'Phoebe is Saturn’s great outsider: a dark, retrograde moon orbiting four times farther out than any major moon, almost certainly a captured Centaur from the Kuiper Belt. Its shed dust forms Saturn’s colossal outer ring and paints one face of Iapetus black.',
    facts: [
      'Phoebe orbits backwards, 12.9 million km from Saturn — the fingerprint of gravitational capture.',
      'It is likely a captured Kuiper Belt object: round-ish, ice-rich, and chemically more like Pluto than like Saturn’s native moons.',
      'The Phoebe ring, discovered in 2009, spans over 10 million km — large enough to hold thousands of Saturns; it is fed by dust off Phoebe.',
      'That dust drifts inward and coats the leading face of Iapetus — solving a 300-year-old mystery.',
      'Cassini flew past in June 2004, eleven days before Saturn arrival — the mission’s first scientific encounter.',
    ],
    orbit: {
      e: 0.156,
      stats: orbitStats('12,947,780', '550.3 days (retrograde)', 0.156, '175 (retrograde)'),
      note: 'Phoebe orbits against the spin of Saturn and all its major moons — captured bodies keep whatever direction they arrived with.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '106.5', unit: 'km' },
              { label: 'Density', value: '1.64', unit: 'g/cm³' },
              { label: 'Rotation', value: '9.27', unit: 'h' },
              { label: 'Albedo', value: '0.06' },
            ],
          },
          {
            type: 'p',
            text:
              'Phoebe is dense for its size and roughly spherical — evidence it was born round in the early Kuiper Belt, migrated inward, and was snared by Saturn. Unlike the tidally-locked regulars, it still spins on its own 9.3-hour clock.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'If Phoebe is a captured Centaur, then Cassini visited a Kuiper Belt object a decade before New Horizons reached Pluto — Saturn just did the delivery.' },
        ],
      },
    ],
  },

  // ── Neptune ──
  proteus: {
    summary:
      'Proteus is Neptune’s second-largest moon and one of the darkest objects in the solar system — yet it went undiscovered until Voyager 2 arrived in 1989, hidden in Neptune’s glare. It sits right at the size limit where gravity begins to force a body round, and lost the battle.',
    facts: [
      'Proteus is about as large as a body can be while remaining irregular — any bigger and its own gravity would have pulled it into a sphere.',
      'Though larger than Nereid, it was found 40 years later: it hugs Neptune so closely that its glare hid it from every telescope.',
      'Its surface reflects just ~10% of sunlight — as dark as soot.',
      'The crater Pharos is ~230 km wide, over half the moon’s diameter.',
      'Like most of Neptune’s inner moons, it likely re-formed from debris after Triton’s violent capture.',
    ],
    orbit: { e: 0.0005, stats: orbitStats('117,646', '1.12 days', 0.0005, 0.08) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '210', unit: 'km' },
              { label: 'Dimensions', value: '424 × 390 × 396', unit: 'km' },
              { label: 'Albedo', value: '0.10' },
              { label: 'Discovered', value: '1989 (Voyager 2)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Proteus was the shape-shifting old man of the sea in Greek myth — apt for a moon caught mid-way between lumpy and round.' },
        ],
      },
    ],
  },

  nereid: {
    summary:
      'Nereid rides the wildest orbit of any known moon: an eccentricity of 0.75 swings it from 1.4 million to 9.7 million kilometres from Neptune every 360 days. It is most likely an original moon flung onto this rollercoaster when Triton crashed the party.',
    facts: [
      'Nereid’s orbital eccentricity (0.749) is the highest of any moon in the solar system — select it and admire the stretched ellipse.',
      'Its distance from Neptune varies sevenfold over each orbit.',
      'It was discovered in 1949 by Gerard Kuiper — the man the Kuiper Belt is named after.',
      'The leading theory: Nereid is a native moon scattered onto its wild orbit by the capture of Triton.',
      'Despite 30 years of study, its rotation was only pinned down (11.5 h) in 2016 — by the Kepler space telescope, moonlighting from planet-hunting.',
    ],
    orbit: {
      e: 0.749,
      stats: orbitStats('5,513,820', '360.1 days', 0.749, 7.23),
      note: 'The most eccentric moon orbit known — its periapsis-to-apoapsis swing is visible at a glance in the 3D view when Neptune is focused.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '≈ 170', unit: 'km' },
              { label: 'Rotation', value: '11.52', unit: 'h' },
              { label: 'Albedo', value: '0.16' },
              { label: 'Discovered', value: '1949 (Kuiper)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Voyager 2 could only photograph Nereid from 4.7 million km — it remains a fuzzy blob awaiting a future Neptune orbiter.' },
        ],
      },
    ],
  },

  // ── Eris ──
  dysnomia: {
    summary:
      'Dysnomia is the moon of the dwarf planet Eris and — at roughly 700 km across — one of the largest moons of any dwarf planet. Recent ALMA measurements show it has tidally locked its massive parent, making Eris–Dysnomia a slow-waltzing far cousin of Pluto–Charon.',
    facts: [
      'Dysnomia is large enough that it has tidally locked Eris itself: both now rotate in step with their 15.8-day mutual orbit.',
      'At ~700 km in diameter, it rivals mid-sized moons of Saturn — yet orbits a world 96 AU from the Sun.',
      'It is remarkably dark (albedo ~0.05), a stark contrast to brilliant, frost-covered Eris.',
      'Its discovery in 2005 is what allowed Eris to be weighed — revealing it as more massive than Pluto.',
      'Dysnomia, goddess of lawlessness, was Eris’s mythological daughter — and a wink at Lucy Lawless, TV’s Xena.',
    ],
    orbit: { e: 0.006, stats: orbitStats('37,273', '15.79 days', 0.006, '—') },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Diameter', value: '≈ 700', unit: 'km' },
              { label: 'Albedo', value: '≈ 0.05' },
              { label: 'Rotation', value: 'synchronous' },
              { label: 'Discovered', value: '2005 (Keck AO)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Dysnomia is so dark and Eris so bright that, despite being over half Eris’s diameter, it reflects less than 1/60th as much light.' },
        ],
      },
    ],
  },

  // ── Pluto's small moons ──
  styx: {
    summary:
      'Styx is the smallest and innermost of Pluto’s four little moons — a 16-km sliver of bright ice found by Hubble in 2012 while scouting collision hazards for New Horizons. Like its siblings, it tumbles chaotically in the shifting gravity of the Pluto–Charon binary.',
    facts: [
      'Styx was discovered less than three years before New Horizons flew past it.',
      'It tumbles chaotically — orbiting a binary means the gravitational field never repeats.',
      'Its bright, icy surface suggests it is a shard from the giant impact that made Charon.',
      'It completes an orbit in 20.2 days, in a near-resonant chain with Nix, Kerberos, and Hydra.',
      'Styx was the mythological river between Earth and the underworld — the boundary of Pluto’s realm.',
    ],
    orbit: { e: 0.006, stats: orbitStats('42,656', '20.16 days', 0.006, 0.8) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '16 × 9 × 8', unit: 'km' },
              { label: 'Rotation', value: 'chaotic (~3.2 d)' },
              { label: 'Discovered', value: '2012 (HST)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'All four small moons orbit in near 1:3:4:5:6 rhythm with Charon — the fossil of a resonant dance from their debris-disc birth.' },
        ],
      },
    ],
  },

  nix: {
    summary:
      'Nix is one of Pluto’s two mid-sized moons, discovered with Hydra in 2005. New Horizons caught it in surprising detail: a bright, elongated chunk of water ice with a mysterious rust-red splotch — probably the scar of a recent impact.',
    facts: [
      'New Horizons revealed a reddish region on Nix, likely exposed material from a crater — the only colour patch on any of the small moons.',
      'Nix spins chaotically; Hubble data showed its brightness varying unpredictably.',
      'Its surface is unexpectedly bright, suggesting relatively clean water ice.',
      'It shares its 2005 discovery announcement with Hydra — found while planning the New Horizons encounter.',
      'Nix (Nyx), goddess of night, was the mother of Charon in Greek myth.',
    ],
    orbit: { e: 0.002, stats: orbitStats('48,694', '24.85 days', 0.002, 0.13) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '50 × 35 × 33', unit: 'km' },
              { label: 'Rotation', value: 'chaotic (~1.8 d)' },
              { label: 'Albedo', value: '≈ 0.56' },
              { label: 'Discovered', value: '2005 (HST)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'If you stood on Nix, Pluto and Charon would wheel overhead in a slow double-planet ballet — while your own sky tumbled unpredictably.' },
        ],
      },
    ],
  },

  kerberos: {
    summary:
      'Kerberos is Pluto’s second-smallest moon, a faint double-lobed body discovered in 2011. Astronomers expected it to be coal-dark — its faintness suggested so — but New Horizons found bright ice, deepening the puzzle of how it formed.',
    facts: [
      'Kerberos is two lobes stuck together — a miniature contact binary, like Arrokoth.',
      'Predicted to be dark as charcoal, it turned out bright as dirty snow — its faintness comes from tiny size, not dark ground.',
      'It orbits between Nix and Hydra, in the debris-disc resonance chain.',
      'The name honours the three-headed hound guarding Pluto’s underworld.',
      'It was the last of Pluto’s moons to be imaged in detail — downlinked from New Horizons in late 2015.',
    ],
    orbit: { e: 0.003, stats: orbitStats('57,783', '32.17 days', 0.003, 0.4) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '19 × 10 × 9', unit: 'km' },
              { label: 'Rotation', value: 'chaotic (~5.3 d)' },
              { label: 'Discovered', value: '2011 (HST)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'The IAU spelling is Kerberos (Greek) rather than Cerberus (Latin) — the Latin name was already taken by an asteroid.' },
        ],
      },
    ],
  },

  hydra: {
    summary:
      'Hydra is the outermost of Pluto’s moons — an elongated, brilliantly icy body about 50 km long, discovered with Nix in 2005. It spins once every 10 hours, the fastest rotation in the Pluto system, hinting at an especially chaotic tumbling history.',
    facts: [
      'Hydra’s surface is nearly pure water ice — among the cleanest ice surfaces New Horizons measured anywhere.',
      'It rotates in ~10.3 hours despite a 38-day orbit — wildly unlocked, like all of Pluto’s small moons.',
      'It marks the outer edge of the known Pluto system, 65,000 km out.',
      'Its name honours the many-headed serpent of the underworld — and, quietly, the H in Hubble, which found it.',
      'With Nix, its 2005 discovery helped promote the New Horizons mission from “Pluto flyby” to “Pluto-system explorer.”',
    ],
    orbit: { e: 0.006, stats: orbitStats('64,738', '38.20 days', 0.006, 0.24) },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '65 × 45 × 25', unit: 'km' },
              { label: 'Rotation', value: '10.3', unit: 'h' },
              { label: 'Albedo', value: '≈ 0.83' },
              { label: 'Discovered', value: '2005 (HST)' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Nix and Hydra’s initials — N and H — are a deliberate tip of the hat to New Horizons, the mission that prompted their discovery.' },
        ],
      },
    ],
  },
};
