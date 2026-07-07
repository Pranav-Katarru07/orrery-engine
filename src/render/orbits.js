import * as THREE from 'three';
import { GeoMoon, JupiterMoons } from 'astronomy-engine';
import { RotateVector, Rotation_EQJ_ECL } from 'astronomy-engine';
import { sampleOrbit } from '../sim/kepler.js';
import { equatorialBasis, poleToEcliptic } from '../sim/ephemeris.js';

const ROT = Rotation_EQJ_ECL();
const NEUTRAL = new THREE.Color('#5f6a7d');

const ENGINE_PERIOD_DAYS = {
  mercury: 87.97, venus: 224.7, earth: 365.25, mars: 686.98,
  jupiter: 4332.6, saturn: 10759, uranus: 30685, neptune: 60190, pluto: 90560,
};

// Contextual orbit lines. Heliocentric orbits are drawn faintly by default;
// a moon's orbit appears only when the camera is focused inside its parent's
// system; the selected body's orbit brightens in its accent color; mission
// trajectories appear when the mission is selected.
export class OrbitLines {
  constructor(scene, eph, catalogBodies, missionSet, simMs) {
    this.scene = scene;
    this.eph = eph;
    this.lines = new Map(); // id → entry
    this.showOrbits = true;
    this.selectedId = null;
    this.focusParent = null; // parent id of the focused system, or null
    this._lastBlend = -1;

    for (const def of catalogBodies) {
      if (def.provider === 'origin') continue;
      const auPts = this._sampleBody(def, simMs);
      if (!auPts) continue;
      this._addLine(def.id, def, auPts, def.parent !== 'sun');
    }
    for (const [id, entry] of missionSet.resolved) {
      const auPts = entry.densePoints.map((p) => ({ x: p.x, y: p.y, z: p.z }));
      this._addLine(id, entry.mission, auPts, false, true);
    }
  }

  _sampleBody(def, simMs) {
    const N = 256;
    switch (def.provider) {
      case 'engine': {
        const period = ENGINE_PERIOD_DAYS[def.id];
        const pts = [];
        for (let i = 0; i <= N; i++) {
          const ms = simMs + (i / N) * period * 86400000;
          pts.push(this.eph.helio(def.id, ms));
          this.eph._cache.clear(); // don't poison the frame cache with sample times
          this.eph._cacheMs = NaN;
        }
        return pts;
      }
      case 'kepler':
        return sampleOrbit(def.elements, N);
      case 'moon-engine': {
        const pts = [];
        for (let i = 0; i <= N; i++) {
          const ms = simMs + (i / N) * 27.32 * 86400000;
          const v = RotateVector(ROT, GeoMoon(new Date(ms)));
          pts.push({ x: v.x, y: v.y, z: v.z });
        }
        return pts;
      }
      case 'jupmoon': {
        const periods = { io: 1.769, europa: 3.551, ganymede: 7.155, callisto: 16.689 };
        const period = periods[def.jupmoonKey];
        const pts = [];
        for (let i = 0; i <= N; i++) {
          const ms = simMs + (i / N) * period * 86400000;
          const sv = JupiterMoons(new Date(ms))[def.jupmoonKey];
          const v = RotateVector(ROT, sv);
          pts.push({ x: v.x, y: v.y, z: v.z });
        }
        return pts;
      }
      case 'moon-kepler': {
        const local = sampleOrbit(def.elements, N);
        const parentDef = this.eph.catalog.get(def.parent);
        const { X, Y, Z } = equatorialBasis(poleToEcliptic(parentDef.pole.ra, parentDef.pole.dec));
        return local.map((p) => ({
          x: X.x * p.x + Y.x * p.y + Z.x * p.z,
          y: X.y * p.x + Y.y * p.y + Z.y * p.z,
          z: X.z * p.x + Y.z * p.y + Z.z * p.z,
        }));
      }
      default:
        return null;
    }
  }

  _addLine(id, def, auPts, isMoon, isMission = false) {
    const arr = new Float32Array(auPts.length * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    const mat = new THREE.LineBasicMaterial({
      color: NEUTRAL.clone(),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    this.scene.add(line);
    this.lines.set(id, { def, auPts, line, isMoon, isMission, accent: new THREE.Color(def.accent.glow) });
  }

  setSelection(id) {
    this.selectedId = id;
  }

  setFocusParent(parentId) {
    this.focusParent = parentId;
  }

  setShowOrbits(v) {
    this.showOrbits = v;
  }

  // getParentWorld(id) → THREE.Vector3 world units for a moon's parent
  update(camPos, scale, getParentWorld) {
    const remap = scale.s !== this._lastBlend;
    this._lastBlend = scale.s;
    const tmp = { x: 0, y: 0, z: 0 };

    for (const [id, e] of this.lines) {
      // visibility rules
      let visible;
      if (e.isMission) {
        visible = this.selectedId === id;
      } else if (e.isMoon) {
        visible =
          this.showOrbits &&
          (this.focusParent === e.def.parent || this.selectedId === id);
      } else {
        visible = this.showOrbits || this.selectedId === id;
      }
      e.line.visible = visible;
      if (!visible) continue;

      const selected = this.selectedId === id;
      e.line.material.color.copy(selected ? e.accent : NEUTRAL);
      e.line.material.opacity = selected ? 0.85 : e.isMoon ? 0.22 : e.def.type === 'comet' ? 0.1 : 0.16;

      if (remap || e._dirty !== false) {
        const arr = e.line.geometry.attributes.position.array;
        for (let i = 0; i < e.auPts.length; i++) {
          const p = e.auPts[i];
          if (e.isMoon) scale.mapMoonOffset(p, tmp);
          else scale.mapHelio(p, tmp);
          arr[i * 3] = tmp.x; arr[i * 3 + 1] = tmp.y; arr[i * 3 + 2] = tmp.z;
        }
        e.line.geometry.attributes.position.needsUpdate = true;
        e._dirty = false;
      }

      if (e.isMoon) {
        e.line.position.copy(getParentWorld(e.def.parent)).sub(camPos);
      } else {
        e.line.position.copy(camPos).multiplyScalar(-1);
      }
    }
  }
}
