// Guided tours: curated multi-stop flights with a line of narration per
// stop. The player flies the camera; the text lives on the tour card.

export const TOURS = [
  {
    id: 'grand',
    title: 'The Grand Tour',
    blurb: 'Ride the Voyager route past the four giants and out of the system.',
    stops: [
      {
        id: 'sun',
        title: 'Departure point',
        text: 'Everything on this trip orbits the star behind you. The Sun holds 99.8% of the solar system’s mass — the four giants we’re about to visit share most of what’s left.',
      },
      {
        id: 'jupiter',
        title: 'Jupiter',
        text: 'First stop, biggest planet. Jupiter could swallow every other planet combined, and its Great Red Spot is a storm wider than Earth that’s been raging for centuries.',
      },
      {
        id: 'saturn',
        title: 'Saturn',
        text: 'The rings span 280,000 km but are mostly under 100 m thick — proportionally thinner than a sheet of paper. They’re almost pure water ice, shepherded by dozens of moons.',
      },
      {
        id: 'uranus',
        title: 'Uranus',
        text: 'The sideways planet: its axis is tipped 98°, so each pole gets 42 years of daylight followed by 42 years of night. Voyager 2 is still the only spacecraft to have seen it up close.',
      },
      {
        id: 'neptune',
        title: 'Neptune',
        text: 'Last giant out. Neptune was found with math before telescopes — its position was predicted from wobbles in Uranus’s orbit. Winds here hit 2,100 km/h, the fastest anywhere.',
      },
      {
        id: 'voyager1',
        title: 'Leaving the system',
        text: 'Voyager 1 took this route in the late 70s and never came back. It crossed into interstellar space in 2012 and is now the most distant human-made object — still calling home.',
      },
    ],
  },
  {
    id: 'oceans',
    title: 'Ocean Worlds',
    blurb: 'Five icy worlds hiding liquid water — the best places to look for life.',
    stops: [
      {
        id: 'europa',
        title: 'Europa',
        text: 'Under a few kilometres of cracked ice sits a salty ocean with more water than all of Earth’s seas combined. Jupiter’s tides knead the interior and keep it liquid.',
      },
      {
        id: 'enceladus',
        title: 'Enceladus',
        text: 'This little moon vents its ocean straight into space — geysers at the south pole spray water that Cassini actually flew through and tasted. It found salts and organic molecules.',
      },
      {
        id: 'titan',
        title: 'Titan',
        text: 'Two oceans in one world: methane rain, rivers and lakes on the surface, plus a buried water ocean underneath. Titan’s air is thicker than Earth’s — the only moon with real weather.',
      },
      {
        id: 'triton',
        title: 'Triton',
        text: 'Neptune’s big moon orbits backwards — it’s a captured Kuiper Belt object. Nitrogen geysers and a suspiciously young surface hint at an ocean that hasn’t frozen yet.',
      },
      {
        id: 'pluto',
        title: 'Pluto',
        text: 'The heart-shaped glacier of Sputnik Planitia may float on a slushy water ocean, kept warm by leftover radioactive heat. Even 40 AU from the Sun, water finds a way.',
      },
    ],
  },
  {
    id: 'small',
    title: 'Small Worlds',
    blurb: 'Asteroids, comets and Kuiper Belt relics — leftovers from day one.',
    stops: [
      {
        id: 'ceres',
        title: 'Ceres',
        text: 'The biggest thing in the asteroid belt — a dwarf planet with bright salt deposits where briny water once reached the surface. Dawn orbited it for three years.',
      },
      {
        id: 'vesta',
        title: 'Vesta',
        text: 'A protoplanet that never finished forming, with a mountain twice the height of Everest at its south pole. Chunks knocked off Vesta actually land on Earth as meteorites.',
      },
      {
        id: 'halley',
        title: 'Halley',
        text: 'The most famous comet returns every 76 years — people have recorded it since 240 BC. Every pass, the Sun boils another few metres off its dirty snowball of a nucleus.',
      },
      {
        id: 'churyumov',
        title: '67P',
        text: 'Rosetta chased this duck-shaped comet for two years and dropped a lander on it. Its cliffs, pits and collapsing terrain rewrote what we thought comets were.',
      },
      {
        id: 'arrokoth',
        title: 'Arrokoth',
        text: 'The most distant world ever visited: two primordial lobes gently stuck together, 6.6 billion km out. It’s a four-billion-year-old snapshot of how planets began.',
      },
    ],
  },
];
