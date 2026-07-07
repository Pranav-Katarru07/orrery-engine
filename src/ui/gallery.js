import { BODIES } from '../data/bodies.js';
import { MISSIONS } from '../data/missions.js';
import { thumbHTML } from './thumbs.js';

// Global gallery window: a glass overlay showing every body as a labeled
// thumbnail, grouped by type. Clicking a tile does exactly what search-select
// does (fly there + open its panel). Built once, shown/hidden on demand.

const GROUPS = [
  { key: 'star', title: 'Star', types: ['star'] },
  { key: 'planet', title: 'Planets', types: ['planet'] },
  { key: 'dwarf', title: 'Dwarf Planets', types: ['dwarf'] },
  { key: 'moon', title: 'Moons', types: ['moon'] },
  { key: 'asteroid', title: 'Asteroids & KBOs', types: ['asteroid', 'kbo'] },
  { key: 'comet', title: 'Comets', types: ['comet'] },
  { key: 'mission', title: 'Missions', types: ['mission'] },
];

export class Gallery {
  constructor(ui, onPick) {
    this.onPick = onPick;
    const all = [...BODIES, ...MISSIONS];

    const el = document.createElement('div');
    el.className = 'gallery-overlay';
    el.innerHTML = `
      <div class="gallery-window glass">
        <div class="gallery-head">
          <div>
            <div class="gallery-title">Gallery</div>
            <div class="gallery-sub">Every world in the model — click to visit</div>
          </div>
          <button class="gallery-close" title="Close (Esc)">
            <svg viewBox="0 0 16 16" width="13" height="13" stroke="currentColor" stroke-width="1.6" fill="none"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>
        <div class="gallery-body"></div>
      </div>
    `;
    document.getElementById('ui').appendChild(el);
    this.el = el;
    const body = el.querySelector('.gallery-body');

    for (const g of GROUPS) {
      const members = all.filter((b) => g.types.includes(b.type));
      if (!members.length) continue;
      const section = document.createElement('div');
      section.className = 'gallery-section';
      section.innerHTML = `<div class="section-label">${g.title}</div><div class="gallery-grid"></div>`;
      const grid = section.querySelector('.gallery-grid');
      for (const def of members) {
        const tile = document.createElement('button');
        tile.className = 'gallery-tile';
        tile.dataset.id = def.id;
        tile.style.setProperty('--accent-line', `${def.accent.glow}88`);
        tile.innerHTML = `
          <div class="tile-thumb">${thumbHTML(def)}</div>
          <div class="tile-label"><span class="tile-dot" style="--dot:${def.accent.glow}"></span>${def.name}</div>
        `;
        tile.addEventListener('click', () => {
          this.close();
          this.onPick(def.id);
        });
        grid.appendChild(tile);
      }
      body.appendChild(section);
    }

    el.addEventListener('pointerdown', (e) => {
      if (e.target === el) this.close();
    });
    el.querySelector('.gallery-close').addEventListener('click', () => this.close());
  }

  get isOpen() {
    return this.el.classList.contains('open');
  }

  open() {
    this.el.classList.add('open');
    this.el.querySelector('.gallery-body').scrollTop = 0;
  }

  close() {
    this.el.classList.remove('open');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}
