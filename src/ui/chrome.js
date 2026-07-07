// Top bar: wordmark on the left, view controls on the right.
// All chrome is neutral grayscale — no color until a body is selected.

const icon = {
  labels: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="5" cy="8" r="2.2"/><path d="M8.5 8h5.5"/></svg>`,
  orbits: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><ellipse cx="8" cy="8" rx="6.4" ry="3.4"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  stars: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 12l3.5-3.5L9 11l4-6"/><circle cx="3" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="8.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="9" cy="11" r="1.1" fill="currentColor" stroke="none"/><circle cx="13" cy="5" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  search: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="4.4"/><path d="M10.4 10.4L14 14"/></svg>`,
  gallery: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="5" height="5" rx="1"/><rect x="9" y="2.5" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>`,
};

export function buildChrome(ui, { settings, onToggle, onScaleMode, onSearchOpen, onGalleryOpen }) {
  const bar = document.createElement('div');
  bar.className = 'topbar';
  bar.innerHTML = `
    <div class="wordmark glass">
      <span class="title">ORRERY</span>
      <span class="sub">Interactive Solar System</span>
    </div>
    <div class="controls glass">
      <button class="ctl-btn" data-k="labels">${icon.labels}Labels</button>
      <button class="ctl-btn" data-k="orbits">${icon.orbits}Orbits</button>
      <button class="ctl-btn" data-k="constellations">${icon.stars}Constellations</button>
      <div class="ctl-divider"></div>
      <div class="seg" data-k="scale">
        <button data-mode="compressed">Compressed</button>
        <button data-mode="realistic">Realistic</button>
      </div>
      <div class="ctl-divider"></div>
      <button class="ctl-btn" data-k="gallery">${icon.gallery}Gallery</button>
      <button class="ctl-btn" data-k="search">${icon.search}Search <span class="kbd">Space</span></button>
    </div>
  `;
  ui.appendChild(bar);

  const btns = {};
  for (const b of bar.querySelectorAll('.ctl-btn[data-k]')) {
    const k = b.dataset.k;
    btns[k] = b;
    if (k === 'search') {
      b.addEventListener('click', onSearchOpen);
      continue;
    }
    if (k === 'gallery') {
      b.addEventListener('click', onGalleryOpen);
      continue;
    }
    b.classList.toggle('active', settings[k]);
    b.addEventListener('click', () => {
      settings[k] = !settings[k];
      b.classList.toggle('active', settings[k]);
      onToggle(k, settings[k]);
    });
  }

  const seg = bar.querySelector('.seg');
  const segBtns = seg.querySelectorAll('button');
  const syncSeg = (mode) => {
    for (const sb of segBtns) sb.classList.toggle('active', sb.dataset.mode === mode);
  };
  syncSeg(settings.scaleMode);
  for (const sb of segBtns) {
    sb.addEventListener('click', () => {
      if (sb.classList.contains('active')) return;
      syncSeg(sb.dataset.mode);
      onScaleMode(sb.dataset.mode);
    });
  }

  const hints = document.createElement('div');
  hints.className = 'hints glass';
  hints.innerHTML = `
    <div class="h-row"><span class="kbd">Click</span> focus a body</div>
    <div class="h-row"><span class="kbd">Drag</span> orbit / look around</div>
    <div class="h-row"><span class="kbd">W A S D</span> fly &nbsp;·&nbsp; <span class="kbd">Scroll</span> zoom</div>
    <div class="h-row"><span class="kbd">R</span> recenter &nbsp;·&nbsp; <span class="kbd">Esc</span> release focus</div>
  `;
  ui.appendChild(hints);

  return { syncSeg };
}
