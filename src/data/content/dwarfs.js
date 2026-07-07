// Encyclopedic content — dwarf planets.
// Figures from NASA/JPL, IAU, and discovery-team publications.

export const DWARF_CONTENT = {
  pluto: {
    summary:
      'Pluto is the king of the Kuiper Belt — a complex ice dwarf with mountains of water ice, glaciers of flowing nitrogen, blue skies, and five moons. Demoted from planethood in 2006, it was revealed by New Horizons in 2015 to be one of the most geologically alive small worlds known.',
    facts: [
      'Sputnik Planitia, Pluto’s thousand-kilometre heart of nitrogen ice, is a glacier that churns and renews itself with no craters at all.',
      'Pluto’s orbit is so eccentric that from 1979 to 1999 it was closer to the Sun than Neptune.',
      'Its atmosphere expands and collapses with its 248-year seasons — and hangs in dozens of blue haze layers.',
      'Water-ice mountains up to 6 km tall float in its nitrogen plains like icebergs.',
      'Pluto and Charon orbit each other around a point in empty space — a true binary system.',
    ],
    orbit: {
      e: 0.2488,
      stats: [
        { label: 'Semi-major axis', value: '39.48', unit: 'AU' },
        { label: 'Orbital period', value: '247.9', unit: 'yr' },
        { label: 'Eccentricity', value: '0.2488' },
        { label: 'Inclination', value: '17.16', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '29.7 / 49.3', unit: 'AU' },
        { label: 'Last perihelion', value: '1989' },
      ],
      note:
        'Pluto is locked in a 3:2 resonance with Neptune — two Pluto orbits for every three of Neptune’s — which keeps the two permanently apart despite their crossing paths.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '1,188.3', unit: 'km' },
              { label: 'Mass', value: '1.30 × 10²²', unit: 'kg' },
              { label: 'Density', value: '1.85', unit: 'g/cm³' },
              { label: 'Gravity', value: '0.62', unit: 'm/s²' },
              { label: 'Rotation', value: '6.39 days (retrograde)' },
              { label: 'Axial tilt', value: '122.5', unit: '°' },
              { label: 'Surface temp', value: '−229', unit: '°C' },
              { label: 'Known moons', value: '5' },
            ],
          },
          {
            type: 'p',
            text:
              'Pluto is smaller than Earth’s Moon yet astonishingly varied: dark equatorial “whale” terrain of ancient organics, methane snow-capped ridges, possible cryovolcanoes like Wright Mons, and bladed terrain of towering methane ice.',
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
              'A thin nitrogen atmosphere (with methane and CO) in equilibrium with the surface ice, about 10 microbar at New Horizons’ visit. Photochemical haze settles into more than 20 distinct blue layers, and may be what cools Pluto’s air well below predictions.',
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
              'A rocky core about 1,700 km across beneath a water-ice mantle; the deep basin of Sputnik Planitia and its alignment with Charon strongly suggest a subsurface liquid ocean persists beneath the ice even today.',
          },
        ],
      },
      {
        id: 'moons',
        title: 'Moons',
        blocks: [
          {
            type: 'p',
            text:
              'Pluto has five known moons — giant Charon plus tiny, chaotically tumbling Styx, Nix, Kerberos, and Hydra, all likely debris from an ancient collision.',
          },
          { type: 'moons' },
        ],
      },
      {
        id: 'exploration',
        title: 'Exploration',
        blocks: [
          {
            type: 'p',
            text:
              'Discovered by 24-year-old Clyde Tombaugh in 1930 from Lowell Observatory. New Horizons flew past on 14 July 2015 after a nine-year voyage, carrying some of Tombaugh’s ashes — the first and so far only visit.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'The name Pluto was suggested by 11-year-old Venetia Burney of Oxford — she received £5 for it.' },
          { type: 'p', text: 'A Pluto year is so long that since its discovery it has completed barely a third of one orbit.' },
        ],
      },
    ],
  },

  ceres: {
    summary:
      'Ceres is the largest object in the asteroid belt and the only dwarf planet of the inner solar system — a dark, carbon-rich world with buried brine reservoirs that still seep to the surface as blindingly bright salt deposits.',
    facts: [
      'Ceres contains about a third of the asteroid belt’s entire mass.',
      'The bright spots of Occator crater are sodium-carbonate salts left by brine erupting from a deep reservoir.',
      'Ahuna Mons is a lone 4-km cryovolcano — a mountain of frozen mud.',
      'Water vapour detected around Ceres made it the first asteroid-belt object with observed outgassing.',
      'It was the first asteroid ever discovered (1801) and was listed as a planet for half a century.',
    ],
    orbit: {
      e: 0.076,
      stats: [
        { label: 'Semi-major axis', value: '2.77', unit: 'AU' },
        { label: 'Orbital period', value: '4.60', unit: 'yr' },
        { label: 'Eccentricity', value: '0.076' },
        { label: 'Inclination', value: '10.6', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '2.55 / 2.98', unit: 'AU' },
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
              { label: 'Mean radius', value: '469.7', unit: 'km' },
              { label: 'Mass', value: '9.39 × 10²⁰', unit: 'kg' },
              { label: 'Density', value: '2.16', unit: 'g/cm³' },
              { label: 'Rotation', value: '9.07', unit: 'h' },
              { label: 'Surface temp', value: '−105', unit: '°C' },
              { label: 'Albedo', value: '0.09' },
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
              'A partially differentiated body: a muddy rock core under a crust of clays, salts, and up to 25% water ice. Dawn’s gravity data revealed pockets of residual brine deep below Occator — Ceres is, in a limited sense, an ocean world in the asteroid belt.',
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
              'Giuseppe Piazzi spotted Ceres on 1 January 1801 — the first day of the 19th century. NASA’s Dawn spacecraft orbited from 2015 to 2018, the first spacecraft ever to orbit two extraterrestrial bodies (after Vesta).',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Cerium, discovered in 1803, was named after Ceres — the asteroid got an element before it got a spacecraft.' },
        ],
      },
    ],
  },

  eris: {
    summary:
      'Eris is the most massive dwarf planet known — the discovery that ended Pluto’s planethood. Almost exactly Pluto’s size but 27% heavier, it patrols the scattered disc nearly 100 times farther from the Sun than Earth, shadowed by its moon Dysnomia.',
    facts: [
      'Eris’s discovery in 2005 (initially nicknamed “Xena”) forced the IAU to define “planet” — and Pluto didn’t make the cut.',
      'It is currently ~96 AU out, near aphelion of its 559-year orbit — among the most distant large bodies observed.',
      'Its surface is one of the most reflective in the solar system: frozen collapsed atmosphere.',
      'When it swings to perihelion (38 AU), that frost may sublimate into a temporary atmosphere.',
      'Eris is named for the Greek goddess of discord — fitting, given the argument it started.',
    ],
    orbit: {
      e: 0.436,
      stats: [
        { label: 'Semi-major axis', value: '67.9', unit: 'AU' },
        { label: 'Orbital period', value: '559', unit: 'yr' },
        { label: 'Eccentricity', value: '0.436' },
        { label: 'Inclination', value: '44.0', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '38.3 / 97.5', unit: 'AU' },
      ],
      note: 'Eris’s orbit is tilted 44° out of the planetary plane — watch it dive far below the ecliptic in this model.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '1,163', unit: 'km' },
              { label: 'Mass', value: '1.65 × 10²²', unit: 'kg' },
              { label: 'Density', value: '2.43', unit: 'g/cm³' },
              { label: 'Rotation', value: '15.8 days (locked to Dysnomia)' },
              { label: 'Albedo', value: '0.96' },
            ],
          },
          {
            type: 'p',
            text:
              'Recent JWST observations show Eris rotates synchronously with its moon Dysnomia — the pair, like Pluto–Charon, have tidally locked face-to-face. Its high density implies more rock inside than Pluto.',
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
              'A rock-dominated interior under a mantle of ice, coated in nitrogen and methane frost. The uncannily bright, uniform surface is thought to be its atmosphere, frozen out during the centuries spent far from the Sun.',
          },
        ],
      },
      {
        id: 'moons',
        title: 'Moons',
        blocks: [
          {
            type: 'p',
            text:
              'Eris has one known moon, Dysnomia — large enough that the pair are mutually tidally locked, a far-flung echo of the Pluto–Charon binary.',
          },
          { type: 'moons' },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Its moon Dysnomia is named for Eris’s daughter, the spirit of lawlessness — and, slyly, for “Lucy Lawless,” who played Xena.' },
        ],
      },
    ],
  },

  haumea: {
    summary:
      'Haumea is the strangest-shaped large world known: spun up to a 3.9-hour day, it has stretched into a flattened ellipsoid resembling a river stone, longer than Pluto in one axis yet far slimmer in the others. It has two moons, a ring, and a family of icy fragments — all scars of one ancient collision.',
    facts: [
      'Haumea spins faster than any large body in the solar system: one day lasts 3.9 hours.',
      'The spin deforms it into an ellipsoid roughly 2,100 × 1,680 × 1,074 km.',
      'In 2017 a stellar occultation revealed a ring — the first found around a trans-Neptunian object.',
      'Its two moons, Hiʻiaka and Namaka, and a swarm of related KBOs share the icy debris of an ancient impact.',
      'It is named for the Hawaiian goddess of childbirth; its moons, for her daughters.',
    ],
    orbit: {
      e: 0.191,
      stats: [
        { label: 'Semi-major axis', value: '43.2', unit: 'AU' },
        { label: 'Orbital period', value: '283', unit: 'yr' },
        { label: 'Eccentricity', value: '0.191' },
        { label: 'Inclination', value: '28.2', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '34.9 / 51.5', unit: 'AU' },
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
              { label: 'Mean radius', value: '≈ 780', unit: 'km' },
              { label: 'Mass', value: '4.0 × 10²¹', unit: 'kg' },
              { label: 'Rotation', value: '3.92', unit: 'h' },
              { label: 'Albedo', value: '0.66' },
            ],
          },
          {
            type: 'p',
            text:
              'Its surface is nearly pure crystalline water ice — unusually fresh for so old a body — with a curious dark red spot of unknown composition.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Stand on Haumea’s equator and you would weigh dramatically less than at its poles — the spin nearly flings the surface into orbit.' },
        ],
      },
    ],
  },

  makemake: {
    summary:
      'Makemake is the second-brightest Kuiper Belt object after Pluto, a reddish methane-frosted world discovered near Easter 2005 and named for the creator god of Rapa Nui (Easter Island). JWST has detected signs of surprising warmth — possible evidence of internal activity.',
    facts: [
      'Makemake’s surface is coated in unusually large grains of methane ice — centimetre-scale “pebbles” of frost.',
      'A 2011 occultation showed essentially no global atmosphere.',
      'JWST measurements hint at a warm spot or gas emission — this “dead” world may not be dead.',
      'Its faint, coal-dark moon MK2 eluded discovery until 2016.',
      'Along with Eris, its discovery triggered the 2006 planet-definition debate.',
    ],
    orbit: {
      e: 0.161,
      stats: [
        { label: 'Semi-major axis', value: '45.4', unit: 'AU' },
        { label: 'Orbital period', value: '306', unit: 'yr' },
        { label: 'Eccentricity', value: '0.161' },
        { label: 'Inclination', value: '29.0', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '38.1 / 52.8', unit: 'AU' },
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
              { label: 'Mean radius', value: '≈ 715', unit: 'km' },
              { label: 'Rotation', value: '22.8', unit: 'h' },
              { label: 'Albedo', value: '0.81' },
              { label: 'Surface temp', value: '≈ −239', unit: '°C' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Its discoverers’ codename for it was “Easterbunny” — the IAU name kept the Easter theme via Rapa Nui mythology.' },
        ],
      },
    ],
  },

  gonggong: {
    summary:
      'Gonggong is a red, slow-spinning dwarf planet of the scattered disc, discovered in 2007 and finally named in 2020 after a Chinese water god — via a public vote. It is among the largest solar system objects found since Pluto.',
    facts: [
      'Gonggong’s name was chosen by 280,000 public votes in 2019.',
      'Its deep red colour likely comes from irradiated organic “tholins.”',
      'Water ice and possibly methane coat its surface.',
      'Its moon Xiangliu is named for the water god’s nine-headed serpent minister.',
      'Its 554-year orbit is locked in a 3:10 resonance with Neptune.',
    ],
    orbit: {
      e: 0.503,
      stats: [
        { label: 'Semi-major axis', value: '67.3', unit: 'AU' },
        { label: 'Orbital period', value: '554', unit: 'yr' },
        { label: 'Eccentricity', value: '0.503' },
        { label: 'Inclination', value: '30.7', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '33.5 / 101.2', unit: 'AU' },
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
              { label: 'Mean radius', value: '≈ 615', unit: 'km' },
              { label: 'Mass', value: '1.75 × 10²¹', unit: 'kg' },
              { label: 'Rotation', value: '22.4', unit: 'h' },
              { label: 'Albedo', value: '0.14' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Before naming, it was known as 2007 OR10 — for years the largest unnamed object in the solar system.' },
        ],
      },
    ],
  },

  quaoar: {
    summary:
      'Quaoar is a classical Kuiper Belt dwarf planet on an unusually calm, circular orbit. In 2023 it delivered a genuine mystery: a ring orbiting far outside the distance where rings should be able to survive without clumping into a moon.',
    facts: [
      'Quaoar’s ring lies at 7.4 planetary radii — more than twice the classical Roche limit, where rings “shouldn’t” exist.',
      'Its orbit is among the most circular of any large KBO (e ≈ 0.04).',
      'Crystalline water ice on its surface hints at past cryovolcanic warmth.',
      'Its moon Weywot is about 170 km across.',
      'It is named for the creation force of the Tongva people of the Los Angeles basin.',
    ],
    orbit: {
      e: 0.039,
      stats: [
        { label: 'Semi-major axis', value: '43.7', unit: 'AU' },
        { label: 'Orbital period', value: '289', unit: 'yr' },
        { label: 'Eccentricity', value: '0.039' },
        { label: 'Inclination', value: '8.0', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '42.0 / 45.4', unit: 'AU' },
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
              { label: 'Mean radius', value: '≈ 545', unit: 'km' },
              { label: 'Mass', value: '1.2 × 10²¹', unit: 'kg' },
              { label: 'Rotation', value: '17.7', unit: 'h' },
              { label: 'Albedo', value: '0.12' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Quaoar’s impossible ring may be protected by resonances with the dwarf planet’s spin — physics that ring scientists are still working out.' },
        ],
      },
    ],
  },

  sedna: {
    summary:
      'Sedna is one of the most distant and mysterious objects ever found — a cherry-red world on an 11,400-year orbit that never comes closer than 76 AU. Nothing in the known solar system can explain its detached orbit; something else, long ago or still unseen, put it there.',
    facts: [
      'Sedna’s orbit runs from 76 AU out to roughly 900 AU — it never enters the planets’ realm.',
      'Its orbit cannot be explained by the known planets: candidate culprits include a passing star or an undiscovered “Planet Nine.”',
      'It is one of the reddest objects in the solar system, coated in ancient organic tholins.',
      'At aphelion, the Sun would appear as a mere brilliant star, delivering 1/700,000th of Earth’s sunlight.',
      'Discovered in 2003, it is near perihelion now — as close as it will come for another 11 millennia.',
    ],
    orbit: {
      e: 0.855,
      stats: [
        { label: 'Semi-major axis', value: '≈ 506', unit: 'AU' },
        { label: 'Orbital period', value: '≈ 11,400', unit: 'yr' },
        { label: 'Eccentricity', value: '0.855' },
        { label: 'Inclination', value: '11.9', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '76 / ≈ 937', unit: 'AU' },
        { label: 'Next perihelion', value: '≈ 2076' },
      ],
      note:
        'Sedna is the archetype of the “sednoids” — inner Oort cloud objects detached from planetary influence. Toggle to realistic scale to appreciate just how far outside the Kuiper Belt it roams.',
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mean radius', value: '≈ 500', unit: 'km' },
              { label: 'Rotation', value: '10.3', unit: 'h' },
              { label: 'Albedo', value: '0.32' },
              { label: 'Surface temp', value: '≈ −261', unit: '°C' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Sedna is named for the Inuit goddess of the sea, who dwells at the frigid bottom of the Arctic Ocean — chosen for the coldest known place in the solar system.' },
        ],
      },
    ],
  },

  orcus: {
    summary:
      'Orcus is the “anti-Pluto”: it shares Pluto’s 3:2 resonance with Neptune and a similar orbit, but times its perihelion to the opposite phase — when Pluto is close, Orcus is far. With its large moon Vanth, it forms a miniature echo of the Pluto–Charon binary.',
    facts: [
      'Orcus and Pluto share the same orbital rhythm, forever out of phase — hence “anti-Pluto.”',
      'Its moon Vanth is over 440 km across, nearly half Orcus’s size.',
      'Its surface carries unusually fresh crystalline water ice and possible ammonia — hints of past cryovolcanism.',
      'Orcus was the Etruscan god of the underworld, keeping the Plutonian theme.',
      'Vanth was named after the Etruscan spirit who guides the dead — chosen with input from author Neil Gaiman’s readers.',
    ],
    orbit: {
      e: 0.226,
      stats: [
        { label: 'Semi-major axis', value: '39.4', unit: 'AU' },
        { label: 'Orbital period', value: '247', unit: 'yr' },
        { label: 'Eccentricity', value: '0.226' },
        { label: 'Inclination', value: '20.6', unit: '°' },
        { label: 'Perihelion / Aphelion', value: '30.5 / 48.3', unit: 'AU' },
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
              { label: 'Mean radius', value: '≈ 458', unit: 'km' },
              { label: 'Mass (system)', value: '6.3 × 10²⁰', unit: 'kg' },
              { label: 'Rotation', value: '13.2', unit: 'h' },
              { label: 'Albedo', value: '0.23' },
            ],
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'If Pluto had stayed a planet, Orcus — its mirror twin — would have made an awkward tenth-planet candidate.' },
        ],
      },
    ],
  },
};
