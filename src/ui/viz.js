// SVG panel visualizations: hover-interactive interior cross-sections and
// animated magnetosphere diagrams. Data lives in src/data/visuals.js.

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

const fmtKm = (km) =>
  km >= 10000 ? `${Math.round(km / 1000).toLocaleString()},000` : Math.round(km).toLocaleString();

// ── Interior cross-section ────────────────────────────────────────────────
// Concentric annuli, inside → out; hovering a layer highlights it and
// updates the caption with name, material, and computed depth range.
export function buildCrossSection(def, cs) {
  const wrap = document.createElement('div');
  wrap.className = 'viz-block';
  wrap.innerHTML = `<h4>Interior Cross-Section</h4>`;

  const W = 340, H = 216;
  const cx = W / 2, cy = H / 2, maxR = 96;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'xs-svg' });

  const caption = document.createElement('div');
  caption.className = 'viz-hover-caption';
  const defaultCaption = `<span class="c-dim">Hover a layer to explore ${def.name}’s interior</span>`;
  caption.innerHTML = defaultCaption;

  const annulus = (ro, ri) =>
    `M ${cx - ro},${cy} a ${ro},${ro} 0 1,0 ${2 * ro},0 a ${ro},${ro} 0 1,0 ${-2 * ro},0` +
    (ri > 0.1
      ? ` M ${cx - ri},${cy} a ${ri},${ri} 0 1,0 ${2 * ri},0 a ${ri},${ri} 0 1,0 ${-2 * ri},0`
      : '');

  let innerFrac = 0;
  for (const layer of cs.layers) {
    const ro = layer.outerFrac * maxR;
    const ri = innerFrac * maxR;
    const path = svgEl('path', {
      d: annulus(ro, ri),
      'fill-rule': 'evenodd',
      fill: layer.color,
      class: 'xs-layer',
    });

    const R = def.radiusKm;
    const top = (1 - layer.outerFrac) * R;
    const bottom = (1 - innerFrac) * R;
    const depth =
      innerFrac === 0
        ? `${fmtKm(top)} km deep → centre`
        : layer.outerFrac === 1
          ? `surface → ${fmtKm(bottom)} km deep`
          : `${fmtKm(top)} – ${fmtKm(bottom)} km deep`;

    path.addEventListener('pointerenter', () => {
      svg.querySelectorAll('.xs-layer').forEach((p) => p.classList.remove('active'));
      path.classList.add('active');
      caption.innerHTML = `<strong>${layer.name}</strong> · ${layer.material}<span class="c-depth">${depth}</span>`;
    });
    svg.appendChild(path);
    innerFrac = layer.outerFrac;
  }
  svg.addEventListener('pointerleave', () => {
    svg.querySelectorAll('.xs-layer').forEach((p) => p.classList.remove('active'));
    caption.innerHTML = defaultCaption;
  });

  wrap.appendChild(svg);
  wrap.appendChild(caption);
  return wrap;
}

// ── Magnetosphere diagram ─────────────────────────────────────────────────
// Solar wind streams in from the left, deflecting at the bow shock; dipole
// field lines flow (animated dash offset) around the planet. The whole
// field group is tilted/offset per the body's real geometry, which makes
// the ice giants' broken dipoles obvious at a glance.
export function buildMagnetosphere(def, mg) {
  const wrap = document.createElement('div');
  wrap.className = 'viz-block';
  wrap.innerHTML = `<h4>Magnetosphere</h4>`;

  const W = 340, H = 224;
  const px = 205, py = 108, R = 24;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'mag-svg' });

  // bow shock + magnetopause (sunward side compressed)
  svg.appendChild(svgEl('path', {
    d: `M 148,4 Q 66,${py} 148,${H - 4}`,
    class: 'mag-boundary', 'stroke-dasharray': '2 6',
  }));
  svg.appendChild(svgEl('path', {
    d: `M 172,16 Q 102,${py} 172,${H - 16}`,
    class: 'mag-boundary strong',
  }));

  // solar wind streaks (CSS-animated drift, staggered)
  for (let i = 0; i < 6; i++) {
    const y = 24 + i * ((H - 48) / 5);
    const line = svgEl('line', { x1: 6, y1: y, x2: 30, y2: y, class: 'wind-dash' });
    line.style.animationDelay = `${(i * 0.45).toFixed(2)}s`;
    svg.appendChild(line);
  }
  const windLabel = svgEl('text', { x: 8, y: 14, class: 'mag-label' });
  windLabel.textContent = 'SOLAR WIND';
  svg.appendChild(windLabel);

  // spin axis (fixed, vertical)
  svg.appendChild(svgEl('line', {
    x1: px, y1: py - R * 2.6, x2: px, y2: py + R * 2.6,
    class: 'mag-spin-axis', 'stroke-dasharray': '3 4',
  }));

  // field-line group: tilted and offset like the real dipole
  const g = svgEl('g', {
    transform: `rotate(${mg.tiltDeg} ${px} ${py}) translate(0 ${(mg.offsetFrac * R).toFixed(1)})`,
  });
  // dipole axis
  g.appendChild(svgEl('line', {
    x1: px, y1: py - R * 2.4, x2: px, y2: py + R * 2.4, class: 'mag-dipole-axis',
  }));
  // nested field-line loops: compressed sunward (left), stretched tailward
  for (const s of [1.7, 2.5, 3.5]) {
    const top = py - R, bot = py + R;
    g.appendChild(svgEl('path', {
      d: `M ${px},${top} C ${px - R * s * 0.72},${py - R * s * 0.95} ${px - R * s * 0.72},${py + R * s * 0.95} ${px},${bot}`,
      class: 'mag-line', 'stroke-dasharray': '5 7',
    }));
    g.appendChild(svgEl('path', {
      d: `M ${px},${top} C ${px + R * s * 1.35},${py - R * s * 1.05} ${px + R * s * 1.35},${py + R * s * 1.05} ${px},${bot}`,
      class: 'mag-line', 'stroke-dasharray': '5 7',
    }));
  }
  // magnetotail streamers off the right edge
  g.appendChild(svgEl('path', { d: `M ${px},${py - R} C ${px + 60},${py - R * 1.7} ${W - 4},${py - R * 1.9} ${W - 2},${py - R * 2.0}`, class: 'mag-line faint', 'stroke-dasharray': '5 7' }));
  g.appendChild(svgEl('path', { d: `M ${px},${py + R} C ${px + 60},${py + R * 1.7} ${W - 4},${py + R * 1.9} ${W - 2},${py + R * 2.0}`, class: 'mag-line faint', 'stroke-dasharray': '5 7' }));
  svg.appendChild(g);

  // the body itself
  svg.appendChild(svgEl('circle', { cx: px, cy: py, r: R, fill: def.accent.glow, class: 'mag-planet' }));
  // night-side shading
  svg.appendChild(svgEl('path', {
    d: `M ${px},${py - R} a ${R},${R} 0 0,1 0,${2 * R} z`,
    fill: 'rgba(0,0,0,0.42)',
  }));

  const caption = document.createElement('div');
  caption.className = 'viz-hover-caption static';
  caption.innerHTML = `<strong>${mg.strength}</strong> · dipole tilt ${mg.tiltDeg}°${mg.offsetFrac ? ` · offset ${Math.round(mg.offsetFrac * 100)}% of radius` : ''}`;
  const note = document.createElement('p');
  note.className = 'viz-note';
  note.textContent = mg.note;

  wrap.appendChild(svg);
  wrap.appendChild(caption);
  wrap.appendChild(note);
  return wrap;
}
