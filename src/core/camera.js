import * as THREE from 'three';
import { clamp, easeInOutQuint } from '../consts.js';

const UP = new THREE.Vector3(0, 0, 1); // ecliptic north
const HOME_POS = new THREE.Vector3(0, -1200, 520); // default wide system view

// Camera rig with three modes:
//   free    — WASD/QE + drag-look free flight, speed scales with altitude
//   transit — cinematic eased flight toward a body (1.5–2.5s), then focus
//   focus   — orbit the target; the offset is stored as zoom × body radius,
//             so scale-mode morphs keep the framing automatically
export class CameraRig {
  constructor(camera, dom) {
    this.camera = camera;
    this.pos = HOME_POS.clone(); // virtual world position (units)
    this.quat = new THREE.Quaternion();
    this.mode = 'free';

    this.focusId = null;
    this.zoom = 5; // offset length in body radii
    this.orbitDir = new THREE.Vector3(0, -1, 0.35).normalize();

    this._transit = null;
    this._keys = new Set();
    this._dragging = false;
    this._lastPointer = { x: 0, y: 0 };
    this._pan = null; // active shift-drag: { world, normal }
    this._getBody = null; // last getBody fn, stashed by update()
    this.getPanAnchor = null; // injected: (ndcX, ndcY) → GL-space point | null
    this.onModeChange = null; // callback(mode, focusId)

    this._lookAtWorld(new THREE.Vector3(0, 0, 0));
    this._bind(dom);
  }

  _bind(dom) {
    dom.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      this._dragging = true;
      this._dragMoved = 0;
      this._lastPointer = { x: e.clientX, y: e.clientY };
      dom.setPointerCapture(e.pointerId);
      // shift+drag = CAD-style pan; the gesture latches here, so letting
      // go of shift mid-drag keeps panning until the button lifts
      if (e.shiftKey && (this.mode === 'free' || this.mode === 'focus')) this._startPan(e);
    });
    dom.addEventListener('pointermove', (e) => {
      if (!this._dragging) return;
      const dx = e.clientX - this._lastPointer.x;
      const dy = e.clientY - this._lastPointer.y;
      this._lastPointer = { x: e.clientX, y: e.clientY };
      this._dragMoved += Math.abs(dx) + Math.abs(dy);
      if (this._pan) this._panMove(e);
      else if (this.mode === 'focus') this._orbitBy(dx, dy);
      else if (this.mode === 'free') this._lookBy(dx, dy);
    });
    dom.addEventListener('pointerup', () => {
      this._dragging = false;
      this._pan = null;
    });
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      const k = Math.exp(e.deltaY * 0.0012);
      if (this.mode === 'focus') {
        this.zoom = clamp(this.zoom * k, 1.6, 50000);
      } else if (this.mode === 'free') {
        // dolly along view direction, altitude-proportional
        const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.quat);
        const step = this._freeSpeed() * -e.deltaY * 0.0025;
        this.pos.addScaledVector(fwd, step);
      }
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      this._keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this._keys.delete(e.code));
    window.addEventListener('blur', () => this._keys.clear());
  }

  // True while a click-drag has moved enough to count as camera movement,
  // letting the picker distinguish orbit-drags from selection clicks.
  consumeClickIsDrag() {
    return this._dragMoved > 6;
  }

  _orbitBy(dx, dy) {
    const yaw = new THREE.Quaternion().setFromAxisAngle(UP, -dx * 0.005);
    this.orbitDir.applyQuaternion(yaw);
    // pitch around the horizontal axis perpendicular to view
    const right = new THREE.Vector3().crossVectors(this.orbitDir, UP).normalize();
    const pitch = new THREE.Quaternion().setFromAxisAngle(right, -dy * 0.005);
    const next = this.orbitDir.clone().applyQuaternion(pitch);
    if (Math.abs(next.dot(UP)) < 0.985) this.orbitDir.copy(next).normalize();
  }

  _lookBy(dx, dy) {
    const yaw = new THREE.Quaternion().setFromAxisAngle(UP, -dx * 0.0028);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat);
    const pitch = new THREE.Quaternion().setFromAxisAngle(right, -dy * 0.0028);
    this.quat.premultiply(yaw).premultiply(pitch).normalize();
  }

  _ndc(e) {
    return {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  }

  // Cursor ray direction in GL space. The GL camera sits at the origin
  // (camera-relative rendering), so unprojecting yields the direction.
  _rayDir(ndc) {
    return new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(this.camera).normalize();
  }

  // Onshape-style pan: grab the 3D point under the cursor and keep it glued
  // to the cursor for the whole drag. Anchors on a body surface when the
  // cursor is over one, else on the view ray at a plausible depth.
  _startPan(e) {
    const ndc = this._ndc(e);
    let anchor = this.getPanAnchor ? this.getPanAnchor(ndc.x, ndc.y) : null;
    if (!anchor) {
      let depth;
      const b = this.mode === 'focus' && this._getBody ? this._getBody(this.focusId) : null;
      if (b) depth = this.zoom * b.radius;
      else depth = Math.max(this.pos.length() * 0.4, 1);
      anchor = this._rayDir(ndc).multiplyScalar(depth);
    }
    const normal = new THREE.Vector3(0, 0, -1).applyQuaternion(this.quat);
    // focus recomputes pos from the body every frame, so a pan has to break
    // the follow — same feel as Onshape, and R / re-select restores framing
    if (this.mode === 'focus') this.releaseFocus();
    this._pan = { world: anchor.add(this.pos), normal };
  }

  _panMove(e) {
    const dir = this._rayDir(this._ndc(e));
    const { world, normal } = this._pan;
    // re-derive the anchor from its world point each move: pinning stays
    // exact over the whole gesture instead of accumulating drift
    const anchorGL = world.clone().sub(this.pos);
    const denom = dir.dot(normal);
    if (Math.abs(denom) < 1e-6) return;
    const t = anchorGL.dot(normal) / denom;
    if (t <= 0) return;
    this.pos.add(anchorGL.sub(dir.multiplyScalar(t)));
  }

  _freeSpeed() {
    return Math.max(0.5, this.pos.length() * 0.5);
  }

  _lookAtWorld(target) {
    const m = new THREE.Matrix4().lookAt(this.pos, target, UP);
    this.quat.setFromRotationMatrix(m);
  }

  // Fly to a body. getBody(id) → {pos: Vector3 world units, radius: units}
  // frameZoom: arrival distance in body radii (comets need room — their
  // coma and tails engulf the default close framing).
  // sideOn: approach perpendicular to the sun line instead of sunward, so
  // a comet's tails stream across the frame rather than backlighting it.
  flyTo(id, getBody, frameZoom = 4.6, sideOn = false) {
    const b = getBody(id);
    const toCam = this.pos.clone().sub(b.pos);
    if (toCam.lengthSq() < 1e-12) toCam.set(0, -1, 0.2);
    toCam.normalize();
    const sunward = b.pos.clone().multiplyScalar(-1).normalize(); // body → sun
    if (sideOn) {
      const side = new THREE.Vector3().crossVectors(sunward, UP).normalize();
      if (side.dot(toCam) < 0) side.negate(); // arrive on the nearer flank
      this.orbitDir = side;
      this.orbitDir.z += 0.3;
    } else {
      // nudged sunward and lifted a bit so arrivals frame a lit
      // three-quarter view instead of the night side
      this.orbitDir = toCam.multiplyScalar(0.72).addScaledVector(sunward, 0.42);
      this.orbitDir.z += 0.22;
    }
    this.orbitDir.normalize();

    this.zoom = frameZoom;
    const endPos = b.pos.clone().addScaledVector(this.orbitDir, this.zoom * b.radius);
    const dist = endPos.distanceTo(this.pos);
    const dur = clamp(1.5 + dist / 1500, 1.5, 2.5);

    this._transit = {
      id,
      t0: performance.now(),
      dur: dur * 1000,
      fromPos: this.pos.clone(),
      fromQuat: this.quat.clone(),
    };
    this.mode = 'transit';
    this.focusId = id;
    this.onModeChange?.(this.mode, id);
  }

  releaseFocus() {
    if (this.mode === 'free') return;
    this.mode = 'free';
    this.focusId = null;
    this._transit = null;
    this.onModeChange?.(this.mode, null);
  }

  // Cinematic flight back to the default wide system view (free mode).
  recenterHome() {
    const dist = HOME_POS.distanceTo(this.pos);
    if (dist < 1) return; // already home
    this._transit = {
      home: true,
      t0: performance.now(),
      dur: clamp(1.5 + dist / 1500, 1.5, 2.5) * 1000,
      fromPos: this.pos.clone(),
      fromQuat: this.quat.clone(),
    };
    this.mode = 'transit-home';
    this.focusId = null;
    this.onModeChange?.(this.mode, null);
  }

  update(dt, getBody) {
    this._getBody = getBody;
    if (this.mode === 'transit') this._updateTransit(getBody);
    else if (this.mode === 'transit-home') this._updateTransitHome();
    else if (this.mode === 'focus') this._updateFocus(getBody);
    else this._updateFree(dt);
    this.camera.quaternion.copy(this.quat);
  }

  _updateTransitHome() {
    const tr = this._transit;
    const t = clamp((performance.now() - tr.t0) / tr.dur, 0, 1);
    const e = easeInOutQuint(t);
    this.pos.lerpVectors(tr.fromPos, HOME_POS, e);

    // gaze settles on the Sun ahead of arrival
    const gaze = clamp(t * 1.7, 0, 1);
    const m = new THREE.Matrix4().lookAt(this.pos, new THREE.Vector3(0, 0, 0), UP);
    const want = new THREE.Quaternion().setFromRotationMatrix(m);
    this.quat.slerpQuaternions(tr.fromQuat, want, easeInOutQuint(gaze));

    if (t >= 1) {
      this.mode = 'free';
      this._transit = null;
      this.onModeChange?.(this.mode, null);
    }
  }

  _updateTransit(getBody) {
    const tr = this._transit;
    const b = getBody(tr.id);
    const t = clamp((performance.now() - tr.t0) / tr.dur, 0, 1);
    const e = easeInOutQuint(t);

    const endPos = b.pos.clone().addScaledVector(this.orbitDir, this.zoom * b.radius);
    this.pos.lerpVectors(tr.fromPos, endPos, e);

    // gaze locks onto the destination ahead of arrival
    const gaze = clamp(t * 1.7, 0, 1);
    const m = new THREE.Matrix4().lookAt(this.pos, b.pos, UP);
    const want = new THREE.Quaternion().setFromRotationMatrix(m);
    this.quat.slerpQuaternions(tr.fromQuat, want, easeInOutQuint(gaze));

    if (t >= 1) {
      this.mode = 'focus';
      this._transit = null;
      this.onModeChange?.(this.mode, tr.id);
    }
  }

  _updateFocus(getBody) {
    const b = getBody(this.focusId);
    this.pos.copy(b.pos).addScaledVector(this.orbitDir, this.zoom * b.radius);
    this._lookAtWorld(b.pos);
  }

  _updateFree(dt) {
    const speed = this._freeSpeed() * (this._keys.has('ShiftLeft') || this._keys.has('ShiftRight') ? 4 : 1);
    const move = new THREE.Vector3();
    if (this._keys.has('KeyW') || this._keys.has('ArrowUp')) move.z -= 1;
    if (this._keys.has('KeyS') || this._keys.has('ArrowDown')) move.z += 1;
    if (this._keys.has('KeyA') || this._keys.has('ArrowLeft')) move.x -= 1;
    if (this._keys.has('KeyD') || this._keys.has('ArrowRight')) move.x += 1;
    if (this._keys.has('KeyQ')) move.y -= 1;
    if (this._keys.has('KeyE')) move.y += 1;
    if (move.lengthSq() > 0) {
      move.normalize().applyQuaternion(this.quat);
      this.pos.addScaledVector(move, speed * dt);
    }
  }
}
