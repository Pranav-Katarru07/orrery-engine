// Encyclopedic content — asteroids & Kuiper Belt objects.
// Figures from NASA/JPL SBDB, Dawn and New Horizons mission results.

export const ASTEROID_CONTENT = {
  vesta: {
    summary:
      'Vesta is the second-most-massive asteroid and the brightest — the only one occasionally visible to the naked eye. It is no mere rock: Vesta is a surviving protoplanet with an iron core, basaltic lava plains, and a mountain nearly as tall as Olympus Mons, frozen mid-way through becoming a planet 4.5 billion years ago.',
    facts: [
      'Vesta is differentiated like a planet: iron–nickel core, rocky mantle, volcanic crust — a protoplanet that never finished growing.',
      'About 6% of all meteorites that fall to Earth (the HED meteorites) are chips knocked off Vesta.',
      'The Rheasilvia impact basin spans 500 km, with a central peak rising ~22 km — among the tallest mountains in the solar system.',
      'NASA’s Dawn spacecraft orbited Vesta for 14 months in 2011–2012 before flying on to Ceres.',
      'At its brightest, Vesta reaches magnitude 5.1 — visible without a telescope from dark skies.',
    ],
    orbit: {
      e: 0.0887,
      stats: [
        { label: 'Semi-major axis', value: '2.36', unit: 'AU' },
        { label: 'Orbital period', value: '3.63', unit: 'yr' },
        { label: 'Eccentricity', value: '0.0887' },
        { label: 'Inclination', value: '7.14', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '2.15 / 2.57', unit: 'AU' },
      ],
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '262.7', unit: 'km' },
              { label: 'Mass', value: '2.59 × 10²⁰', unit: 'kg' },
              { label: 'Density', value: '3.46', unit: 'g/cm³' },
              { label: 'Rotation', value: '5.34', unit: 'h' },
              { label: 'Albedo', value: '0.42' },
              { label: 'Discovered', value: '1807 (Olbers)' },
            ],
          },
          {
            type: 'p',
            text:
              'Two colossal impacts at the south pole — Rheasilvia atop the older Veneneia basin — excavated deep into Vesta’s mantle and flattened its shape, blasting out the debris family that still rains on Earth as meteorites.',
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
              'Vesta melted early in its life: radioactive heating separated an iron core (~110 km radius), an olivine mantle, and a basaltic crust — the same recipe as Earth, at 1/1000th the scale. Its surface is the brightest of any large asteroid, made of ancient frozen lava flows.',
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
              'Dawn arrived in July 2011 — the first spacecraft to orbit a main-belt asteroid — mapping every crater and confirming the Vesta–HED meteorite link before departing for Ceres in 2012, the only spacecraft ever to orbit two extraterrestrial worlds.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Holding an HED meteorite means holding a piece of Vesta’s crust — samples from a specific asteroid, delivered free of charge.' },
          { type: 'p', text: 'Rheasilvia’s central peak and Mars’s Olympus Mons are within a few kilometres of each other in height — on a body 25 times smaller.' },
        ],
      },
    ],
  },

  pallas: {
    summary:
      'Pallas is the third-most-massive asteroid and the strangest traveller of the big three: its orbit is tilted a wild 34.8° out of the solar system’s plane. Watch its orbit line in the 3D view knife through the belt at an angle nothing else matches.',
    facts: [
      'Pallas’s 34.8° orbital inclination is the highest of any large asteroid — it spends most of its time far above or below the belt.',
      'Telescope imaging in 2020 revealed a surface so saturated with craters it was nicknamed the “golf ball asteroid.”',
      'Its tilted, eccentric orbit means it slams into debris at ~11.5 km/s — nearly twice the belt average — cratering it relentlessly.',
      'Pallas was discovered in 1802 by Heinrich Olbers, the second asteroid ever found.',
      'The element palladium, discovered the following year, is named after it.',
    ],
    orbit: {
      e: 0.2302,
      stats: [
        { label: 'Semi-major axis', value: '2.77', unit: 'AU' },
        { label: 'Orbital period', value: '4.62', unit: 'yr' },
        { label: 'Eccentricity', value: '0.2302' },
        { label: 'Inclination', value: '34.84', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '2.13 / 3.41', unit: 'AU' },
      ],
      note:
        'Select Pallas and look at the scene: its brightened orbit line cuts diagonally through the flat plane of the asteroid belt — the most extreme inclination of any body this large inside Neptune.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '256', unit: 'km' },
              { label: 'Mass', value: '2.04 × 10²⁰', unit: 'kg' },
              { label: 'Density', value: '2.92', unit: 'g/cm³' },
              { label: 'Rotation', value: '7.81', unit: 'h' },
              { label: 'Albedo', value: '0.16' },
              { label: 'Discovered', value: '1802 (Olbers)' },
            ],
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
              'A B-type asteroid — dark, primitive, and water-rich, its surface likely laced with hydrated minerals. Like Vesta, Pallas appears to be an intact protoplanet, but one that formed wetter and never fully melted.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'No spacecraft has ever visited Pallas — its tilted orbit makes it one of the hardest large targets in the belt to reach.' },
          { type: 'p', text: 'For a few decades after discovery, Pallas (like Ceres) was counted as a full planet in astronomy textbooks.' },
        ],
      },
    ],
  },

  hygiea: {
    summary:
      'Hygiea is the fourth-largest object in the asteroid belt and the biggest of the dark, carbon-rich C-types that dominate its outer reaches. Telescope imaging in 2019 revealed it to be remarkably round — round enough that some astronomers argue it deserves dwarf-planet status.',
    facts: [
      'VLT imaging in 2019 showed Hygiea is nearly spherical — potentially qualifying it as the smallest dwarf planet.',
      'A cataclysmic impact ~2 billion years ago blasted out the 7,000-member Hygiea family and may have re-assembled the body into its round shape.',
      'It is the largest of the C-type (carbonaceous) asteroids, reflecting only ~7% of sunlight.',
      'Despite its size, Hygiea was found 46 years after Ceres — it is one of the darkest large objects in the belt.',
      'It is named for the Greek goddess of health — the root of the word “hygiene.”',
    ],
    orbit: {
      e: 0.1125,
      stats: [
        { label: 'Semi-major axis', value: '3.14', unit: 'AU' },
        { label: 'Orbital period', value: '5.56', unit: 'yr' },
        { label: 'Eccentricity', value: '0.1125' },
        { label: 'Inclination', value: '3.83', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '2.79 / 3.49', unit: 'AU' },
      ],
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '217', unit: 'km' },
              { label: 'Mass', value: '8.7 × 10¹⁹', unit: 'kg' },
              { label: 'Density', value: '2.06', unit: 'g/cm³' },
              { label: 'Rotation', value: '13.83', unit: 'h' },
              { label: 'Albedo', value: '0.07' },
              { label: 'Discovered', value: '1849 (de Gasparis)' },
            ],
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
              'Primitive carbonaceous material similar to the oldest meteorites, probably never strongly heated. If the 2019 shape measurements hold, Hygiea reached hydrostatic equilibrium not by mass but by being smashed apart and gravitationally re-assembled — a rounder phoenix.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'If the IAU ever promotes Hygiea, it would dethrone Ceres as the smallest official dwarf planet.' },
        ],
      },
    ],
  },

  arrokoth: {
    summary:
      'Arrokoth is the most distant and most primitive world ever explored — a 36-km two-lobed “space snowman” in the cold classical Kuiper Belt, flown past by New Horizons on New Year’s Day 2019. Its gently fused lobes are a 4.5-billion-year-old fossil of how planets first began to form.',
    facts: [
      'New Horizons flew past on 1 January 2019 — the most distant flyby in history, 6.6 billion km from Earth.',
      'Its two lobes are separate bodies that merged at walking pace, proving planetesimals formed by gentle gravitational collapse, not violent collisions.',
      'Arrokoth means “sky” in the Powhatan/Algonquian language; it was nicknamed Ultima Thule before its formal naming.',
      'It is the reddest object ever visited, coated in ancient organic tholins.',
      'As a “cold classical” KBO it has never been disturbed — the same orbit, same deep freeze, for 4.5 billion years.',
    ],
    orbit: {
      e: 0.0417,
      stats: [
        { label: 'Semi-major axis', value: '44.58', unit: 'AU' },
        { label: 'Orbital period', value: '≈ 298', unit: 'yr' },
        { label: 'Eccentricity', value: '0.0417' },
        { label: 'Inclination', value: '2.45', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '42.7 / 46.4', unit: 'AU' },
      ],
      note:
        'Arrokoth’s calm, low-inclination, near-circular orbit is exactly why New Horizons’ team chose it: a pristine, undisturbed member of the Kuiper Belt’s original population.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Length', value: '36', unit: 'km' },
              { label: 'Lobes', value: '21 + 15', unit: 'km' },
              { label: 'Rotation', value: '15.92', unit: 'h' },
              { label: 'Albedo', value: '0.06–0.16' },
              { label: 'Surface temp', value: '≈ −240', unit: '°C' },
              { label: 'Discovered', value: '2014 (HST)' },
            ],
          },
          {
            type: 'p',
            text:
              'The two flattened lobes — nicknamed “Ultima” and “Thule” — are joined at a bright, narrow neck. There are almost no craters: nothing much has happened here since the solar system’s first million years.',
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
              'Methanol ice, complex reddish organics, and probably water ice — but no detectable pure water bands, unusual even for the Kuiper Belt. Its uniform colour and composition across both lobes confirms they condensed from the same local cloud of the solar nebula.',
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
              'Discovered in 2014 by Hubble specifically as a flyby target for New Horizons after Pluto. The encounter data — trickling home at ~1 kbps until late 2020 — rewrote planet-formation theory: the “streaming instability” model of gentle pebble-cloud collapse is now the standard picture, thanks largely to this little snowman.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Queen guitarist (and astrophysicist) Brian May co-authored the stereo imaging study of Arrokoth — and released a single, “New Horizons,” for the flyby.' },
        ],
      },
    ],
  },
};
