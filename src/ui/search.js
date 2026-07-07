// Spotlight-style search (spacebar). Fuzzy-ish matching over names and
// aliases; arrow keys + Enter to jump.

const TYPE_LABEL = {
  star: 'Star', planet: 'Planet', dwarf: 'Dwarf planet',
  moon: 'Moon', comet: 'Comet', mission: 'Mission',
  asteroid: 'Asteroid', kbo: 'KBO',
};

export class Search {
  constructor(ui, entries, onPick) {
    this.entries = entries; // [{id, name, type, aliases, accent}]
    this.onPick = onPick;
    this.activeIndex = 0;
    this.results = [];

    const el = document.createElement('div');
    el.className = 'search-overlay';
    el.innerHTML = `
      <div class="search-box glass">
        <div class="search-input-row">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="4.4"/><path d="M10.4 10.4L14 14"/></svg>
          <input type="text" placeholder="Search planets, moons, missions…" spellcheck="false" />
          <span class="kbd">Esc</span>
        </div>
        <div class="search-results"></div>
      </div>
    `;
    document.getElementById('ui').appendChild(el);
    this.el = el;
    this.input = el.querySelector('input');
    this.$results = el.querySelector('.search-results');

    el.addEventListener('pointerdown', (e) => {
      if (e.target === el) this.close();
    });
    this.input.addEventListener('input', () => this._update());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); this._move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this._move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); this._commit(); }
      else if (e.key === 'Escape') { this.close(); }
    });
  }

  get isOpen() {
    return this.el.classList.contains('open');
  }

  open() {
    this.el.classList.add('open');
    this.input.value = '';
    this._update();
    requestAnimationFrame(() => this.input.focus());
  }

  close() {
    this.el.classList.remove('open');
    this.input.blur();
  }

  _score(entry, q) {
    const name = entry.name.toLowerCase();
    if (name === q) return 100;
    if (name.startsWith(q)) return 80;
    const words = name.split(/[\s\-–/]+/);
    if (words.some((w) => w.startsWith(q))) return 65;
    if (name.includes(q)) return 50;
    for (const a of entry.aliases ?? []) {
      const al = a.toLowerCase();
      if (al === q) return 90;
      if (al.startsWith(q)) return 60;
      if (al.includes(q)) return 40;
    }
    return 0;
  }

  _update() {
    const q = this.input.value.trim().toLowerCase();
    if (!q) {
      // empty query: a shortlist of popular destinations
      this.results = this.entries.filter((e) =>
        ['sun', 'earth', 'saturn', 'jupiter', 'pluto', 'voyager1', 'titan', 'halley'].includes(e.id)
      );
    } else {
      this.results = this.entries
        .map((e) => ({ e, s: this._score(e, q) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s || a.e.name.length - b.e.name.length)
        .slice(0, 9)
        .map((r) => r.e);
    }
    this.activeIndex = 0;
    this._render();
  }

  _render() {
    if (this.results.length === 0) {
      this.$results.innerHTML = `<div class="search-empty">No matches — try “Europa”, “Voyager”, or “Halley”</div>`;
      return;
    }
    this.$results.innerHTML = '';
    this.results.forEach((e, i) => {
      const row = document.createElement('button');
      row.className = 'result-row' + (i === this.activeIndex ? ' active' : '');
      row.style.setProperty('--dot', e.accent.glow);
      row.innerHTML = `
        <span class="r-dot"></span>
        <span class="r-name">${e.name}</span>
        <span class="r-type chip">${TYPE_LABEL[e.type]}</span>
        <span class="r-enter">↵</span>
      `;
      row.addEventListener('pointerenter', () => {
        this.activeIndex = i;
        this._render();
      });
      row.addEventListener('click', () => this._commit());
      this.$results.appendChild(row);
    });
  }

  _move(d) {
    if (!this.results.length) return;
    this.activeIndex = (this.activeIndex + d + this.results.length) % this.results.length;
    this._render();
  }

  _commit() {
    const r = this.results[this.activeIndex];
    if (!r) return;
    this.close();
    this.onPick(r.id);
  }
}
