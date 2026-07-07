import { TIME_MIN, TIME_MAX, clamp } from '../consts.js';

// Simulation clock. `ms` is simulated Unix time; `rate` is simulated seconds
// per real second (negative = reverse). Defaults to real "now", playing at 1×.

export const SPEED_STEPS = [
  { label: 'Real time', rate: 1 },
  { label: '1 min/s', rate: 60 },
  { label: '1 hr/s', rate: 3600 },
  { label: '6 hr/s', rate: 6 * 3600 },
  { label: '1 day/s', rate: 86400 },
  { label: '1 wk/s', rate: 7 * 86400 },
  { label: '1 mo/s', rate: 30 * 86400 },
  { label: '1 yr/s', rate: 365.25 * 86400 },
  { label: '10 yr/s', rate: 3652.5 * 86400 },
  { label: '1 century/s', rate: 36525 * 86400 },
];

export class SimClock {
  constructor() {
    this.ms = clamp(Date.now(), TIME_MIN, TIME_MAX);
    this.playing = true;
    this.speedIndex = 0; // index into SPEED_STEPS
    this.direction = 1; // 1 forward, -1 reverse
    this.listeners = new Set();
  }

  get rate() {
    return SPEED_STEPS[this.speedIndex].rate * this.direction;
  }

  get speedLabel() {
    return SPEED_STEPS[this.speedIndex].label;
  }

  tick(realDtSec) {
    if (!this.playing) return;
    const next = this.ms + this.rate * realDtSec * 1000;
    this.ms = clamp(next, TIME_MIN, TIME_MAX);
    if (this.ms !== next) this.playing = false; // hit the range edge
    this._emit();
  }

  set(ms) {
    this.ms = clamp(ms, TIME_MIN, TIME_MAX);
    this._emit();
  }

  jumpToNow() {
    this.set(Date.now());
  }

  setSpeedIndex(i) {
    this.speedIndex = clamp(i, 0, SPEED_STEPS.length - 1);
    this._emit();
  }

  togglePlay() {
    this.playing = !this.playing;
    this._emit();
  }

  onChange(fn) {
    this.listeners.add(fn);
  }

  _emit() {
    for (const fn of this.listeners) fn(this);
  }
}
