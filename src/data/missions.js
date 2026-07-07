import * as THREE from 'three';

// Five iconic missions as simplified static trajectories (per spec: not
// live-tracked). Waypoints either reference a catalog body at a date — the
// flyby geometry then lands exactly on that planet's real position — or give
// an explicit heliocentric ecliptic position in AU (post-flyby escape legs,
// approximated as constant-velocity radial coast).

const D = Date.UTC;

// lon/lat in ecliptic degrees, r in AU
const ecl = (lonDeg, latDeg, r) => {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  return [r * Math.cos(lat) * Math.cos(lon), r * Math.cos(lat) * Math.sin(lon), r * Math.sin(lat)];
};

export const MISSIONS = [
  {
    id: 'voyager1', name: 'Voyager 1', type: 'mission',
    accent: { glow: '#C9B458', ui: '#E0CD76' },
    aliases: ['voyager'],
    launchMs: D(1977, 8, 5),
    endMode: 'coast', // still flying
    waypoints: [
      { ms: D(1977, 8, 5), ref: 'earth', label: 'Launch' },
      { ms: D(1979, 2, 5), ref: 'jupiter', label: 'Jupiter flyby', arc: true },
      { ms: D(1980, 10, 12), ref: 'saturn', label: 'Saturn flyby', arc: true },
      { ms: D(1990, 1, 1), pos: ecl(255, 35, 40.5) },
      { ms: D(2025, 0, 1), pos: ecl(255, 35, 165.2), label: 'Interstellar space' },
      { ms: D(2250, 0, 1), pos: ecl(255, 35, 972) },
    ],
  },
  {
    id: 'voyager2', name: 'Voyager 2', type: 'mission',
    accent: { glow: '#C9B458', ui: '#E0CD76' },
    launchMs: D(1977, 7, 20),
    endMode: 'coast',
    waypoints: [
      { ms: D(1977, 7, 20), ref: 'earth', label: 'Launch' },
      { ms: D(1979, 6, 9), ref: 'jupiter', label: 'Jupiter flyby', arc: true },
      { ms: D(1981, 7, 25), ref: 'saturn', label: 'Saturn flyby', arc: true },
      { ms: D(1986, 0, 24), ref: 'uranus', label: 'Uranus flyby', arc: true },
      { ms: D(1989, 7, 25), ref: 'neptune', label: 'Neptune flyby', arc: true },
      { ms: D(2000, 0, 1), pos: ecl(290, -35, 63) },
      { ms: D(2025, 0, 1), pos: ecl(290, -40, 138.7), label: 'Interstellar space' },
      { ms: D(2250, 0, 1), pos: ecl(290, -42, 870) },
    ],
  },
  {
    id: 'cassini', name: 'Cassini', type: 'mission',
    accent: { glow: '#D8B56C', ui: '#EBCB89' },
    aliases: ['cassini-huygens'],
    launchMs: D(1997, 9, 15),
    endMode: 'park', endRef: 'saturn', endMs: D(2017, 8, 15), // Grand Finale plunge
    waypoints: [
      { ms: D(1997, 9, 15), ref: 'earth', label: 'Launch' },
      { ms: D(1998, 3, 26), ref: 'venus', label: 'Venus flyby 1', arc: true },
      { ms: D(1999, 5, 24), ref: 'venus', label: 'Venus flyby 2', arc: true },
      { ms: D(1999, 7, 18), ref: 'earth', label: 'Earth flyby', arc: true },
      { ms: D(2000, 11, 30), ref: 'jupiter', label: 'Jupiter flyby', arc: true },
      { ms: D(2004, 6, 1), ref: 'saturn', label: 'Saturn orbit insertion', arc: true },
    ],
  },
  {
    id: 'newhorizons', name: 'New Horizons', type: 'mission',
    accent: { glow: '#C0C7D1', ui: '#DCE2EA' },
    launchMs: D(2006, 0, 19),
    endMode: 'coast',
    waypoints: [
      { ms: D(2006, 0, 19), ref: 'earth', label: 'Launch' },
      { ms: D(2007, 1, 28), ref: 'jupiter', label: 'Jupiter flyby', arc: true },
      { ms: D(2015, 6, 14), ref: 'pluto', label: 'Pluto flyby', arc: true },
      { ms: D(2019, 0, 1), pos: ecl(293, 1.5, 44.2), label: 'Arrokoth flyby' },
      { ms: D(2025, 0, 1), pos: ecl(293, 1.8, 61.5) },
      { ms: D(2250, 0, 1), pos: ecl(293, 2.5, 725) },
    ],
  },
  {
    id: 'perseverance', name: 'Perseverance', type: 'mission',
    accent: { glow: '#D97750', ui: '#EE9770' },
    aliases: ['mars 2020', 'percy'],
    launchMs: D(2020, 6, 30),
    endMode: 'park', endRef: 'mars', endMs: D(2021, 1, 18), // Jezero landing
    waypoints: [
      { ms: D(2020, 6, 30), ref: 'earth', label: 'Launch' },
      { ms: D(2021, 1, 18), ref: 'mars', label: 'Mars landing', arc: true },
    ],
  },
];

// Resolves waypoints against the ephemeris once at startup, bows the cruise
// legs outward slightly (transfer orbits arc, they don't chord), and serves
// date → heliocentric AU positions plus the polyline for trajectory rendering.
export class MissionSet {
  constructor(eph) {
    this.eph = eph;
    this.resolved = new Map(); // id → {points:[{ms,x,y,z,label?}], mission}
    for (const m of MISSIONS) this._resolve(m);
  }

  _resolve(m) {
    const raw = m.waypoints.map((w) => {
      const p = w.ref ? this.eph.helio(w.ref, w.ms) : { x: w.pos[0], y: w.pos[1], z: w.pos[2] };
      return { ms: w.ms, x: p.x, y: p.y, z: p.z, label: w.label, arc: !!w.arc };
    });
    // Insert a bowed midpoint before each waypoint flagged arc:true
    const points = [raw[0]];
    for (let i = 1; i < raw.length; i++) {
      const a = raw[i - 1], b = raw[i];
      if (b.arc) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2;
        const rm = Math.hypot(mx, my, mz);
        const ra = Math.hypot(a.x, a.y, a.z), rb = Math.hypot(b.x, b.y, b.z);
        const target = ((ra + rb) / 2) * 1.04; // gentle outward bow
        const s = rm > 1e-9 ? target / rm : 1;
        points.push({ ms: (a.ms + b.ms) / 2, x: mx * s, y: my * s, z: mz * s });
      }
      points.push(b);
    }
    // Densify with a Catmull-Rom spline so the drawn trajectory and the
    // date→position lookup follow the exact same smooth curve.
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
      false,
      'centripetal'
    );
    const SUB = 14;
    const dense = [];
    for (let seg = 0; seg < points.length - 1; seg++) {
      for (let k = 0; k < SUB; k++) {
        const u = (seg + k / SUB) / (points.length - 1);
        const v = curve.getPoint(u);
        const ms = points[seg].ms + (k / SUB) * (points[seg + 1].ms - points[seg].ms);
        dense.push({ ms, x: v.x, y: v.y, z: v.z });
      }
    }
    const last = points[points.length - 1];
    dense.push({ ms: last.ms, x: last.x, y: last.y, z: last.z });
    this.resolved.set(m.id, { mission: m, points, densePoints: dense });
  }

  // Heliocentric AU position at time, or null when not yet launched.
  position(id, ms) {
    const { mission, densePoints: pts } = this.resolved.get(id);
    if (ms < mission.launchMs) return null;
    if (mission.endMode === 'park' && ms >= mission.endMs) {
      return this.eph.helio(mission.endRef, ms);
    }
    if (ms >= pts[pts.length - 1].ms) {
      const p = pts[pts.length - 1];
      return { x: p.x, y: p.y, z: p.z };
    }
    let lo = 0, hi = pts.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (pts[mid].ms <= ms) lo = mid; else hi = mid;
    }
    const a = pts[lo], b = pts[hi];
    const t = (ms - a.ms) / (b.ms - a.ms || 1);
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
  }
}
