import { CATALOG } from '../bodies.js';

// Encyclopedic entries live in the sibling modules, keyed by body id.
// getContent falls back to a minimal auto-generated entry so a missing id
// degrades gracefully instead of breaking the panel.

import { SUN_CONTENT } from './sun.js';
import { PLANET_CONTENT } from './planets.js';
import { DWARF_CONTENT } from './dwarfs.js';
import { MOON_CONTENT } from './moons.js';
import { COMET_CONTENT } from './comets.js';
import { MISSION_CONTENT } from './missions.js';
import { ASTEROID_CONTENT } from './asteroids.js';

const REGISTRY = {
  ...SUN_CONTENT,
  ...PLANET_CONTENT,
  ...DWARF_CONTENT,
  ...MOON_CONTENT,
  ...COMET_CONTENT,
  ...MISSION_CONTENT,
  ...ASTEROID_CONTENT,
};

export function getContent(id, def) {
  const c = REGISTRY[id];
  if (c) return c;
  def = def ?? CATALOG.get(id);
  return {
    summary: `${def.name} is a ${def.type === 'dwarf' ? 'dwarf planet' : def.type} in the solar system.`,
    facts: [`Mean radius: about ${Math.round(def.radiusKm).toLocaleString()} km.`],
    orbit: {
      e: def.elements?.e,
      stats: def.elements
        ? [
            { label: 'Semi-major axis', value: def.elements.a.toFixed(2), unit: 'AU' },
            { label: 'Eccentricity', value: String(def.elements.e) },
            { label: 'Inclination', value: def.elements.i.toFixed(1), unit: '°' },
            { label: 'Period', value: (def.elements.periodDays / 365.25).toFixed(1), unit: 'yr' },
          ]
        : [],
    },
    tabs: [
      {
        id: 'physical',
        title: 'Physical',
        blocks: [
          {
            type: 'stats',
            items: [{ label: 'Mean radius', value: Math.round(def.radiusKm).toLocaleString(), unit: 'km' }],
          },
        ],
      },
    ],
  };
}
