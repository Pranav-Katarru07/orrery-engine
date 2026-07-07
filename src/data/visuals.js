// Data behind the panel visualizations: layered interior cross-sections and
// magnetosphere diagrams. Rendered by src/ui/viz.js; wired automatically by
// the panel when the matching subtab is open (no content-file edits needed).
//
// Cross-section layers run inside → out; outerFrac is the layer's outer
// boundary as a fraction of the body radius. Layer structure follows NASA /
// mission-derived interior models (Juno, Cassini, InSight, Dawn, Galileo…).

export const CROSS_SECTIONS = {
  sun: {
    subtab: 'structure',
    layers: [
      { name: 'Core', material: 'Hydrogen fusion furnace, 15.7 million K', outerFrac: 0.25, color: '#FFF3C4' },
      { name: 'Radiative zone', material: 'Photons random-walk outward for ~100,000 yr', outerFrac: 0.7, color: '#FFC24D' },
      { name: 'Convective zone', material: 'Boiling plasma cells carry heat to the surface', outerFrac: 0.97, color: '#E8862E' },
      { name: 'Photosphere', material: 'The visible “surface”, 5,772 K', outerFrac: 1, color: '#B2531F' },
    ],
  },
  mercury: {
    layers: [
      { name: 'Inner core', material: 'Solid iron', outerFrac: 0.5, color: '#EDE5D8' },
      { name: 'Outer core', material: 'Molten iron — still driving a dynamo', outerFrac: 0.85, color: '#C4763B' },
      { name: 'Mantle', material: 'Thin silicate shell', outerFrac: 0.98, color: '#8A6E58' },
      { name: 'Crust', material: 'Cratered volcanic plains', outerFrac: 1, color: '#6E5A48' },
    ],
  },
  venus: {
    layers: [
      { name: 'Core', material: 'Iron–nickel, likely partly molten', outerFrac: 0.5, color: '#E5D9C4' },
      { name: 'Mantle', material: 'Hot rocky mantle, no plate tectonics', outerFrac: 0.98, color: '#B08850' },
      { name: 'Crust', material: 'Young basaltic surface', outerFrac: 1, color: '#8A6238' },
    ],
  },
  earth: {
    layers: [
      { name: 'Inner core', material: 'Solid iron–nickel, ~5,700 K', outerFrac: 0.19, color: '#F5EBD2' },
      { name: 'Outer core', material: 'Liquid iron — the geodynamo', outerFrac: 0.55, color: '#E8A54B' },
      { name: 'Mantle', material: 'Slowly convecting silicate rock', outerFrac: 0.99, color: '#C4703B' },
      { name: 'Crust', material: 'Continents and ocean floor', outerFrac: 1, color: '#4D9DE0' },
    ],
  },
  moon: {
    layers: [
      { name: 'Core', material: 'Small iron core, partly molten', outerFrac: 0.2, color: '#DCCFBC' },
      { name: 'Mantle', material: 'Solid silicate', outerFrac: 0.97, color: '#9A8D7C' },
      { name: 'Crust', material: 'Feldspar highlands & basalt maria', outerFrac: 1, color: '#787066' },
    ],
  },
  mars: {
    layers: [
      { name: 'Core', material: 'Liquid iron–sulphur (InSight, 2021)', outerFrac: 0.54, color: '#DC9A4B' },
      { name: 'Mantle', material: 'Single-plate silicate mantle', outerFrac: 0.98, color: '#B05A34' },
      { name: 'Crust', material: 'Rust-stained basalt, 24–72 km thick', outerFrac: 1, color: '#8F4A2C' },
    ],
  },
  jupiter: {
    layers: [
      { name: 'Fuzzy core', material: 'Heavy elements diluted through hydrogen (Juno)', outerFrac: 0.3, color: '#C9A06B' },
      { name: 'Metallic hydrogen', material: 'Electrically conducting liquid — the dynamo', outerFrac: 0.8, color: '#A08CB8' },
      { name: 'Molecular hydrogen', material: 'Liquid fading upward into gas', outerFrac: 0.97, color: '#C4A87C' },
      { name: 'Cloud decks', material: 'Ammonia, ammonium hydrosulphide, water', outerFrac: 1, color: '#DCC091' },
    ],
  },
  saturn: {
    layers: [
      { name: 'Fuzzy core', material: 'Rock and ice smeared through the interior (Cassini)', outerFrac: 0.25, color: '#C9A06B' },
      { name: 'Metallic hydrogen', material: 'Conducting shell, thinner than Jupiter’s', outerFrac: 0.6, color: '#A08CB8' },
      { name: 'Liquid H / He', material: 'Where helium rain falls and releases heat', outerFrac: 0.95, color: '#D4B87C' },
      { name: 'Atmosphere', material: 'Hazy ammonia cloud decks', outerFrac: 1, color: '#E5CD96' },
    ],
  },
  uranus: {
    layers: [
      { name: 'Rocky core', material: 'Roughly half an Earth mass', outerFrac: 0.2, color: '#B89B78' },
      { name: 'Icy mantle', material: 'Hot water–ammonia–methane ocean; possible diamond rain', outerFrac: 0.8, color: '#4FA0B4' },
      { name: 'Atmosphere', material: 'Hydrogen, helium and the methane that paints it cyan', outerFrac: 1, color: '#8ED4D4' },
    ],
  },
  neptune: {
    layers: [
      { name: 'Rocky core', material: 'About one Earth mass', outerFrac: 0.25, color: '#B89B78' },
      { name: 'Icy mantle', material: 'Superionic water and ammonia under crushing pressure', outerFrac: 0.82, color: '#3E6CC8' },
      { name: 'Atmosphere', material: 'H/He with methane — the windiest air anywhere', outerFrac: 1, color: '#6C8CFF' },
    ],
  },
  pluto: {
    layers: [
      { name: 'Rocky core', material: 'Hydrated rock, ~1,700 km across', outerFrac: 0.7, color: '#B09578' },
      { name: 'Possible ocean', material: 'Liquid water hinted at by Sputnik Planitia’s alignment', outerFrac: 0.78, color: '#4B87B8' },
      { name: 'Ice mantle', material: 'Water ice, rigid as rock at 40 K', outerFrac: 0.97, color: '#C8D2DC' },
      { name: 'Surface frosts', material: 'Nitrogen, methane and CO ices', outerFrac: 1, color: '#E8EDF2' },
    ],
  },
  ceres: {
    layers: [
      { name: 'Muddy core', material: 'Hydrated rock, never fully dried out', outerFrac: 0.55, color: '#8A7A64' },
      { name: 'Briny mantle', material: 'Salty ice with pockets of residual brine (Dawn)', outerFrac: 0.95, color: '#A8B4BC' },
      { name: 'Crust', material: 'Clays, salts, and dust', outerFrac: 1, color: '#75695B' },
    ],
  },
  io: {
    layers: [
      { name: 'Iron core', material: 'Iron–iron sulphide', outerFrac: 0.36, color: '#E5C96A' },
      { name: 'Magma ocean?', material: 'Partially molten silicate layer feeding the volcanoes', outerFrac: 0.6, color: '#D96A2E' },
      { name: 'Mantle', material: 'Hot silicate rock', outerFrac: 0.97, color: '#C9A23F' },
      { name: 'Crust', material: 'Sulphur frosts over fresh lava plains', outerFrac: 1, color: '#EDD968' },
    ],
  },
  europa: {
    layers: [
      { name: 'Iron core', material: 'Metallic centre', outerFrac: 0.35, color: '#C48A5A' },
      { name: 'Rock mantle', material: 'Silicate seafloor — possible hydrothermal vents', outerFrac: 0.83, color: '#96704E' },
      { name: 'Ocean', material: 'Salty liquid water, 60–150 km deep', outerFrac: 0.95, color: '#3E78C8' },
      { name: 'Ice shell', material: 'Fractured shell, 15–25 km thick', outerFrac: 1, color: '#C8DCE8' },
    ],
  },
  ganymede: {
    layers: [
      { name: 'Iron core', material: 'Molten iron — the only moon dynamo', outerFrac: 0.25, color: '#D0905A' },
      { name: 'Rock mantle', material: 'Silicate rock', outerFrac: 0.55, color: '#8A6E52' },
      { name: 'Ocean', material: 'Salty water sandwiched between ice phases', outerFrac: 0.75, color: '#4478B8' },
      { name: 'High-pressure ice', material: 'Exotic dense ice phases', outerFrac: 0.97, color: '#A8BCD0' },
      { name: 'Crust', material: 'Grooved and cratered ice', outerFrac: 1, color: '#C0B4A2' },
    ],
  },
  callisto: {
    layers: [
      { name: 'Mixed interior', material: 'Rock and ice, never fully separated', outerFrac: 0.85, color: '#7A7268' },
      { name: 'Possible ocean', material: 'Conducting saline layer (Galileo)', outerFrac: 0.9, color: '#4478B8' },
      { name: 'Icy crust', material: 'The most cratered surface known', outerFrac: 1, color: '#A69C8E' },
    ],
  },
  titan: {
    layers: [
      { name: 'Rock core', material: 'Hydrated silicates', outerFrac: 0.66, color: '#8A6E4E' },
      { name: 'High-pressure ice', material: 'Dense ice VI layer', outerFrac: 0.78, color: '#9AACBE' },
      { name: 'Ocean', material: 'Salty water–ammonia ocean', outerFrac: 0.88, color: '#3E78C0' },
      { name: 'Ice shell', material: 'Water-ice crust ~100 km thick', outerFrac: 0.99, color: '#B8C8D4' },
      { name: 'Haze & dunes', material: 'Organic-coated surface under orange smog', outerFrac: 1, color: '#E0A84E' },
    ],
  },
  enceladus: {
    layers: [
      { name: 'Porous core', material: 'Water circulates through hot rock — hydrothermal vents', outerFrac: 0.6, color: '#8A7458' },
      { name: 'Global ocean', material: 'The water that erupts from the tiger stripes', outerFrac: 0.85, color: '#3E88C8' },
      { name: 'Ice shell', material: '~25 km thick, thinning to <5 km at the south pole', outerFrac: 1, color: '#E8F0F6' },
    ],
  },
  triton: {
    layers: [
      { name: 'Rock core', material: 'Rock and metal — dense for an icy moon', outerFrac: 0.6, color: '#9A7A5E' },
      { name: 'Possible ocean', material: 'Water–ammonia layer kept liquid by tides', outerFrac: 0.7, color: '#4B87B8' },
      { name: 'Ice mantle', material: 'Water ice', outerFrac: 0.97, color: '#C4CEDA' },
      { name: 'Frost surface', material: 'Nitrogen and methane ices, geyser-streaked', outerFrac: 1, color: '#E0D8D2' },
    ],
  },
  charon: {
    layers: [
      { name: 'Rock core', material: 'Rocky centre', outerFrac: 0.55, color: '#8A7666' },
      { name: 'Ice mantle', material: 'A frozen ancient ocean — its expansion split the crust', outerFrac: 0.98, color: '#B8C2CC' },
      { name: 'Surface', material: 'Water ice with ammonia hydrates', outerFrac: 1, color: '#CCC0B4' },
    ],
  },
};

// Dipole tilt (deg from spin axis), centre offset (fraction of radius), and
// caption facts. The diagram tilts/offsets its whole field-line group, which
// makes the ice giants' broken geometry immediately visible.
export const MAGNETOSPHERES = {
  sun: {
    subtab: 'activity',
    tiltDeg: 10,
    offsetFrac: 0,
    strength: 'Global field ~1 G; sunspots reach 3,000 G',
    note: 'The Sun’s field reverses polarity every ~11 years and inflates the heliosphere — a magnetic bubble enclosing the whole planetary system.',
  },
  mercury: {
    tiltDeg: 0,
    offsetFrac: 0.2,
    strength: '≈ 1% of Earth’s field',
    note: 'Weak but real, and oddly shifted northward by a fifth of the planet’s radius. The solar wind sometimes pushes the dayside magnetopause to the surface.',
  },
  earth: {
    tiltDeg: 11,
    offsetFrac: 0,
    strength: '25–65 μT at the surface',
    note: 'Generated by the liquid outer core. It traps the Van Allen radiation belts and funnels solar-wind particles poleward as aurorae.',
  },
  jupiter: {
    tiltDeg: 10,
    offsetFrac: 0.1,
    strength: '≈ 20,000 × Earth’s magnetic moment',
    note: 'The largest structure in the solar system — its tail stretches beyond Saturn’s orbit, and Io feeds it a plasma torus that powers permanent aurorae.',
  },
  saturn: {
    tiltDeg: 0.5,
    offsetFrac: 0.04,
    strength: '≈ 580 × Earth’s magnetic moment',
    note: 'Almost perfectly aligned with the rotation axis (< 0.01°) — which standard dynamo theory says should be impossible. Cassini never solved it.',
  },
  uranus: {
    tiltDeg: 59,
    offsetFrac: 0.33,
    strength: '≈ 50 × Earth’s magnetic moment',
    note: 'Tilted 59° and offset a third of the planet’s radius from centre — the field likely forms in a thin conducting shell, not a core. It tumbles end-over-end as Uranus spins.',
  },
  neptune: {
    tiltDeg: 47,
    offsetFrac: 0.55,
    strength: '≈ 25 × Earth’s magnetic moment',
    note: 'Even stranger than Uranus’s: tilted 47° and offset by more than half the planet’s radius. The magnetosphere reconfigures itself completely every 16-hour day.',
  },
  ganymede: {
    tiltDeg: 4,
    offsetFrac: 0,
    strength: '≈ 1% of Earth’s field',
    note: 'The only moon with its own dynamo, carving a private magnetosphere inside Jupiter’s. Its rocking aurorae revealed the salty ocean below.',
  },
};
