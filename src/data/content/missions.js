// Encyclopedic content — the five missions.
// The Journey tab's waypoint list is generated from the trajectory data;
// orbit.note supplies its intro, orbit.stats the journey stat grid.

export const MISSION_CONTENT = {
  voyager1: {
    summary:
      'Voyager 1 is humanity’s farthest-flung creation — launched in 1977 for a Grand Tour of Jupiter and Saturn, and now the first spacecraft in interstellar space, still whispering data home across more than 160 AU after nearly five decades of flight.',
    facts: [
      'Voyager 1 is the most distant human-made object — over 24 billion km from the Sun and receding 17 km every second.',
      'It crossed the heliopause into interstellar space on 25 August 2012.',
      'Its 1990 “Pale Blue Dot” portrait of Earth was taken from 6 billion km away at Carl Sagan’s urging.',
      'Each Voyager carries a Golden Record: sounds, music, and greetings in 55 languages for any finder.',
      'Its plutonium power source should keep at least one instrument alive into the early 2030s.',
    ],
    orbit: {
      stats: [
        { label: 'Launch', value: '5 Sep 1977' },
        { label: 'Distance (2025)', value: '≈ 166', unit: 'AU' },
        { label: 'Speed', value: '17.0', unit: 'km/s' },
        { label: 'Signal travel time', value: '≈ 23', unit: 'hr' },
        { label: 'Power source', value: '3 RTGs' },
        { label: 'Status', value: 'Active' },
      ],
      note:
        'A gravity assist at Jupiter slung Voyager 1 to Saturn, where a close pass of Titan bent its path up and out of the planetary plane forever — trading the Grand Tour’s remaining planets for the first close look at Titan and an early exit to interstellar space.',
    },
    tabs: [
      {
        id: 'spacecraft',
        title: 'Spacecraft',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Launch mass', value: '825', unit: 'kg' },
              { label: 'Dish antenna', value: '3.7', unit: 'm' },
              { label: 'Transmitter power', value: '23', unit: 'W' },
              { label: 'Computer memory', value: '≈ 69', unit: 'KB' },
            ],
          },
          {
            type: 'p',
            text:
              'Voyager 1 navigates by 1970s technology — its computers hold less memory than a single email, and its signal reaches Earth fainter than a refrigerator bulb seen from across the solar system. NASA’s Deep Space Network still hears it daily.',
          },
        ],
      },
      {
        id: 'objectives',
        title: 'Objectives',
        blocks: [
          {
            type: 'p',
            text:
              'The primary mission: exploit a once-in-176-years planetary alignment to survey Jupiter and Saturn, their moons, and Saturn’s rings. The extended Voyager Interstellar Mission now samples the plasma, fields, and cosmic rays of the space between the stars.',
          },
        ],
      },
      {
        id: 'discoveries',
        title: 'Discoveries',
        blocks: [
          {
            type: 'p',
            text:
              'Voyager 1 discovered volcanoes on Io — the first active volcanism beyond Earth — lightning on Jupiter, the intricate braided structure of Saturn’s rings, and Titan’s thick nitrogen atmosphere. Beyond the planets, it measured the true edge of the Sun’s bubble and the density of interstellar plasma.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'The Golden Record’s cover is aluminium electroplated with uranium-238 — a clock any finder could read by its radioactive decay.' },
          { type: 'p', text: 'In 2024, engineers revived Voyager 1 from a garbled-data failure by re-writing code around a broken memory chip — remote debugging at 22.5 light-hours of lag.' },
        ],
      },
    ],
  },

  voyager2: {
    summary:
      'Voyager 2 is the only spacecraft ever to visit all four giant planets — Jupiter, Saturn, Uranus, and Neptune — completing the full Grand Tour across twelve years before following its twin into interstellar space in 2018.',
    facts: [
      'Voyager 2 remains the only spacecraft to have visited Uranus (1986) and Neptune (1989).',
      'It actually launched 16 days before Voyager 1 — its slower trajectory preserved the Uranus–Neptune option.',
      'At Neptune it skimmed just 4,950 km over the cloud tops — the closest planetary approach of either Voyager.',
      'It crossed into interstellar space on 5 November 2018, six years after its twin.',
      'Between them, the Voyagers discovered 33 new moons.',
    ],
    orbit: {
      stats: [
        { label: 'Launch', value: '20 Aug 1977' },
        { label: 'Distance (2025)', value: '≈ 139', unit: 'AU' },
        { label: 'Speed', value: '15.4', unit: 'km/s' },
        { label: 'Signal travel time', value: '≈ 19', unit: 'hr' },
        { label: 'Planets visited', value: '4' },
        { label: 'Status', value: 'Active' },
      ],
      note:
        'Voyager 2 threaded four gravity assists in sequence — each flyby bending and accelerating its path to the next planet. The alignment enabling this occurs once every 176 years; it dives below the ecliptic plane after Neptune.',
    },
    tabs: [
      {
        id: 'spacecraft',
        title: 'Spacecraft',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Launch mass', value: '825', unit: 'kg' },
              { label: 'Instruments', value: '11' },
              { label: 'Power (2025)', value: '≈ 220', unit: 'W' },
              { label: 'Data rate (now)', value: '160', unit: 'bps' },
            ],
          },
          {
            type: 'p',
            text:
              'Identical to Voyager 1, down to the Golden Record bolted to its side. Because it flies south of the ecliptic, only one antenna on Earth can command it: Deep Space Station 43 in Canberra, Australia.',
          },
        ],
      },
      {
        id: 'objectives',
        title: 'Objectives',
        blocks: [
          {
            type: 'p',
            text:
              'Originally a Jupiter–Saturn mission like its twin, Voyager 2’s trajectory kept the “Grand Tour” alive: after Saturn success, NASA extended it to Uranus and Neptune. Today it measures the interstellar medium from a different exit direction than Voyager 1 — two data points on the shape of the Sun’s bubble.',
          },
        ],
      },
      {
        id: 'discoveries',
        title: 'Discoveries',
        blocks: [
          {
            type: 'p',
            text:
              'Voyager 2 revealed Uranus’s tipped magnetic field and ten new moons; at Neptune it found the Great Dark Spot, 2,100 km/h winds, ring arcs, and Triton’s nitrogen geysers. Its Neptune encounter remains the only close look at an ice giant — the most common class of planet in the galaxy.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'When Voyager 2 reached Neptune, engineers had to reprogram it in flight for light levels 900× dimmer than Earth’s — inventing image-motion compensation on 1970s hardware.' },
        ],
      },
    ],
  },

  cassini: {
    summary:
      'Cassini–Huygens spent 13 years orbiting Saturn (2004–2017), rewriting the book on the ringed planet: it landed Huygens on Titan, discovered the ocean and geysers of Enceladus, and ended in a deliberate, spectacular plunge into Saturn itself.',
    facts: [
      'Cassini completed 294 orbits of Saturn and 162 targeted moon flybys over 13 years.',
      'Its Huygens probe made the most distant landing in history, touching down on Titan on 14 January 2005.',
      'It discovered the Enceladus plumes — and flew through them, tasting a hidden ocean.',
      'Its “Grand Finale” threaded 22 dives through the 2,000-km gap between Saturn and its rings.',
      'On 15 September 2017 it burned up in Saturn’s atmosphere, protecting the ocean moons from contamination.',
    ],
    orbit: {
      stats: [
        { label: 'Launch', value: '15 Oct 1997' },
        { label: 'Saturn arrival', value: '1 Jul 2004' },
        { label: 'Mission end', value: '15 Sep 2017' },
        { label: 'Cruise distance', value: '3.5 × 10⁹', unit: 'km' },
        { label: 'Saturn orbits', value: '294' },
        { label: 'Status', value: 'Ended (plunge)' },
      ],
      note:
        'Too heavy to fly direct, Cassini looped inward first: two Venus flybys, then Earth, then Jupiter — a seven-year VVEJGA gravity-assist cruise that finally delivered it to Saturn orbit insertion in July 2004. After 2017 the trajectory shown ends at Saturn, where the spacecraft became part of the planet it studied.',
    },
    tabs: [
      {
        id: 'spacecraft',
        title: 'Spacecraft',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Launch mass', value: '5,712', unit: 'kg' },
              { label: 'Height', value: '6.8', unit: 'm' },
              { label: 'Instruments', value: '12 + 6 (Huygens)' },
              { label: 'Partners', value: 'NASA · ESA · ASI' },
            ],
          },
          {
            type: 'p',
            text:
              'Cassini was among the largest interplanetary spacecraft ever flown — a school-bus-sized orbiter carrying ESA’s wok-shaped Huygens probe. Three RTGs powered it far beyond sunlight’s practical reach.',
          },
        ],
      },
      {
        id: 'objectives',
        title: 'Objectives',
        blocks: [
          {
            type: 'p',
            text:
              'Study Saturn’s atmosphere, rings, and magnetosphere; map Titan through its haze; and characterise the icy moons. Huygens carried its own suite to sample Titan’s atmosphere all the way to the ground. Nearly every goal was exceeded, and the mission twice earned multi-year extensions.',
          },
        ],
      },
      {
        id: 'discoveries',
        title: 'Discoveries',
        blocks: [
          {
            type: 'p',
            text:
              'Enceladus’s ocean and plumes; Titan’s methane seas and rain-carved river networks; seven new moons; propeller-shaped wakes of moonlets embedded in the rings; the hexagon’s persistence at Saturn’s north pole; and — from the Grand Finale — that the rings are young and surprisingly light, and Saturn’s field impossibly aligned.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Cassini’s final signal took 83 minutes to reach Earth — by the time we heard its goodbye, the spacecraft had been part of Saturn for over an hour.' },
        ],
      },
    ],
  },

  newhorizons: {
    summary:
      'New Horizons flew nine years and five billion kilometres to give humanity its first — and so far only — close look at Pluto in July 2015, then pressed deeper into the Kuiper Belt to buzz Arrokoth, the most distant world ever explored.',
    facts: [
      'It left Earth at 58,500 km/h — the fastest launch of any spacecraft — reaching the Moon’s distance in 9 hours.',
      'Its Pluto flyby revealed nitrogen glaciers, water-ice mountains, and blue skies on a world once thought inert.',
      'On New Year’s Day 2019 it flew past Arrokoth, 6.6 billion km out — the most distant object ever visited.',
      'Arrokoth’s gentle two-lobed shape preserved the solar system’s original building blocks in deep freeze.',
      'The spacecraft carries a portion of Pluto discoverer Clyde Tombaugh’s ashes.',
    ],
    orbit: {
      stats: [
        { label: 'Launch', value: '19 Jan 2006' },
        { label: 'Pluto flyby', value: '14 Jul 2015' },
        { label: 'Arrokoth flyby', value: '1 Jan 2019' },
        { label: 'Distance (2025)', value: '≈ 61', unit: 'AU' },
        { label: 'Speed', value: '13.8', unit: 'km/s' },
        { label: 'Status', value: 'Active' },
      ],
      note:
        'A Jupiter gravity assist in 2007 shaved three years off the cruise to Pluto. Since Arrokoth, New Horizons coasts outward through the Kuiper Belt on an escape trajectory, healthy into the 2040s if funding and plutonium hold.',
    },
    tabs: [
      {
        id: 'spacecraft',
        title: 'Spacecraft',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Launch mass', value: '478', unit: 'kg' },
              { label: 'Size', value: 'grand-piano class' },
              { label: 'Instruments', value: '7' },
              { label: 'Power at Pluto', value: '≈ 200', unit: 'W' },
            ],
          },
          {
            type: 'p',
            text:
              'Built lean for speed: a compact, RTG-powered probe whose instruments include Ralph, Alice, and a student-built dust counter — the first student instrument on a planetary mission.',
          },
        ],
      },
      {
        id: 'objectives',
        title: 'Objectives',
        blocks: [
          {
            type: 'p',
            text:
              'Complete the reconnaissance of the classical planets by mapping Pluto and Charon, then explore a primordial Kuiper Belt object. Both were achieved; the extended mission now studies the outer heliosphere and observes KBOs from within the belt itself.',
          },
        ],
      },
      {
        id: 'discoveries',
        title: 'Discoveries',
        blocks: [
          {
            type: 'p',
            text:
              'Pluto’s churning nitrogen heart, possible interior ocean, and haze-layered blue atmosphere; Charon’s red pole and giant canyons; and at Arrokoth, proof that planetesimals formed by gentle gravitational collapse rather than violent collisions — a cornerstone result for planet-formation theory.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'The Pluto flyby data took 16 months to fully downlink at ~1–2 kbps — the entire encounter fit in a window shorter than a working day.' },
        ],
      },
    ],
  },

  perseverance: {
    summary:
      'Perseverance is NASA’s flagship Mars rover, landed in Jezero Crater in February 2021 to hunt for signs of ancient microbial life in a fossilised river delta — and to cache samples that a future mission will carry back to Earth.',
    facts: [
      'Its landing was guided by Terrain-Relative Navigation and the “sky crane” — touching down within metres of target after the famous “seven minutes of terror.”',
      'It carried Ingenuity, the first aircraft to fly on another planet — 72 flights against an expected 5.',
      'Its MOXIE experiment made oxygen from Martian CO₂ — the first resource manufactured on another planet.',
      'It has sealed dozens of rock cores, the first samples ever cached for return from Mars.',
      'Jezero’s delta preserves lakebed mudstones over 3.5 billion years old — prime territory for biosignatures.',
    ],
    orbit: {
      stats: [
        { label: 'Launch', value: '30 Jul 2020' },
        { label: 'Landing', value: '18 Feb 2021' },
        { label: 'Cruise time', value: '203', unit: 'days' },
        { label: 'Cruise distance', value: '472 × 10⁶', unit: 'km' },
        { label: 'Landing site', value: 'Jezero Crater' },
        { label: 'Status', value: 'Roving' },
      ],
      note:
        'Perseverance flew a Type-1 Hohmann-style transfer: a direct 203-day cruise launched in the 2020 window when Earth and Mars aligned. After 18 February 2021 its marker in this model rides with Mars — the rover is part of the planet now.',
    },
    tabs: [
      {
        id: 'spacecraft',
        title: 'Spacecraft',
        blocks: [
          {
            type: 'stats',
            items: [
              { label: 'Mass', value: '1,025', unit: 'kg' },
              { label: 'Size', value: '3 × 2.7 × 2.2', unit: 'm' },
              { label: 'Power', value: 'MMRTG (110 W)' },
              { label: 'Instruments', value: '7 + 23 cameras' },
            ],
          },
          {
            type: 'p',
            text:
              'A nuclear-powered, car-sized laboratory: laser spectrometers, ground-penetrating radar, a coring drill, and two microphones that recorded the first sounds from Mars — including Ingenuity’s rotors.',
          },
        ],
      },
      {
        id: 'objectives',
        title: 'Objectives',
        blocks: [
          {
            type: 'p',
            text:
              'Seek preserved biosignatures in Jezero’s delta and lakebed rocks; cache samples for Mars Sample Return; demonstrate technologies (oxygen production, powered flight, autonomous driving) for eventual human missions.',
          },
        ],
      },
      {
        id: 'discoveries',
        title: 'Discoveries',
        blocks: [
          {
            type: 'p',
            text:
              'Confirmed Jezero held a lake with river deltas; found igneous crater-floor rocks that pin dates on Mars’s history; detected organic molecules in multiple rock types; and in 2024 identified “leopard-spot” textures in the rock Cheyava Falls — one of the most intriguing potential biosignatures yet found on Mars.',
          },
        ],
      },
      {
        id: 'funfacts',
        title: 'Fun Facts',
        blocks: [
          { type: 'p', text: 'Perseverance carries three microchips etched with 10.9 million names submitted by the public — and a plate honouring healthcare workers of the COVID-19 pandemic during which it launched.' },
        ],
      },
    ],
  },
};
