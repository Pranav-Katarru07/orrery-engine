import {
  Body,
  HelioVector,
  GeoMoon,
  JupiterMoons,
  MakeTime,
  RotateVector,
  Rotation_EQJ_ECL,
} from 'astronomy-engine';
import { DEG } from '../consts.js';
import { elementsToPosition } from './kepler.js';

// All positions returned in heliocentric ecliptic J2000, in AU, as {x,y,z}.
// Providers:
//   'origin'       — the Sun
//   'engine'       — astronomy-engine HelioVector (8 planets + Pluto)
//   'moon-engine'  — Earth's Moon via GeoMoon
//   'jupmoon'      — Galilean moons via JupiterMoons
//   'kepler'       — heliocentric Keplerian elements (dwarfs, comets)
//   'moon-kepler'  — parent-centric elements in the parent's equatorial frame

const ROT_EQJ_ECL = Rotation_EQJ_ECL();

const eqjToEcl = (v) => {
  const r = RotateVector(ROT_EQJ_ECL, v);
  return { x: r.x, y: r.y, z: r.z };
};

// IAU pole (RA/dec, J2000 equatorial, degrees) → unit vector in ecliptic frame
export function poleToEcliptic(raDeg, decDeg) {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  const v = {
    x: Math.cos(dec) * Math.cos(ra),
    y: Math.cos(dec) * Math.sin(ra),
    z: Math.sin(dec),
    t: null,
  };
  const r = RotateVector(ROT_EQJ_ECL, v);
  const len = Math.hypot(r.x, r.y, r.z) || 1;
  return { x: r.x / len, y: r.y / len, z: r.z / len };
}

// Orthonormal basis for a parent's equatorial frame in ecliptic coords.
// x-axis along the ascending node of the parent's equator on the ecliptic.
export function equatorialBasis(pole) {
  const zx = pole.x, zy = pole.y, zz = pole.z;
  // node = zEcl × pole
  let nx = -zy, ny = zx, nz = 0;
  const nl = Math.hypot(nx, ny, nz);
  if (nl < 1e-9) { nx = 1; ny = 0; nz = 0; } else { nx /= nl; ny /= nl; nz /= nl; }
  // y = z × x
  const yx = zy * nz - zz * ny;
  const yy = zz * nx - zx * nz;
  const yz = zx * ny - zy * nx;
  return { X: { x: nx, y: ny, z: nz }, Y: { x: yx, y: yy, z: yz }, Z: pole };
}

const ENGINE_BODIES = {
  mercury: Body.Mercury,
  venus: Body.Venus,
  earth: Body.Earth,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto,
};

export class Ephemeris {
  constructor(catalog) {
    this.catalog = catalog; // Map id → body def
    this._cacheMs = NaN;
    this._cache = new Map();
    this._basisCache = new Map(); // per-body equatorial basis (poles ~static)
  }

  _basis(bodyDef) {
    let b = this._basisCache.get(bodyDef.id);
    if (!b) {
      const pole = poleToEcliptic(bodyDef.pole.ra, bodyDef.pole.dec);
      b = equatorialBasis(pole);
      this._basisCache.set(bodyDef.id, b);
    }
    return b;
  }

  pole(bodyDef) {
    return this._basis(bodyDef).Z;
  }

  // Heliocentric ecliptic position (AU) of a catalog body at Unix ms.
  helio(id, ms) {
    if (ms !== this._cacheMs) {
      this._cacheMs = ms;
      this._cache.clear();
    }
    const hit = this._cache.get(id);
    if (hit) return hit;

    const def = this.catalog.get(id);
    if (!def) throw new Error(`ephemeris: unknown body '${id}'`);
    const pos = this._compute(def, ms);
    this._cache.set(id, pos);
    return pos;
  }

  _compute(def, ms) {
    const date = new Date(ms);
    switch (def.provider) {
      case 'origin':
        return { x: 0, y: 0, z: 0 };

      case 'engine': {
        const v = HelioVector(ENGINE_BODIES[def.id], date);
        return eqjToEcl(v);
      }

      case 'moon-engine': {
        const e = this.helio('earth', ms);
        const m = eqjToEcl(GeoMoon(date));
        return { x: e.x + m.x, y: e.y + m.y, z: e.z + m.z };
      }

      case 'jupmoon': {
        const j = this.helio('jupiter', ms);
        // one JupiterMoons call serves all four Galileans this frame
        if (this._jupMs !== ms) {
          this._jup = JupiterMoons(date);
          this._jupMs = ms;
        }
        const sv = this._jup[def.jupmoonKey];
        const rel = eqjToEcl(sv);
        return { x: j.x + rel.x, y: j.y + rel.y, z: j.z + rel.z };
      }

      case 'kepler': {
        return elementsToPosition(def.elements, ms);
      }

      case 'moon-kepler': {
        const parent = this.helio(def.parent, ms);
        const local = elementsToPosition(def.elements, ms); // in parent-equator frame, AU
        const parentDef = this.catalog.get(def.parent);
        const { X, Y, Z } = this._basis(parentDef);
        return {
          x: parent.x + X.x * local.x + Y.x * local.y + Z.x * local.z,
          y: parent.y + X.y * local.x + Y.y * local.y + Z.y * local.z,
          z: parent.z + X.z * local.x + Y.z * local.y + Z.z * local.z,
        };
      }

      default:
        throw new Error(`ephemeris: unknown provider '${def.provider}'`);
    }
  }
}
