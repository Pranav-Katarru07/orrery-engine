import * as THREE from 'three';
import { OBLIQUITY_J2000, DEG } from '../consts.js';

const R = 190000; // background sphere radius, safely inside the far plane

// equatorial J2000 (deg) → ecliptic unit vector
function raDecToEcl(raDeg, decDeg) {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  const x = Math.cos(dec) * Math.cos(ra);
  const yq = Math.cos(dec) * Math.sin(ra);
  const zq = Math.sin(dec);
  const ce = Math.cos(OBLIQUITY_J2000), se = Math.sin(OBLIQUITY_J2000);
  return { x, y: ce * yq + se * zq, z: -se * yq + ce * zq };
}

// B−V color index → approximate RGB
function bvToColor(bv) {
  bv = Math.max(-0.4, Math.min(2.0, bv));
  let r, g, b;
  if (bv < 0.4) { r = 0.62 + 0.6 * (bv + 0.4) / 0.8; g = 0.72 + 0.3 * (bv + 0.4) / 0.8; b = 1.0; }
  else if (bv < 1.5) { r = 1.0; g = 1.02 - 0.36 * (bv - 0.4) / 1.1; b = 1.0 - 0.7 * (bv - 0.4) / 1.1; }
  else { r = 1.0; g = 0.66 - 0.2 * (bv - 1.5); b = 0.3 - 0.2 * (bv - 1.5); }
  return { r: Math.min(1, r), g: Math.max(0, Math.min(1, g)), b: Math.max(0, Math.min(1, b)) };
}

const starVert = /* glsl */ `
  attribute float size;
  attribute vec3 tint;
  attribute float alpha;
  varying vec3 vTint;
  varying float vAlpha;
  void main() {
    vTint = tint;
    vAlpha = alpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size;
  }
`;
const starFrag = /* glsl */ `
  varying vec3 vTint;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float glow = pow(max(0.0, 1.0 - d), 2.2);
    gl_FragColor = vec4(vTint * glow, glow * vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class Starfield {
  constructor(scene) {
    // Camera-relative rendering keeps this group at the origin: an
    // infinitely-distant, parallax-free sky.
    this.group = new THREE.Group();
    scene.add(this.group);
    this.linesGroup = new THREE.Group();
    this.linesGroup.visible = false;
    this.group.add(this.linesGroup);
    this.ready = this._load();
  }

  async _load() {
    const [stars, lines, names] = await Promise.all([
      fetch('/data/stars.json').then((r) => r.json()),
      fetch('/data/constellation_lines.json').then((r) => r.json()),
      fetch('/data/constellation_names.json').then((r) => r.json()),
    ]);
    this._buildStars(stars);
    this._buildLines(lines);
    this._buildNames(names);
    this._buildMilkyWay();
  }

  _buildStars(geojson) {
    const feats = geojson.features;
    const n = feats.length;
    const pos = new Float32Array(n * 3);
    const tint = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const alpha = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const f = feats[i];
      const [ra, dec] = f.geometry.coordinates;
      const v = raDecToEcl(ra < 0 ? ra + 360 : ra, dec);
      pos[i * 3] = v.x * R; pos[i * 3 + 1] = v.y * R; pos[i * 3 + 2] = v.z * R;
      const mag = f.properties.mag ?? 6;
      const bv = parseFloat(f.properties.bv) || 0.6;
      const c = bvToColor(bv);
      tint[i * 3] = c.r; tint[i * 3 + 1] = c.g; tint[i * 3 + 2] = c.b;
      size[i] = Math.max(1.6, 9.5 * Math.pow(10, -0.11 * mag));
      alpha[i] = Math.max(0.18, Math.min(1, 1.35 - mag * 0.16));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('tint', new THREE.BufferAttribute(tint, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.group.add(new THREE.Points(geo, mat));
  }

  _buildLines(geojson) {
    const verts = [];
    for (const f of geojson.features) {
      for (const line of f.geometry.coordinates) {
        for (let i = 0; i < line.length - 1; i++) {
          for (const [ra, dec] of [line[i], line[i + 1]]) {
            const v = raDecToEcl(ra < 0 ? ra + 360 : ra, dec);
            verts.push(v.x * R * 0.998, v.y * R * 0.998, v.z * R * 0.998);
          }
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x91a7c4,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    this.linesGroup.add(new THREE.LineSegments(geo, mat));
  }

  _buildNames(geojson) {
    for (const f of geojson.features) {
      const name = f.properties.en || f.properties.name;
      const [ra, dec] = f.geometry.coordinates;
      const v = raDecToEcl(ra < 0 ? ra + 360 : ra, dec);
      const c = document.createElement('canvas');
      c.width = 512; c.height = 96;
      const g = c.getContext('2d');
      g.font = '500 44px Inter, system-ui, sans-serif';
      g.textAlign = 'center';
      g.fillStyle = 'rgba(160,180,208,0.8)';
      g.fillText(name.toUpperCase(), 256, 62);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.62, depthWrite: false })
      );
      sp.position.set(v.x * R * 0.99, v.y * R * 0.99, v.z * R * 0.99);
      sp.scale.set(17000, 3200, 1);
      this.linesGroup.add(sp);
    }
  }

  _buildMilkyWay() {
    const tex = new THREE.TextureLoader().load('/textures/milky_way.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.04, 48, 24),
      new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
      })
    );
    // Orient the panorama's equator to the galactic plane
    // (galactic north pole: RA 192.86°, Dec +27.13°)
    const gp = raDecToEcl(192.86, 27.13);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(gp.x, gp.y, gp.z)
    );
    sphere.quaternion.copy(q);
    sphere.renderOrder = -10;
    this.group.add(sphere);
  }

  setConstellationsVisible(v) {
    this.linesGroup.visible = v;
  }
}
