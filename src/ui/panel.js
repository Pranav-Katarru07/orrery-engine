import { TIME_MAX } from '../consts.js';
import { CROSS_SECTIONS, MAGNETOSPHERES } from '../data/visuals.js';
import { buildCrossSection, buildMagnetosphere } from './viz.js';
import { galleryFor } from '../data/gallery.js';
import { referenceFor } from '../data/references.js';
import { GLOSSARY, GLOSSARY_TERMS } from '../data/glossary.js';
import { openLightbox } from './lightbox.js';

// Wrap the first occurrence of each glossary term (longest-first) in a marked
// span for the definition popover. Skips text already inside a tag by only
// operating on plain-text runs. `used` de-dupes across a whole panel render.
function linkifyGlossary(text, used) {
  let out = text;
  for (const term of GLOSSARY_TERMS) {
    if (used.has(term)) continue;
    const re = new RegExp(`(?<![\\w-])(${escapeRe(term)})(?![\\w-])`, 'i');
    if (re.test(out)) {
      out = out.replace(re, `<span class="glossary-term" data-term="${term}">$1</span>`);
      used.add(term);
    }
  }
  return out;
}
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Info panel: Overview / Orbit / <deep-dive> tabs, subtab pills under the
// deep-dive tab, accent re-skinned per body via the CSS accent variables.

// Comet elements set M0 = 0 at a perihelion epoch (see data/bodies.js), so
// perihelia land every whole period from there.
function nextPerihelionMs(el, simMs) {
  const period = el.periodDays * 86400000;
  const k = Math.ceil((simMs - el.epochMs) / period);
  return el.epochMs + k * period;
}

const fmtPerihelion = new Intl.DateTimeFormat('en-GB', {
  month: 'short', year: 'numeric', timeZone: 'UTC',
});

function returnPeriodLabel(periodDays) {
  const yr = periodDays / 365.25;
  if (yr >= 200) return `≈ ${Math.round(yr / 10) * 10}`;
  if (yr >= 20) return `≈ ${Math.round(yr)}`;
  return `≈ ${yr.toFixed(1)}`;
}

const TAB3_TITLE = {
  star: 'Star', planet: 'Planet', dwarf: 'Dwarf Planet',
  moon: 'Moon', comet: 'Comet', mission: 'Mission',
  asteroid: 'Asteroid', kbo: 'Object',
};
const TYPE_LABEL = {
  star: 'Star', planet: 'Planet', dwarf: 'Dwarf planet',
  moon: 'Moon', comet: 'Comet', mission: 'Spacecraft',
  asteroid: 'Asteroid', kbo: 'Kuiper Belt object',
};

const fmtWaypoint = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});

export class Panel {
  constructor(ui, { onSelect, onClose, onJumpToDate, getSimMs }) {
    this.onSelect = onSelect;
    this.onClose = onClose;
    this.onJumpToDate = onJumpToDate;
    this.getSimMs = getSimMs;
    const el = document.createElement('aside');
    el.className = 'panel glass';
    el.innerHTML = `
      <div class="panel-header">
        <div class="row1">
          <span class="chip accent type-chip"></span>
          <button class="panel-close" title="Close (Esc)">
            <svg viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" stroke-width="1.6" fill="none"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>
        <h1 class="panel-title"></h1>
        <div class="panel-parent"></div>
      </div>
      <div class="tab-row"></div>
      <div class="subtab-row" hidden></div>
      <div class="panel-body"></div>
    `;
    ui.appendChild(el);
    this.el = el;
    this.$type = el.querySelector('.type-chip');
    this.$title = el.querySelector('.panel-title');
    this.$parent = el.querySelector('.panel-parent');
    this.$tabs = el.querySelector('.tab-row');
    this.$subtabs = el.querySelector('.subtab-row');
    this.$body = el.querySelector('.panel-body');
    el.querySelector('.panel-close').addEventListener('click', () => this.onClose());
    this._initGlossaryPop();
  }

  // One shared definition card, positioned under whichever glossary term the
  // pointer is over. Delegated so it survives every panel re-render.
  _initGlossaryPop() {
    const pop = document.createElement('div');
    pop.className = 'glossary-pop glass';
    document.getElementById('ui').appendChild(pop);
    this.$pop = pop;

    const show = (term) => {
      const def = GLOSSARY[term.toLowerCase()];
      if (!def) return;
      pop.innerHTML = `<div class="gp-term">${term}</div><div class="gp-def">${def}</div>`;
      pop.classList.add('visible');
    };
    const place = (el) => {
      const r = el.getBoundingClientRect();
      pop.style.visibility = 'hidden';
      pop.classList.add('visible');
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = r.left + r.width / 2 - pw / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
      let top = r.top - ph - 10;
      if (top < 12) top = r.bottom + 10; // flip below if no room above
      pop.style.left = `${left}px`;
      pop.style.top = `${top}px`;
      pop.style.visibility = '';
    };
    const hide = () => pop.classList.remove('visible');

    this.$body.addEventListener('pointerover', (e) => {
      const t = e.target.closest('.glossary-term');
      if (!t) return;
      show(t.dataset.term);
      place(t);
    });
    this.$body.addEventListener('pointerout', (e) => {
      if (e.target.closest('.glossary-term')) hide();
    });
    this.$body.addEventListener('scroll', hide, { passive: true });
    // tap toggle on touch
    this.$body.addEventListener('click', (e) => {
      const t = e.target.closest('.glossary-term');
      if (!t) return hide();
      if (pop.classList.contains('visible')) hide();
      else { show(t.dataset.term); place(t); }
    });
  }

  get isOpen() {
    return this.el.classList.contains('open');
  }

  open(def, content, { parentDef, moons }) {
    this.def = def;
    this.content = content;
    this.parentDef = parentDef;
    this.moons = moons; // [{id, name, radiusKm}]
    this.tab = 'overview';
    this.subtab = content.tabs?.[0]?.id ?? null;

    this.$type.textContent = TYPE_LABEL[def.type];
    this.$title.textContent = def.name;
    if (parentDef) {
      this.$parent.innerHTML = `Orbits <button>${parentDef.name}</button>`;
      this.$parent.querySelector('button').addEventListener('click', () => this.onSelect(parentDef.id));
      this.$parent.hidden = false;
    } else {
      this.$parent.hidden = true;
    }

    const t3 = TAB3_TITLE[def.type];
    const orbitTitle = def.type === 'mission' ? 'Journey' : 'Orbit';
    this.$tabs.innerHTML = '';
    for (const [id, label] of [['overview', 'Overview'], ['orbit', orbitTitle], ['deep', t3]]) {
      const b = document.createElement('button');
      b.textContent = label;
      b.dataset.tab = id;
      b.addEventListener('click', () => {
        this.tab = id;
        this._render();
      });
      this.$tabs.appendChild(b);
    }

    this.el.classList.add('open');
    this._render();
  }

  close() {
    this.el.classList.remove('open');
  }

  get isOpen() {
    return this.el.classList.contains('open');
  }

  _render() {
    for (const b of this.$tabs.children) b.classList.toggle('active', b.dataset.tab === this.tab);
    this.$subtabs.hidden = this.tab !== 'deep' || !(this.content.tabs?.length > 1);
    this.$body.scrollTop = 0;

    if (this.tab === 'overview') this._renderOverview();
    else if (this.tab === 'orbit') this._renderOrbit();
    else this._renderDeep();
  }

  _renderOverview() {
    const c = this.content;
    const facts = (c.facts ?? [])
      .map((f, i) => `<div class="fact"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${f}</span></div>`)
      .join('');
    const ref = referenceFor(this.def.id);
    const used = new Set();
    const detail = ref
      ? `<h4>In Depth</h4>${ref.detail.map((p) => `<p>${linkifyGlossary(p, used)}</p>`).join('')}${this._sourceBlock(ref.sources)}`
      : '';
    this.$body.innerHTML = `
      <p>${c.summary}</p>
      ${this.def.type === 'comet' ? this._flybyStats() : ''}
      <h4>Top 5 Facts</h4>
      <div class="fact-list">${facts}</div>
      ${detail}
    `;
    this._wireJumpButton();
    this._mountGalleryStrip(); // appended last, sits at the bottom of Overview
  }

  _sourceBlock(sources) {
    if (!sources?.length) return '';
    const links = sources
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`)
      .join('<span class="src-sep">·</span>');
    return `<div class="panel-sources"><span class="src-label">Sources</span>${links}</div>`;
  }

  // Horizontal 2-tall thumbnail strip; clicking a thumb opens the lightbox.
  _mountGalleryStrip() {
    const imgs = galleryFor(this.def.id);
    if (!imgs.length) return;
    const strip = document.createElement('div');
    strip.className = 'gallery-strip-wrap';
    strip.innerHTML = `<h4>Gallery</h4><div class="gallery-strip"></div>`;
    const row = strip.querySelector('.gallery-strip');
    const MAX = 8;
    imgs.slice(0, MAX).forEach((im, i) => {
      const cell = document.createElement('button');
      cell.className = 'strip-cell';
      const overflow = i === MAX - 1 && imgs.length > MAX ? `<span class="strip-more">+${imgs.length - MAX + 1}</span>` : '';
      cell.innerHTML = `<img src="${im.file}" alt="${im.title || ''}" loading="lazy" />${overflow}`;
      cell.addEventListener('click', () => openLightbox(imgs, i, this.def.accent));
      row.appendChild(cell);
    });
    this.$body.appendChild(strip);
  }

  // Live next-perihelion readout for comets, computed from the sim clock.
  _flybyStats(withButton = false) {
    const el = this.def.elements;
    if (!el) return '';
    const next = nextPerihelionMs(el, this.getSimMs());
    const beyond = next > TIME_MAX;
    const stats = this._statGrid([
      { label: 'Next perihelion', value: fmtPerihelion.format(new Date(next)) },
      { label: 'Returns every', value: returnPeriodLabel(el.periodDays), unit: 'yr' },
    ]);
    const button =
      withButton && !beyond
        ? `<button class="jump-btn" data-jump="${next}">Jump to next perihelion →</button>`
        : withButton
          ? `<div class="jump-note">Next perihelion falls beyond this timeline's 2250 horizon</div>`
          : '';
    return stats + button;
  }

  _wireJumpButton() {
    const btn = this.$body.querySelector('.jump-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.onJumpToDate(Number(btn.dataset.jump));
      this._render(); // refresh the live readouts
    });
  }

  _renderOrbit() {
    if (this.def.type === 'mission') {
      this._renderMissionJourney();
      return;
    }
    const c = this.content;
    const stats = this._statGrid(c.orbit?.stats ?? []);
    const viz = this._orbitViz();
    const flyby = this.def.type === 'comet' ? `<h4>Next Return</h4>${this._flybyStats(true)}` : '';
    this.$body.innerHTML = `
      ${viz}
      ${flyby}
      <h4>Orbital Elements</h4>
      ${stats}
      ${c.orbit?.note ? `<p>${c.orbit.note}</p>` : ''}
    `;
    this._wireJumpButton();
  }

  _renderMissionJourney() {
    const wps = this.def.waypoints
      .filter((w) => w.label)
      .map(
        (w) => `
      <div class="fact">
        <span class="n" style="font-size:11.5px; min-width:86px;">${fmtWaypoint.format(new Date(w.ms))}</span>
        <span class="t">${w.label}</span>
      </div>`
      )
      .join('');
    const c = this.content;
    this.$body.innerHTML = `
      ${c.orbit?.note ? `<p>${c.orbit.note}</p>` : ''}
      <h4>Key Waypoints</h4>
      <div class="fact-list">${wps}</div>
      ${c.orbit?.stats ? `<h4>Journey Stats</h4>${this._statGrid(c.orbit.stats)}` : ''}
    `;
  }

  // Orbit shape vs. a circle of the same semi-major axis.
  _orbitViz() {
    const e = this.content.orbit?.e;
    if (e == null) return '';
    const W = 340, H = 190;
    const cx = W / 2, cy = H / 2;
    const axisRatio = Math.sqrt(1 - e * e);
    // fit the ellipse: semi-minor capped by height, semi-major by width
    const a = Math.min(150, (H / 2 - 24) / axisRatio);
    const b = a * axisRatio;
    const fx = cx + a * e; // primary sits at the focus
    const isMoon = this.def.type === 'moon';
    const focusColor = isMoon ? 'var(--accent-glow)' : '#FFC24D';
    return `
      <div class="orbit-viz">
        <svg viewBox="0 0 ${W} ${H}">
          <circle cx="${cx}" cy="${cy}" r="${a}" fill="none"
            stroke="rgba(255,255,255,0.16)" stroke-dasharray="3 5" stroke-width="1" />
          <ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${b}" fill="none"
            stroke="var(--accent)" stroke-width="1.6" opacity="0.9" />
          <circle cx="${fx}" cy="${cy}" r="5" fill="${focusColor}" opacity="0.95" />
          <circle cx="${fx}" cy="${cy}" r="9" fill="${focusColor}" opacity="0.18" />
          <circle cx="${cx - a}" cy="${cy}" r="3" fill="var(--accent)" />
          <text x="${Math.max(30, cx - a)}" y="${cy - 12}" fill="#98a1b3" font-size="9" text-anchor="middle" style="letter-spacing:.06em">${isMoon ? 'APOAPSIS' : 'APHELION'}</text>
          <text x="${Math.min(W - 34, cx + a)}" y="${cy - 12}" fill="#98a1b3" font-size="9" text-anchor="middle" style="letter-spacing:.06em">${isMoon ? 'PERIAPSIS' : 'PERIHELION'}</text>
        </svg>
        <div class="viz-caption">True orbit shape (solid, e = ${e}) vs. perfect circle (dashed)</div>
      </div>
    `;
  }

  _renderDeep() {
    const tabs = this.content.tabs ?? [];
    this.$subtabs.innerHTML = '';
    if (!tabs.some((t) => t.id === this.subtab)) this.subtab = tabs[0]?.id;
    for (const t of tabs) {
      const b = document.createElement('button');
      b.textContent = t.title;
      b.classList.toggle('active', t.id === this.subtab);
      b.addEventListener('click', () => {
        this.subtab = t.id;
        this._render();
      });
      this.$subtabs.appendChild(b);
    }
    const tab = tabs.find((t) => t.id === this.subtab);
    this.$body.innerHTML = tab ? this._blocks(tab.blocks) : '';
    // moon chips are interactive
    for (const chip of this.$body.querySelectorAll('.moon-chip')) {
      chip.addEventListener('click', () => this.onSelect(chip.dataset.id));
    }
    // visualizations slot in above the text when their subtab is open
    const mg = MAGNETOSPHERES[this.def.id];
    if (mg && this.subtab === (mg.subtab ?? 'magnetosphere')) {
      this.$body.prepend(buildMagnetosphere(this.def, mg));
    }
    const cs = CROSS_SECTIONS[this.def.id];
    if (cs && this.subtab === (cs.subtab ?? 'composition')) {
      this.$body.prepend(buildCrossSection(this.def, cs));
    }
  }

  _statGrid(items) {
    const cards = items
      .map(
        (s) => `
      <div class="stat-card">
        <div class="s-label">${s.label}</div>
        <div class="s-value">${s.value}${s.unit ? `<small>${s.unit}</small>` : ''}</div>
      </div>`
      )
      .join('');
    return `<div class="stat-grid">${cards}</div>`;
  }

  _blocks(blocks = []) {
    return blocks
      .map((b) => {
        switch (b.type) {
          case 'p':
            return `<p>${b.text}</p>`;
          case 'h':
            return `<h4>${b.text}</h4>`;
          case 'stats':
            return this._statGrid(b.items);
          case 'bars':
            return b.items
              .map(
                (it) => `
              <div class="bar-row">
                <div class="b-head"><span>${it.label}</span><span>${it.display}</span></div>
                <div class="b-track"><div class="b-fill" style="width:${Math.min(100, it.frac * 100).toFixed(1)}%"></div></div>
              </div>`
              )
              .join('');
          case 'moons': {
            if (!this.moons?.length) return `<p>No moons of this body are in the catalog.</p>`;
            const chips = this.moons
              .map(
                (m) => `
              <button class="moon-chip" data-id="${m.id}">
                <span class="m-name">${m.name}</span>
                <span class="m-sub">r ≈ ${m.radiusKm.toLocaleString()} km</span>
              </button>`
              )
              .join('');
            return `<div class="moon-grid">${chips}</div>`;
          }
          default:
            return '';
        }
      })
      .join('');
  }
}
