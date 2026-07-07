import { AU, easeInOutCubic, clamp, lerp } from '../consts.js';

// Two coordinate mappings share one blend parameter s: 0 = realistic,
// 1 = compressed. Compressed mode shrinks heliocentric distances with a
// power law, enlarges radii sub-linearly, and expands moon systems with
// their own mapping so every moon clears its (enlarged) parent.

const COMP_DIST_K = 86.4;   // units per AU^COMP_DIST_P  → Neptune lands ~400 units out
const COMP_DIST_P = 0.45;
const COMP_RADIUS_K = 0.019; // units per √km → Earth ≈ 1.5 units, Sun ≈ 15.9
const COMP_MOON_K = 0.01;    // units per √km of true orbital distance

export class ScaleManager {
  constructor() {
    this.s = 1; // start compressed: whole system visible on load
    this.target = 1;
    this._animFrom = 1;
    this._animStart = 0;
    this._animDur = 2000;
    this.listeners = new Set();
  }

  get mode() {
    return this.target === 1 ? 'compressed' : 'realistic';
  }

  toggle() {
    this.setMode(this.target === 1 ? 'realistic' : 'compressed');
  }

  setMode(mode) {
    this.target = mode === 'compressed' ? 1 : 0;
    this._animFrom = this.s;
    this._animStart = performance.now();
    for (const fn of this.listeners) fn(mode);
  }

  onModeChange(fn) {
    this.listeners.add(fn);
  }

  get animating() {
    return this.s !== this.target;
  }

  tick(nowMs) {
    if (this.s === this.target) return;
    const t = clamp((nowMs - this._animStart) / this._animDur, 0, 1);
    this.s = lerp(this._animFrom, this.target, easeInOutCubic(t));
    if (t >= 1) this.s = this.target;
  }

  // Heliocentric AU {x,y,z} → scene units, for Sun-orbiting bodies.
  mapHelio(p, out) {
    const d = Math.hypot(p.x, p.y, p.z);
    if (d < 1e-12) {
      out.x = 0; out.y = 0; out.z = 0;
      return out;
    }
    const real = d * AU;
    const comp = COMP_DIST_K * Math.pow(d, COMP_DIST_P);
    const f = lerp(real, comp, this.s) / d;
    out.x = p.x * f; out.y = p.y * f; out.z = p.z * f;
    return out;
  }

  // Parent-relative AU offset for moons → scene units.
  mapMoonOffset(rel, out) {
    const dAU = Math.hypot(rel.x, rel.y, rel.z);
    if (dAU < 1e-12) {
      out.x = 0; out.y = 0; out.z = 0;
      return out;
    }
    const dKm = dAU * 149597870.7;
    const real = dAU * AU;
    const comp = COMP_MOON_K * Math.sqrt(dKm);
    const f = lerp(real, comp, this.s) / dAU;
    out.x = rel.x * f; out.y = rel.y * f; out.z = rel.z * f;
    return out;
  }

  // Body radius in scene units.
  radius(radiusKm) {
    const real = radiusKm / 1e6;
    const comp = COMP_RADIUS_K * Math.sqrt(radiusKm);
    return lerp(real, comp, this.s);
  }

  // Scalar heliocentric distance mapping (for belts/orbit sampling on CPU).
  helioDistance(dAU) {
    return lerp(dAU * AU, COMP_DIST_K * Math.pow(dAU, COMP_DIST_P), this.s);
  }

  // Scalar moon-system distance mapping (label/declutter heuristics).
  moonDistance(dKm) {
    const dAU = dKm / 149597870.7;
    return lerp(dAU * AU, COMP_MOON_K * Math.sqrt(dKm), this.s);
  }
}
