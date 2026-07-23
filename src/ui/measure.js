import * as THREE from 'three';
import { AU_KM } from '../consts.js';

const LIGHT_KM_S = 299792.458;

// Measure tool: arm it (M key / toolbar ruler), click two bodies, get a
// dashed line with a live readout — distance in km + AU and light-travel
// time. The readout comes from the ephemeris (true heliocentric AU), NOT
// from scene positions: compressed scale mode distorts the scene, but a
// measurement should never lie. The line itself is drawn between the scene
// positions so it tracks whatever the eye actually sees.
export class Measure {
  constructor(scene, container) {
    this.armed = false;
    this.a = null; // { id, name }
    this.b = null;
    this.onChange = null; // callback(armed) for the toolbar button state

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    this.line = new THREE.Line(
      geom,
      new THREE.LineDashedMaterial({
        color: 0xa8d8ff, transparent: true, opacity: 0.85,
        dashSize: 1, gapSize: 0.6, depthTest: false,
      })
    );
    this.line.renderOrder = 5;
    this.line.frustumCulled = false;
    this.line.visible = false;
    scene.add(this.line);

    this.tag = document.createElement('div');
    this.tag.className = 'measure-tag glass';
    this.tag.style.opacity = '0';
    container.appendChild(this.tag);

    this.hint = document.createElement('div');
    this.hint.className = 'measure-hint glass';
    this.hint.style.opacity = '0';
    container.appendChild(this.hint);

    this._v = new THREE.Vector3();
  }

  toggle() {
    if (this.armed) this.disarm();
    else {
      this.armed = true;
      this._setHint('Measure — click the first body');
      this.onChange?.(true);
    }
  }

  disarm() {
    this.armed = false;
    this.a = this.b = null;
    this.line.visible = false;
    this.tag.style.opacity = '0';
    this.hint.style.opacity = '0';
    this.onChange?.(false);
  }

  // Returns true when the click was consumed by the tool.
  pick(id, name) {
    if (!this.armed) return false;
    if (!this.a || this.b) {
      // first pick, or starting a fresh measurement over a finished one
      this.a = { id, name };
      this.b = null;
      this.line.visible = false;
      this.tag.style.opacity = '0';
      this._setHint(`${name} → click the second body`);
    } else if (id !== this.a.id) {
      this.b = { id, name };
      this.hint.style.opacity = '0';
    }
    return true;
  }

  _setHint(text) {
    this.hint.textContent = text;
    this.hint.style.opacity = '1';
  }

  // Frame update. getWorld(id) → scene-space Vector3 | undefined,
  // getAU(id) → true heliocentric {x,y,z} in AU | null (hidden missions).
  update(camPos, getWorld, getAU, camera) {
    if (!this.a || !this.b) return;
    const wa = getWorld(this.a.id), wb = getWorld(this.b.id);
    const pa = getAU(this.a.id), pb = getAU(this.b.id);
    if (!wa || !wb || !pa || !pb) {
      this.line.visible = false;
      this.tag.style.opacity = '0';
      return;
    }

    // line between the scene positions, camera-relative
    const pos = this.line.geometry.attributes.position;
    pos.setXYZ(0, wa.x - camPos.x, wa.y - camPos.y, wa.z - camPos.z);
    pos.setXYZ(1, wb.x - camPos.x, wb.y - camPos.y, wb.z - camPos.z);
    pos.needsUpdate = true;
    this.line.computeLineDistances();
    const span = this._v.set(wb.x - wa.x, wb.y - wa.y, wb.z - wa.z).length();
    this.line.material.dashSize = span / 60;
    this.line.material.gapSize = span / 100;
    this.line.visible = true;

    // readout from the ephemeris
    const au = Math.hypot(pa.x - pb.x, pa.y - pb.y, pa.z - pb.z);
    const km = au * AU_KM;
    this.tag.innerHTML =
      `<span class="m-names">${this.a.name} ↔ ${this.b.name}</span>` +
      `<span class="m-val">${fmtKm(km)}</span>` +
      `<span class="m-sub">${au.toFixed(au < 0.1 ? 5 : 3)} AU · light: ${fmtLight(km / LIGHT_KM_S)}</span>`;

    // pin the readout to the projected midpoint
    this._v.set((wa.x + wb.x) / 2 - camPos.x, (wa.y + wb.y) / 2 - camPos.y, (wa.z + wb.z) / 2 - camPos.z)
      .applyQuaternion(camera.quaternion.clone().invert());
    if (this._v.z > -1e-6) {
      this.tag.style.opacity = '0'; // midpoint behind the camera
      return;
    }
    this._v.applyMatrix4(camera.projectionMatrix);
    const sx = (this._v.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-this._v.y * 0.5 + 0.5) * window.innerHeight;
    this.tag.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -120%)`;
    this.tag.style.opacity = '1';
  }
}

function fmtKm(km) {
  if (km >= 1e9) return `${(km / 1e9).toFixed(2)} billion km`;
  if (km >= 1e6) return `${(km / 1e6).toFixed(1)} million km`;
  return `${Math.round(km).toLocaleString('en-US')} km`;
}

function fmtLight(s) {
  if (s < 120) return `${s.toFixed(1)} s`;
  if (s < 7200) return `${(s / 60).toFixed(1)} min`;
  return `${(s / 3600).toFixed(2)} hr`;
}
