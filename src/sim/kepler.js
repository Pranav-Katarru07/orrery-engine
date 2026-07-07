import { DEG, daysSinceJ2000 } from '../consts.js';

// Generic Keplerian element propagation → position in the parent-centric
// ecliptic J2000 frame, in AU (or in the element set's own distance unit).
//
// Element set shape:
// {
//   a,            // semi-major axis (AU unless unit:'km')
//   e,            // eccentricity (0 <= e < 1)
//   i,            // inclination to reference plane, deg
//   om,           // longitude of ascending node Ω, deg
//   w,            // argument of periapsis ω, deg
//   M0,           // mean anomaly at epoch, deg
//   epochMs,      // epoch as Unix ms (defaults to J2000)
//   periodDays,   // orbital period (drives mean motion; independent of unit)
// }

export function solveKepler(M, e) {
  // Normalize M to [-π, π] for a good starting guess
  M = M % (2 * Math.PI);
  if (M > Math.PI) M -= 2 * Math.PI;
  if (M < -Math.PI) M += 2 * Math.PI;

  let E = e < 0.8 ? M : Math.PI * Math.sign(M || 1);
  for (let k = 0; k < 30; k++) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    const d = f / fp;
    E -= d;
    if (Math.abs(d) < 1e-12) break;
  }
  return E;
}

// Returns {x, y, z} in the reference frame of the elements.
export function elementsToPosition(el, ms) {
  const epochMs = el.epochMs ?? Date.UTC(2000, 0, 1, 12);
  const dt = (ms - epochMs) / 86400000; // days since epoch
  const n = (2 * Math.PI) / el.periodDays; // mean motion, rad/day
  const M = el.M0 * DEG + n * dt;

  const E = solveKepler(M, el.e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);

  // True anomaly and radius
  const nu = Math.atan2(Math.sqrt(1 - el.e * el.e) * sinE, cosE - el.e);
  const r = el.a * (1 - el.e * cosE);

  // Perifocal → reference frame
  const cw = Math.cos(el.w * DEG), sw = Math.sin(el.w * DEG);
  const co = Math.cos(el.om * DEG), so = Math.sin(el.om * DEG);
  const ci = Math.cos(el.i * DEG), si = Math.sin(el.i * DEG);

  const xPf = r * Math.cos(nu);
  const yPf = r * Math.sin(nu);

  const x =
    (cw * co - sw * so * ci) * xPf + (-sw * co - cw * so * ci) * yPf;
  const y =
    (cw * so + sw * co * ci) * xPf + (-sw * so + cw * co * ci) * yPf;
  const z = sw * si * xPf + cw * si * yPf;

  return { x, y, z };
}

// Sample one full orbit (for orbit-line geometry), denser near periapsis
// where high-eccentricity orbits move fastest and curve hardest.
export function sampleOrbit(el, segments = 256) {
  const pts = [];
  for (let k = 0; k <= segments; k++) {
    // uniform in eccentric anomaly → naturally denser near periapsis in space
    const E = (k / segments) * 2 * Math.PI;
    const cosE = Math.cos(E), sinE = Math.sin(E);
    const nu = Math.atan2(Math.sqrt(1 - el.e * el.e) * sinE, cosE - el.e);
    const r = el.a * (1 - el.e * cosE);

    const cw = Math.cos(el.w * DEG), sw = Math.sin(el.w * DEG);
    const co = Math.cos(el.om * DEG), so = Math.sin(el.om * DEG);
    const ci = Math.cos(el.i * DEG), si = Math.sin(el.i * DEG);
    const xPf = r * Math.cos(nu);
    const yPf = r * Math.sin(nu);
    pts.push({
      x: (cw * co - sw * so * ci) * xPf + (-sw * co - cw * so * ci) * yPf,
      y: (cw * so + sw * co * ci) * xPf + (-sw * so + cw * co * ci) * yPf,
      z: sw * si * xPf + cw * si * yPf,
    });
  }
  return pts;
}
