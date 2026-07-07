// World frame: heliocentric ecliptic J2000. +X → vernal equinox, +Z → ecliptic north.
// Scene unit: 1 unit = 1e6 km. Rendering is camera-relative (camera sits at GL origin);
// world-space positions are kept as JS doubles to avoid float32 jitter far from the Sun.

export const KM_PER_UNIT = 1e6;
export const AU_KM = 149597870.7;
export const AU = AU_KM / KM_PER_UNIT; // 149.5978707 units per AU

export const DAY_MS = 86400000;
export const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0); // JD 2451545.0 TT ~ UTC noon (close enough at our precision)

export const TIME_MIN = Date.UTC(1750, 0, 1);
export const TIME_MAX = Date.UTC(2250, 0, 1);

export const OBLIQUITY_J2000 = 23.43928 * (Math.PI / 180);

export const daysSinceJ2000 = (ms) => (ms - J2000_MS) / DAY_MS;
export const centuriesSinceJ2000 = (ms) => daysSinceJ2000(ms) / 36525;

export const DEG = Math.PI / 180;

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// Gentler start/stop for long camera flights
export const easeInOutQuint = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
