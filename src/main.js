import './styles/base.css';
import * as THREE from 'three';
import { AU_KM, clamp, daysSinceJ2000 } from './consts.js';
import { BODIES, CATALOG, childrenOf } from './data/bodies.js';
import { MISSIONS, MissionSet } from './data/missions.js';
import { Ephemeris } from './sim/ephemeris.js';
import { elementsToPosition } from './sim/kepler.js';
import { SimClock } from './sim/time.js';
import { ScaleManager } from './render/scale.js';
import { createStage } from './core/scene.js';
import { CameraRig } from './core/camera.js';
import { BodyRenderer } from './render/bodies.js';
import { Starfield } from './render/starfield.js';
import { Belts } from './render/belts.js';
import { OrbitLines } from './render/orbits.js';
import { Labels } from './render/labels.js';
import { buildChrome } from './ui/chrome.js';
import { Timeline } from './ui/timeline.js';
import { Search } from './ui/search.js';
import { Panel } from './ui/panel.js';
import { setAccent } from './ui/theme.js';
import { getContent } from './data/content/index.js';

// ── Simulation ──────────────────────────────────────────────────────────
const clock = new SimClock();
const eph = new Ephemeris(CATALOG);
const missions = new MissionSet(eph);
const scale = new ScaleManager();

const MISSION_DEFS = new Map(MISSIONS.map((m) => [m.id, m]));
const ALL_TARGETS = [
  ...BODIES,
  ...MISSIONS.map((m) => ({ ...m, labelRank: 3, radiusKm: 0 })),
];
const defOf = (id) => CATALOG.get(id) ?? MISSION_DEFS.get(id);

// largest moon orbit per parent, for label/orbit context rules — capped so
// far-flung irregulars (Phoebe, Nereid) don't make a system's moon labels
// pop in from across the solar system
const EXTENT_CAP_KM = 2e6;
const systemExtentKm = new Map();
for (const b of BODIES) {
  if (b.type === 'moon' && b.moonDistKm) {
    const d = Math.min(b.moonDistKm, EXTENT_CAP_KM);
    systemExtentKm.set(b.parent, Math.max(systemExtentKm.get(b.parent) ?? 0, d));
  }
}

// ── Stage ───────────────────────────────────────────────────────────────
const stage = createStage(document.getElementById('gl'));
const rig = new CameraRig(stage.camera, stage.renderer.domElement);
const bodies = new BodyRenderer(stage.scene, BODIES);
const starfield = new Starfield(stage.scene);
const belts = new Belts(stage.scene);
const orbits = new OrbitLines(stage.scene, eph, BODIES, missions, clock.ms);

// ── World position bookkeeping (scene units, heliocentric, JS doubles) ──
const world = new Map(ALL_TARGETS.map((t) => [t.id, new THREE.Vector3()]));
const helioAU = new Map();
const hidden = new Set(); // unlaunched missions
const tmpA = { x: 0, y: 0, z: 0 };
const tmpV = new THREE.Vector3();

// Orbital-velocity direction per comet (scene space), for the dust-tail lag.
// Computed from the elements directly so the ephemeris frame cache stays hot.
const COMETS = BODIES.filter((b) => b.type === 'comet');
const cometVel = new Map(COMETS.map((c) => [c.id, new THREE.Vector3()]));
const velA = new THREE.Vector3();
const velB = new THREE.Vector3();

function computeCometVelocities(ms) {
  for (const def of COMETS) {
    scale.mapHelio(elementsToPosition(def.elements, ms), velA);
    scale.mapHelio(elementsToPosition(def.elements, ms + 36e5), velB);
    const v = cometVel.get(def.id);
    v.copy(velB).sub(velA);
    if (v.lengthSq() > 1e-18) v.normalize();
  }
}

function computePositions(ms) {
  hidden.clear();
  for (const def of BODIES) {
    const au = eph.helio(def.id, ms);
    helioAU.set(def.id, au);
    const w = world.get(def.id);
    if (!def.parent || def.parent === 'sun') {
      scale.mapHelio(au, w);
    } else {
      const pAU = helioAU.get(def.parent);
      tmpA.x = au.x - pAU.x; tmpA.y = au.y - pAU.y; tmpA.z = au.z - pAU.z;
      scale.mapMoonOffset(tmpA, tmpV);
      w.copy(world.get(def.parent)).add(tmpV);
    }
  }
  for (const m of MISSIONS) {
    const p = missions.position(m.id, ms);
    if (!p) {
      hidden.add(m.id);
      continue;
    }
    scale.mapHelio(p, world.get(m.id));
  }
}

function bodyRadiusUnits(id) {
  const def = CATALOG.get(id);
  if (!def) return 0.02; // spacecraft: nominal framing size
  return scale.radius(def.radiusKm);
}

const getBodyForRig = (id) => ({ pos: world.get(id), radius: bodyRadiusUnits(id) });

// ── Selection ───────────────────────────────────────────────────────────
const ui = document.getElementById('ui');
let selectedId = null;

const panel = new Panel(ui, {
  onSelect: (id) => select(id),
  onClose: () => deselect(),
  getSimMs: () => clock.ms,
  onJumpToDate: (ms) => clock.set(ms),
});

function select(id) {
  const def = defOf(id);
  if (!def || hidden.has(id)) return;
  selectedId = id;
  setAccent(def.accent);
  orbits.setSelection(id);
  orbits.setFocusParent(def.type === 'moon' ? def.parent : childrenOf(id).length ? id : null);
  labels.setSelection(id);
  labels.setAccent(def.accent.glow);
  // comets are framed from far outside their coma so the tails read as a
  // vista; everything else gets the close three-quarter portrait
  rig.flyTo(id, getBodyForRig, def.type === 'comet' ? 700 : 4.6, def.type === 'comet');

  const parentDef = def.parent && def.parent !== 'sun' ? CATALOG.get(def.parent) : null;
  const moons = childrenOf(id).map((m) => ({ id: m.id, name: m.name, radiusKm: m.radiusKm }));
  panel.open(def, getContent(id, def), { parentDef, moons });
}

function deselect() {
  selectedId = null;
  setAccent(null);
  orbits.setSelection(null);
  orbits.setFocusParent(null);
  labels.setSelection(null);
  panel.close();
  rig.releaseFocus();
}

// ── Labels ──────────────────────────────────────────────────────────────
const labels = new Labels(document.getElementById('labels'), ALL_TARGETS, select);

function isMoonShown(def) {
  if (orbits.focusParent === def.parent) return true;
  const extentKm = systemExtentKm.get(def.parent);
  if (!extentKm) return false;
  const parentW = world.get(def.parent);
  return rig.pos.distanceTo(parentW) < scale.moonDistance(extentKm) * 14;
}

// ── UI chrome ───────────────────────────────────────────────────────────
const settings = { labels: true, orbits: true, constellations: false, scaleMode: 'compressed' };
buildChrome(ui, {
  settings,
  onToggle: (k, v) => {
    if (k === 'labels') labels.setVisible(v);
    if (k === 'orbits') orbits.setShowOrbits(v);
    if (k === 'constellations') starfield.setConstellationsVisible(v);
  },
  onScaleMode: (mode) => scale.setMode(mode),
  onSearchOpen: () => search.open(),
});
new Timeline(ui, clock);

const search = new Search(
  ui,
  ALL_TARGETS.map((t) => ({ id: t.id, name: t.name, type: t.type, aliases: t.aliases, accent: t.accent })),
  select
);

window.addEventListener('keydown', (e) => {
  const typing = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
  if (e.code === 'Space' && !typing && !search.isOpen) {
    e.preventDefault();
    search.open();
  } else if (e.key === 'Escape' && !search.isOpen) {
    deselect();
  } else if (e.code === 'KeyR' && !typing && !search.isOpen) {
    // recenter: re-frame the focused body, or fly home when free
    if (rig.focusId) {
      const isComet = defOf(rig.focusId)?.type === 'comet';
      rig.flyTo(rig.focusId, getBodyForRig, isComet ? 700 : 4.6, isComet);
    } else {
      rig.recenterHome();
    }
  }
});

// ── Picking (mesh raycast for close bodies; labels handle the far field) ─
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
stage.renderer.domElement.addEventListener('click', (e) => {
  if (rig.consumeClickIsDrag()) return;
  pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, stage.camera);
  const hits = raycaster.intersectObjects(bodies.pickMeshes(), false);
  if (hits.length) select(hits[0].object.userData.bodyId);
});

// ── Frame loop ──────────────────────────────────────────────────────────
const sunWorld = new THREE.Vector3(0, 0, 0); // heliocentric frame: sun is the origin
let lastT = performance.now();

function frame(now) {
  const dt = clamp((now - lastT) / 1000, 0, 0.1);
  lastT = now;

  clock.tick(dt);
  scale.tick(now);
  computePositions(clock.ms);
  computeCometVelocities(clock.ms);

  rig.update(dt, getBodyForRig);
  const camPos = rig.pos;

  for (const def of BODIES) {
    bodies.update(
      def.id, world.get(def.id), camPos, scale.radius(def.radiusKm),
      clock.ms, sunWorld, cometVel.get(def.id) ?? null
    );
  }
  orbits.update(camPos, scale, (pid) => world.get(pid));
  belts.update(camPos, daysSinceJ2000(clock.ms), scale.s);
  stage.sunLight.position.copy(sunWorld).sub(camPos);

  labels.update(
    stage.camera,
    camPos,
    (id) => (hidden.has(id) ? null : world.get(id)),
    bodyRadiusUnits,
    isMoonShown
  );

  stage.composer.render();
  requestAnimationFrame(frame);
}

// ── Boot ────────────────────────────────────────────────────────────────
starfield.ready.finally(() => {
  document.querySelector('#loading .loading-status').textContent = 'Entering the solar system…';
  setTimeout(() => document.getElementById('loading').classList.add('done'), 400);
});
requestAnimationFrame(frame);
