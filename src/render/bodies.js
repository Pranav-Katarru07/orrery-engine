import * as THREE from 'three';
import { equatorialBasis, poleToEcliptic } from '../sim/ephemeris.js';
import { daysSinceJ2000 } from '../consts.js';

const texLoader = new THREE.TextureLoader();

function loadTex(name) {
  const t = texLoader.load(`/textures/${name}`);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Radial gradient sprite texture (sun glow, comet comas)
function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.25, inner.replace(/[\d.]+\)$/, '0.5)'));
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Procedural ring texture: soft radial bands
function proceduralRingTexture(colorHex, opacity) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 4;
  const g = c.getContext('2d');
  const col = new THREE.Color(colorHex);
  for (let x = 0; x < 512; x++) {
    const u = x / 511;
    // banded noise, fading at both edges
    const band =
      0.55 + 0.45 * Math.sin(u * 40 + Math.sin(u * 13) * 3) * Math.sin(u * 91);
    const edge = Math.sin(Math.PI * u) ** 0.6;
    const a = Math.max(0, band * edge) * opacity * 255;
    g.fillStyle = `rgba(${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0},${a / 255})`;
    g.fillRect(x, 0, 1, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vPosW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const earthFrag = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    float ndl = dot(normalize(vNormalW), normalize(sunDir));
    float dayAmt = smoothstep(-0.12, 0.28, ndl);
    vec3 day = texture2D(dayMap, vUv).rgb * (0.12 + 1.15 * max(ndl, 0.0));
    // warm the terminator band slightly — sunrise/sunset tint
    float term = smoothstep(-0.12, 0.12, ndl) * (1.0 - smoothstep(0.12, 0.42, ndl));
    day += vec3(0.35, 0.16, 0.04) * term * texture2D(dayMap, vUv).rgb * 2.0;
    vec3 night = texture2D(nightMap, vUv).rgb * vec3(1.0, 0.82, 0.55) * 1.6;
    vec3 col = mix(night, day, dayAmt);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const atmoVert = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vPosW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// Rendered on the BackSide of an inflated shell: fresnel limb glow that also
// respects the day side (glow strongest on the sunlit limb).
const atmoFrag = /* glsl */ `
  uniform vec3 glowColor;
  uniform float intensity;
  uniform vec3 sunDir;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float rim = pow(1.0 - abs(dot(viewDir, normalize(vNormalW))), 2.6);
    float lit = 0.25 + 0.75 * smoothstep(-0.4, 0.5, dot(normalize(vNormalW), normalize(sunDir)));
    vec3 col = glowColor * rim * lit * intensity * 1.6;
    gl_FragColor = vec4(col, rim * lit * intensity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class BodyRenderer {
  constructor(scene, catalogBodies) {
    this.scene = scene;
    this.entries = new Map(); // id → entry
    this.sunDir = new THREE.Vector3(0, 0, 1);
    this._sphere = new THREE.SphereGeometry(1, 64, 32);
    for (const def of catalogBodies) this._build(def);
  }

  _build(def) {
    const group = new THREE.Group();
    group.userData.bodyId = def.id;

    const basis = equatorialBasis(poleToEcliptic(def.pole.ra, def.pole.dec));
    // Column basis: mesh local +Y is the body's rotation pole
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(basis.X.x, basis.X.y, basis.X.z),
      new THREE.Vector3(basis.Z.x, basis.Z.y, basis.Z.z),
      new THREE.Vector3(-basis.Y.x, -basis.Y.y, -basis.Y.z)
    );
    const qAlign = new THREE.Quaternion().setFromRotationMatrix(m);

    let material;
    let uniforms = null;
    if (def.id === 'earth') {
      uniforms = {
        dayMap: { value: loadTex(def.texture) },
        nightMap: { value: loadTex(def.nightTexture) },
        sunDir: { value: this.sunDir },
      };
      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: earthVert,
        fragmentShader: earthFrag,
      });
    } else if (def.emissive) {
      material = new THREE.MeshBasicMaterial({ map: loadTex(def.texture) });
    } else if (def.texture) {
      material = new THREE.MeshStandardMaterial({
        map: loadTex(def.texture),
        roughness: 0.95,
        metalness: 0,
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(def.accent.glow).multiplyScalar(0.75),
        roughness: 0.95,
        metalness: 0,
      });
    }

    const mesh = new THREE.Mesh(this._sphere, material);
    mesh.userData.bodyId = def.id;
    group.add(mesh);

    let clouds = null;
    if (def.cloudTexture || (def.id === 'venus' && def.surfaceTexture)) {
      // Venus: surface below, atmosphere texture as the driven cloud deck
      if (def.id === 'venus') {
        mesh.material.map = loadTex(def.surfaceTexture);
        mesh.material.needsUpdate = true;
      }
      const cloudTex = loadTex(def.cloudTexture || def.texture);
      const isVenus = def.id === 'venus';
      clouds = new THREE.Mesh(
        this._sphere,
        new THREE.MeshStandardMaterial({
          map: cloudTex,
          // Earth's cloud map is white-on-black → luminance works as alpha;
          // Venus's deck is opaque, no cutout wanted
          alphaMap: isVenus ? null : cloudTex,
          transparent: !isVenus,
          opacity: isVenus ? 1.0 : 0.85,
          depthWrite: isVenus,
          roughness: 1,
        })
      );
      clouds.scale.setScalar(1.008);
      clouds.userData.bodyId = def.id;
      group.add(clouds);
    }

    let atmo = null;
    if (def.atmosphere) {
      atmo = new THREE.Mesh(
        this._sphere,
        new THREE.ShaderMaterial({
          uniforms: {
            glowColor: { value: new THREE.Color(def.atmosphere.color) },
            intensity: { value: def.atmosphere.intensity },
            sunDir: { value: this.sunDir },
          },
          vertexShader: atmoVert,
          fragmentShader: atmoFrag,
          side: THREE.BackSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      atmo.scale.setScalar(def.atmosphere.scale + 0.015);
      group.add(atmo);
    }

    let rings = null;
    if (def.rings) {
      const r = def.rings;
      const geo = new THREE.RingGeometry(1, r.outerKm / r.innerKm, 160, 1);
      // radial UVs so a strip texture maps inner→outer
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      const span = r.outerKm / r.innerKm - 1;
      for (let i = 0; i < pos.count; i++) {
        const rad = Math.hypot(pos.getX(i), pos.getY(i));
        uv.setXY(i, (rad - 1) / span, 0.5);
      }
      const ringTex = r.texture ? loadTex(r.texture) : proceduralRingTexture(r.color, r.opacity);
      rings = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: r.texture ? 1.0 : 1.0,
          depthWrite: false,
        })
      );
      rings.userData.bodyId = def.id;
      group.add(rings);
    }

    let glow = null;
    if (def.emissive) {
      glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture('rgba(255,190,90,1)'),
          color: 0xffc766,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      glow.scale.setScalar(6); // × body radius, set per frame
      group.add(glow);
    }

    let tail = null, coma = null;
    if (def.type === 'comet') {
      coma = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture('rgba(190,235,255,1)'),
          color: new THREE.Color(def.accent.glow),
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      group.add(coma);
      const tailGeo = new THREE.ConeGeometry(0.35, 1, 24, 1, true);
      tailGeo.translate(0, -0.5, 0); // apex at comet, opens away
      tail = new THREE.Mesh(
        tailGeo,
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(def.accent.glow),
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      group.add(tail);
    }

    this.scene.add(group);
    this.entries.set(def.id, { def, group, mesh, clouds, atmo, rings, glow, tail, coma, qAlign, uniforms });
  }

  pickMeshes() {
    const list = [];
    for (const e of this.entries.values()) list.push(e.mesh);
    return list;
  }

  // worldPos/camPos in scene units (THREE.Vector3); radius in units.
  update(id, worldPos, camPos, radius, simMs, sunWorld) {
    const e = this.entries.get(id);
    const { def } = e;
    e.group.position.copy(worldPos).sub(camPos);
    e.mesh.scale.setScalar(radius);
    if (e.clouds) e.clouds.scale.setScalar(radius * 1.008);
    if (e.atmo) e.atmo.scale.setScalar(radius * ((def.atmosphere?.scale ?? 1.02) + 0.015));
    if (e.glow) e.glow.scale.setScalar(radius * 7);

    // spin about the body pole
    const days = daysSinceJ2000(simMs);
    const spin = ((days * 24) / def.rotationHours) * Math.PI * 2;
    const qSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spin % (Math.PI * 2));
    e.mesh.quaternion.copy(e.qAlign).multiply(qSpin);
    if (e.clouds) {
      // cloud decks drift relative to the surface
      // Venus's cloud deck super-rotates in ~100h, same retrograde sense as
      // the surface; Earth's clouds just drift a little against the ground
      const cloudRate = def.id === 'venus' ? def.rotationHours / 58 : def.rotationHours * 0.92;
      const qc = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (((days * 24) / cloudRate) * Math.PI * 2) % (Math.PI * 2)
      );
      e.clouds.quaternion.copy(e.qAlign).multiply(qc);
    }
    if (e.rings) e.rings.quaternion.copy(e.qAlign).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
    if (e.rings) {
      const inner = (def.rings.innerKm / def.radiusKm) * radius;
      e.rings.scale.setScalar(inner);
    }

    // Earth shader needs the live sun direction (world = heliocentric, sun at origin-ish)
    if (e.uniforms) {
      e.uniforms.sunDir.value.copy(sunWorld).sub(worldPos).normalize();
    }
    if (e.atmo) {
      e.atmo.material.uniforms.sunDir.value.copy(sunWorld).sub(worldPos).normalize();
    }

    // comet activity ramps up near the sun
    if (def.type === 'comet') {
      const dAU = worldPos.distanceTo(sunWorld) / 149.5978707; // realistic-mode approximation is fine for activity level
      const activity = Math.min(1, 2.2 / Math.max(dAU, 0.25) ** 1.5);
      e.coma.material.opacity = 0.75 * activity;
      e.coma.scale.setScalar(Math.max(radius * 8, 0.02 + activity * 1.2));
      e.tail.material.opacity = 0.4 * activity;
      if (activity > 0.02) {
        const antiSun = worldPos.clone().sub(sunWorld).normalize();
        const len = Math.max(radius * 20, activity * 22);
        e.tail.scale.set(len * 0.35, len, len * 0.35);
        e.tail.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), antiSun);
        e.tail.visible = true;
      } else {
        e.tail.visible = false;
      }
    }
  }
}
