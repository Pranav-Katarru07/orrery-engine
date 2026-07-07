// Encyclopedic content — comets.
// Orbital propagation here uses a fixed mean period; real comet periods
// wander a few years per apparition from planetary perturbations and jets.

export const COMET_CONTENT = {
  halley: {
    summary:
      'Halley’s Comet is the most famous comet in history — the first proven to return on schedule, visiting the inner solar system every ~76 years. Records of its apparitions stretch back to 240 BC; its next return is due in mid-2061.',
    facts: [
      'Edmond Halley predicted in 1705 that the comets of 1531, 1607, and 1682 were one object that would return in 1758 — it did, after his death, and took his name.',
      'Chinese astronomers recorded Halley in 240 BC; it appears on the Bayeux Tapestry for the 1066 apparition.',
      'ESA’s Giotto flew within 596 km of the nucleus in 1986 — the first close-up of any comet: a dark, peanut-shaped body 15 km long.',
      'The nucleus is darker than coal, reflecting ~4% of sunlight, venting bright jets from just 10% of its surface.',
      'Halley’s debris causes two annual meteor showers: the Eta Aquariids (May) and Orionids (October).',
    ],
    orbit: {
      e: 0.967,
      stats: [
        { label: 'Semi-major axis', value: '17.8', unit: 'AU' },
        { label: 'Orbital period', value: '≈ 76', unit: 'yr' },
        { label: 'Eccentricity', value: '0.967' },
        { label: 'Inclination', value: '162.3° (retrograde)' },
        { label: 'Perihelion / Aphelion', value: '0.59 / 35.1', unit: 'AU' },
      ],
      note:
        'Halley orbits backwards — against the flow of the planets — diving from beyond Neptune to inside Venus’s orbit. Scrub the timeline to 1910, 1986, or 2061 to catch it sweeping through the inner system.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Nucleus dimensions', value: '15 × 8 × 8', unit: 'km' },
              { label: 'Mass', value: '2.2 × 10¹⁴', unit: 'kg' },
              { label: 'Density', value: '≈ 0.6', unit: 'g/cm³' },
              { label: 'Rotation', value: '≈ 2.2', unit: 'days' },
              { label: 'Albedo', value: '0.04' },
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
              'A classic “dirty snowball”: 80% water ice by volatile content, with CO, CO₂, methane, and ammonia, laced through dark organic-rich dust. Each perihelion strips away a metre or more of surface — Halley has perhaps thousands of returns left before exhaustion.',
          },
        ],
      },
      {
        id: 'apparitions',
        title: 'Apparitions',
        blocks: [
          {
            type: 'p',
            text:
              'Every return since 240 BC is documented somewhere on Earth. The 1910 pass was a spectacle (Earth brushed through the tail, causing “comet pill” panic); 1986 was the worst viewing geometry in two millennia but the first met by spacecraft — an international “Halley Armada” of five probes.',
          },
          {
            type: 'p',
            text:
              'Mark Twain was born two weeks after the 1835 perihelion and died one day after the 1910 one — “I came in with the comet,” he predicted, “and I shall go out with it.”',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'In 1986 the Vega and Giotto probes confirmed comet nuclei are among the darkest objects in the solar system — a surprise for “icy” bodies.' },
        ],
      },
    ],
  },

  halebopp: {
    summary:
      'Comet Hale–Bopp was the Great Comet of 1997 — visible to the naked eye for a record 18 months thanks to its enormous, hyperactive nucleus. It will not return for roughly 2,500 years.',
    facts: [
      'Hale–Bopp stayed visible to the naked eye for 18 months — the longest of any comet in recorded history.',
      'Its nucleus is enormous: 40–60 km across, versus ~2 km for a typical comet.',
      'It was discovered in July 1995 independently by Alan Hale and Thomas Bopp — while still beyond Jupiter.',
      'At its peak it outshone every star except Sirius, with twin blue ion and white dust tails spanning tens of degrees.',
      'An estimated 70% of humanity saw it.',
    ],
    orbit: {
      e: 0.995,
      stats: [
        { label: 'Semi-major axis', value: '≈ 186', unit: 'AU' },
        { label: 'Orbital period', value: '≈ 2,530', unit: 'yr' },
        { label: 'Eccentricity', value: '0.995' },
        { label: 'Inclination', value: '89.4', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '0.91 / ≈ 370', unit: 'AU' },
      ],
      note:
        'Hale–Bopp’s orbit is tipped almost exactly 90° to the ecliptic — it plunges through the planetary plane like a needle. Its previous visit was ~4,200 years ago; Jupiter’s gravity shortened the next return to ~2,500 years.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Nucleus diameter', value: '40–60', unit: 'km' },
              { label: 'Rotation', value: '11.35', unit: 'h' },
              { label: 'Peak magnitude', value: '−0.8' },
              { label: 'Discovery distance', value: '7.2', unit: 'AU' },
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
              'Hale–Bopp was a chemistry bonanza: astronomers detected dozens of molecular species, many never before seen in a comet, and a third tail of neutral sodium atoms — a first. Its dust output at perihelion exceeded 2 × 10⁶ kg per second.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Hale–Bopp was so intrinsically bright it was detectable by large telescopes until 2013 — more than 30 AU out, 18 years after discovery.' },
        ],
      },
    ],
  },

  churyumov: {
    summary:
      'Comet 67P/Churyumov–Gerasimenko is the best-studied comet in history: ESA’s Rosetta orbited it for two years (2014–2016) and landed Philae on its surface — humanity’s first comet landing. Its twin-lobed “rubber duck” shape became a scientific icon.',
    facts: [
      'Rosetta’s Philae lander touched down on 12 November 2014 — bouncing twice in the feeble gravity before settling.',
      'The comet’s two lobes are separate bodies that merged in a gentle ancient collision.',
      'Rosetta found molecular oxygen, noble gases, and the amino acid glycine in its coma.',
      'Its water has a different deuterium ratio than Earth’s oceans — evidence Earth’s water mostly came from elsewhere.',
      'The mission ended 30 September 2016 with Rosetta itself set down on the surface, beside its lander.',
    ],
    orbit: {
      e: 0.641,
      stats: [
        { label: 'Semi-major axis', value: '3.46', unit: 'AU' },
        { label: 'Orbital period', value: '6.45', unit: 'yr' },
        { label: 'Eccentricity', value: '0.641' },
        { label: 'Inclination', value: '7.0', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '1.24 / 5.68', unit: 'AU' },
      ],
      note:
        'A Jupiter-family comet: close encounters with Jupiter repeatedly reshaped its orbit, most recently in 1959, which lowered its perihelion to today’s 1.24 AU.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Dimensions', value: '4.3 × 4.1', unit: 'km' },
              { label: 'Mass', value: '1.0 × 10¹³', unit: 'kg' },
              { label: 'Density', value: '0.53', unit: 'g/cm³' },
              { label: 'Rotation', value: '12.4', unit: 'h' },
              { label: 'Porosity', value: '≈ 75', unit: '%' },
            ],
          },
          {
            type: 'p',
            text:
              'Rosetta watched the comet live: cliffs collapsing, boulders migrating, jets switching on at dawn, and the nucleus spinning up as it vented. 67P is three-quarters empty space — fluffier than fresh snow.',
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
              'Ices of water, CO, and CO₂ beneath a dark crust of organics and dust. The detection of abundant O₂ trapped since the solar system’s birth forced revisions to models of how comets — and the planets — formed.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Philae’s bouncy landing was caused by a failed harpoon system — yet the accident delivered bonus science from three different touchdown sites.' },
        ],
      },
    ],
  },
};
