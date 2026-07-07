import * as THREE from 'three';

// NASA-Eyes-style smart labels: crisp HTML markers projected onto the scene.
// Each body gets a dot + name; moons only surface when the camera is close
// enough to their parent system; a coarse occupancy grid ranks labels by
// importance and drops overlapping lower-priority ones. Labels are clickable
// (they double as the long-range picking mechanism) and the selected body
// carries an accent-colored selection ring sized to its projected disc.

export class Labels {
  constructor(container, targets, onPick) {
    this.container = container;
    this.items = new Map();
    this.visible = true;
    this.selectedId = null;
    this._v = new THREE.Vector3();

    for (const t of targets) {
      const el = document.createElement('div');
      el.className = `body-label rank-${t.labelRank ?? 3} type-${t.type}`;
      el.innerHTML = `<span class="label-dot"></span><span class="label-text">${t.name}</span>`;
      el.style.setProperty('--dot', t.accent.glow);
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onPick(t.id);
      });
      container.appendChild(el);
      this.items.set(t.id, { def: t, el, shown: false });
    }

    this.ring = document.createElement('div');
    this.ring.className = 'selection-ring';
    container.appendChild(this.ring);
  }

  setVisible(v) {
    this.visible = v;
  }

  setSelection(id) {
    this.selectedId = id;
  }

  // state per body comes from the frame loop:
  //   getWorld(id) → THREE.Vector3 | null (null = hidden, e.g. unlaunched mission)
  //   isMoonShown(def) → bool for moon-tier declutter
  update(camera, camPos, getWorld, getRadius, isMoonShown) {
    const w = window.innerWidth, h = window.innerHeight;
    const cells = new Set();
    const CELL_W = 110, CELL_H = 34;
    const invQuat = camera.quaternion.clone().invert();

    // project all, then place in priority order
    const placed = [];
    for (const [id, item] of this.items) {
      const world = getWorld(id);
      let ok = this.visible || id === this.selectedId;
      if (!world) ok = false;
      if (ok && item.def.type === 'moon' && id !== this.selectedId && !isMoonShown(item.def)) ok = false;

      if (ok) {
        this._v.copy(world).sub(camPos).applyQuaternion(invQuat);
        if (this._v.z > -1e-6) ok = false; // behind camera
      }
      let sx = 0, sy = 0, dist = 0;
      if (ok) {
        dist = this._v.length();
        // applyMatrix4 performs the perspective divide for us
        this._v.applyMatrix4(camera.projectionMatrix);
        sx = (this._v.x * 0.5 + 0.5) * w;
        sy = (-this._v.y * 0.5 + 0.5) * h;
        if (sx < -40 || sx > w + 40 || sy < -20 || sy > h + 20) ok = false;
      }
      if (!ok) {
        if (item.shown) { item.el.style.opacity = '0'; item.shown = false; }
        continue;
      }
      placed.push({ id, item, sx, sy, dist });
    }

    placed.sort((a, b) => {
      if (a.id === this.selectedId) return -1;
      if (b.id === this.selectedId) return 1;
      const r = (a.item.def.labelRank ?? 3) - (b.item.def.labelRank ?? 3);
      return r !== 0 ? r : a.dist - b.dist;
    });

    const shownNow = new Set();
    for (const p of placed) {
      const key = `${Math.round(p.sx / CELL_W)}:${Math.round(p.sy / CELL_H)}`;
      if (cells.has(key) && p.id !== this.selectedId) continue;
      cells.add(key);
      shownNow.add(p.id);
      const el = p.item.el;
      el.style.transform = `translate(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px)`;
      el.style.opacity = '1';
      el.classList.toggle('selected', p.id === this.selectedId);
      p.item.shown = true;

      if (p.id === this.selectedId) {
        // accent ring sized to the projected disc
        const radius = getRadius(p.id);
        const ang = Math.atan2(radius, p.dist);
        const px = Math.max(30, (ang / ((camera.fov * Math.PI) / 180)) * h * 2.05);
        this.ring.style.transform = `translate(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px) translate(-50%, -50%)`;
        this.ring.style.width = this.ring.style.height = `${px.toFixed(0)}px`;
        this.ring.style.opacity = '1';
      }
    }
    for (const [id, item] of this.items) {
      if (item.shown && !shownNow.has(id)) { item.el.style.opacity = '0'; item.shown = false; }
    }
    if (!this.selectedId || !shownNow.has(this.selectedId)) this.ring.style.opacity = '0';
  }

  setAccent(color) {
    this.ring.style.borderColor = color;
    this.ring.style.boxShadow = `0 0 18px 0 ${color}55, inset 0 0 12px 0 ${color}33`;
  }
}
