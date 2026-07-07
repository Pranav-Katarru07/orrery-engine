import { TIME_MIN, TIME_MAX, clamp } from '../consts.js';
import { SPEED_STEPS } from '../sim/time.js';

const fmtDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});
const fmtTime = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
});

const ic = {
  play: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.2v9.6l8-4.8z"/></svg>`,
  pause: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3" width="3" height="10" rx="1"/><rect x="9" y="3" width="3" height="10" rx="1"/></svg>`,
  rev: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3a5 5 0 1 1-4.9 6"/><path d="M3 5.5V9h3.5" stroke-linecap="round"/></svg>`,
  minus: `<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.6"><path d="M4 8h8"/></svg>`,
  plus: `<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.6"><path d="M4 8h8M8 4v8"/></svg>`,
};

// Scrubbable 1750–2250 timeline with playback speed control.
export class Timeline {
  constructor(ui, clock) {
    this.clock = clock;
    const el = document.createElement('div');
    el.className = 'timeline glass';
    el.innerHTML = `
      <div class="timeline-row">
        <button class="tl-btn" data-a="play" title="Play / pause">${ic.pause}</button>
        <button class="tl-btn small" data-a="rev" title="Reverse time">${ic.rev}</button>
        <div class="tl-date">
          <span class="date"></span>
          <span class="time"></span>
        </div>
        <div class="tl-speed">
          <button class="tl-btn small" data-a="slower" title="Slower">${ic.minus}</button>
          <span class="speed-label"></span>
          <button class="tl-btn small" data-a="faster" title="Faster">${ic.plus}</button>
          <button class="tl-now" data-a="now">Now</button>
        </div>
      </div>
      <div class="scrubber">
        <div class="scrub-ticks"></div>
        <div class="scrub-track"></div>
        <div class="scrub-fill"></div>
        <div class="scrub-handle"></div>
      </div>
    `;
    ui.appendChild(el);
    this.el = el;
    this.$date = el.querySelector('.date');
    this.$time = el.querySelector('.time');
    this.$speed = el.querySelector('.speed-label');
    this.$play = el.querySelector('[data-a="play"]');
    this.$rev = el.querySelector('[data-a="rev"]');
    this.$fill = el.querySelector('.scrub-fill');
    this.$handle = el.querySelector('.scrub-handle');
    this.scrubber = el.querySelector('.scrubber');

    const ticks = el.querySelector('.scrub-ticks');
    for (let y = 1750; y <= 2250; y += 50) {
      const t = (Date.UTC(y, 0, 1) - TIME_MIN) / (TIME_MAX - TIME_MIN);
      const d = document.createElement('div');
      d.className = 'scrub-tick';
      d.style.left = `${(t * 100).toFixed(2)}%`;
      if (y % 100 === 0) d.innerHTML = `<span>${y}</span>`;
      ticks.appendChild(d);
    }

    el.querySelector('[data-a="play"]').addEventListener('click', () => clock.togglePlay());
    el.querySelector('[data-a="rev"]').addEventListener('click', () => {
      clock.direction *= -1;
      this.render();
    });
    el.querySelector('[data-a="slower"]').addEventListener('click', () => clock.setSpeedIndex(clock.speedIndex - 1));
    el.querySelector('[data-a="faster"]').addEventListener('click', () => clock.setSpeedIndex(clock.speedIndex + 1));
    el.querySelector('[data-a="now"]').addEventListener('click', () => {
      clock.jumpToNow();
      clock.direction = 1;
      clock.setSpeedIndex(0);
      clock.playing = true;
      this.render();
    });

    let scrubbing = false;
    const scrubTo = (ev) => {
      const r = this.scrubber.getBoundingClientRect();
      const t = clamp((ev.clientX - r.left) / r.width, 0, 1);
      clock.set(TIME_MIN + t * (TIME_MAX - TIME_MIN));
    };
    this.scrubber.addEventListener('pointerdown', (ev) => {
      scrubbing = true;
      this._wasPlaying = clock.playing;
      clock.playing = false;
      this.scrubber.setPointerCapture(ev.pointerId);
      el.classList.add('scrubbing'); // keep the bar expanded mid-drag
      scrubTo(ev);
    });
    this.scrubber.addEventListener('pointermove', (ev) => scrubbing && scrubTo(ev));
    this.scrubber.addEventListener('pointerup', () => {
      scrubbing = false;
      clock.playing = this._wasPlaying;
      el.classList.remove('scrubbing');
    });

    clock.onChange(() => this.render());
    this.render();
  }

  render() {
    const c = this.clock;
    const d = new Date(c.ms);
    this.$date.textContent = fmtDate.format(d);
    this.$time.textContent = `${fmtTime.format(d)} UTC`;
    const dir = c.direction < 0 ? '− ' : '';
    this.$speed.textContent = dir + SPEED_STEPS[c.speedIndex].label;
    this.$play.innerHTML = c.playing ? ic.pause : ic.play;
    this.$rev.style.color = c.direction < 0 ? 'var(--accent)' : '';
    const t = (c.ms - TIME_MIN) / (TIME_MAX - TIME_MIN);
    this.$fill.style.width = `${(t * 100).toFixed(3)}%`;
    this.$handle.style.left = `${(t * 100).toFixed(3)}%`;
  }
}
