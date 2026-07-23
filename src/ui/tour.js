// Tour player: a chooser popover under the toolbar plus a bottom-center
// narration card with progress dots and prev/next. The player only drives
// the camera via onStop(bodyId) — flying and highlighting stay in main.js.

export class TourPlayer {
  constructor(ui, tours, { onStop, onEnd }) {
    this.tours = tours;
    this.onStop = onStop;
    this.onEnd = onEnd;
    this.tour = null;
    this.i = 0;

    this.menu = document.createElement('div');
    this.menu.className = 'tour-menu glass';
    this.menu.hidden = true;
    this.menu.innerHTML = tours
      .map(
        (t) => `
        <button class="tour-item" data-id="${t.id}">
          <span class="t-title">${t.title}</span>
          <span class="t-blurb">${t.blurb}</span>
          <span class="t-count">${t.stops.length} stops</span>
        </button>`
      )
      .join('');
    ui.appendChild(this.menu);
    this.menu.addEventListener('click', (e) => {
      const item = e.target.closest('.tour-item');
      if (item) this.start(tours.find((t) => t.id === item.dataset.id));
    });

    this.card = document.createElement('div');
    this.card.className = 'tour-card glass';
    this.card.hidden = true;
    ui.appendChild(this.card);

    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') this.next();
      else if (e.key === 'ArrowLeft') this.prev();
    });
  }

  get isActive() {
    return this.tour !== null;
  }

  get isMenuOpen() {
    return !this.menu.hidden;
  }

  toggleMenu() {
    this.menu.hidden = !this.menu.hidden;
  }

  closeMenu() {
    this.menu.hidden = true;
  }

  start(tour) {
    this.closeMenu();
    this.tour = tour;
    this.i = 0;
    this.card.hidden = false;
    this._go();
  }

  next() {
    if (this.i >= this.tour.stops.length - 1) return this.end();
    this.i += 1;
    this._go();
  }

  prev() {
    if (this.i === 0) return;
    this.i -= 1;
    this._go();
  }

  end() {
    if (!this.isActive) return;
    this.tour = null;
    this.card.hidden = true;
    this.onEnd?.();
  }

  _go() {
    const stop = this.tour.stops[this.i];
    const last = this.i === this.tour.stops.length - 1;
    this.card.innerHTML = `
      <div class="tour-top">
        <span class="tour-name">${this.tour.title}</span>
        <button class="tour-close" title="End tour (Esc)">✕</button>
      </div>
      <div class="tour-stop-title">${stop.title}</div>
      <p class="tour-text">${stop.text}</p>
      <div class="tour-nav">
        <button class="tour-btn" data-nav="prev" ${this.i === 0 ? 'disabled' : ''}>← Prev</button>
        <div class="tour-dots">${this.tour.stops
          .map((_, j) => `<span class="dot${j === this.i ? ' on' : ''}"></span>`)
          .join('')}</div>
        <button class="tour-btn primary" data-nav="next">${last ? 'Finish' : 'Next →'}</button>
      </div>`;
    this.card.querySelector('.tour-close').addEventListener('click', () => this.end());
    this.card.querySelector('[data-nav="prev"]').addEventListener('click', () => this.prev());
    this.card.querySelector('[data-nav="next"]').addEventListener('click', () => this.next());
    this.onStop?.(stop.id);
  }
}
