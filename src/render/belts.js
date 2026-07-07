import * as THREE from 'three';

// Procedural belt populations. Each particle is an independent near-circular
// orbit; angle, drift rate, vertical excursion, and both scale mappings are
// evaluated in the vertex shader, so tens of thousands of asteroids advance
// with sim time and morph between scale modes for free.

const vert = /* glsl */ `
  attribute float aAU;      // orbital radius, AU
  attribute float theta0;   // phase at J2000
  attribute float nRad;     // mean motion, rad/day
  attribute float zAmp;     // sin(inclination)
  attribute float zPhase;
  attribute float aSize;
  varying float vFade;
  uniform float uDays;      // sim days since J2000
  uniform float uBlend;     // 0 realistic → 1 compressed
  uniform float uAU;        // units per AU (realistic)
  uniform float uK;         // compressed distance constant
  uniform float uP;         // compressed distance exponent

  void main() {
    float th = theta0 + nRad * uDays;
    float rReal = aAU * uAU;
    float rComp = uK * pow(aAU, uP);
    float r = mix(rReal, rComp, uBlend);
    vec3 p = vec3(
      r * cos(th),
      r * sin(th),
      r * zAmp * sin(th + zPhase)
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = length(mv.xyz);
    gl_PointSize = aSize * clamp(240.0 / dist, 0.6, 2.4);
    vFade = clamp(240.0 / dist, 0.35, 1.0);
  }
`;
const frag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 1.8) * uOpacity * vFade;
    gl_FragColor = vec4(uColor, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBelt({ count, radiusFn, incSigmaDeg, color, opacity, sizeBase, seed }) {
  const rand = mulberry32(seed);
  const aAU = new Float32Array(count);
  const theta0 = new Float32Array(count);
  const nRad = new Float32Array(count);
  const zAmp = new Float32Array(count);
  const zPhase = new Float32Array(count);
  const aSize = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = radiusFn(rand);
    aAU[i] = a;
    theta0[i] = rand() * Math.PI * 2;
    const periodDays = 365.25 * Math.pow(a, 1.5); // Kepler's third law
    nRad[i] = (Math.PI * 2) / periodDays;
    // Rayleigh-ish inclination scatter
    const inc = Math.abs(rand() + rand() - 1) * incSigmaDeg * 2;
    zAmp[i] = Math.sin((inc * Math.PI) / 180);
    zPhase[i] = rand() * Math.PI * 2;
    aSize[i] = sizeBase * (0.6 + rand() * 1.5);
  }
  const geo = new THREE.BufferGeometry();
  // position attribute is required by three even though the shader ignores it
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute('aAU', new THREE.BufferAttribute(aAU, 1));
  geo.setAttribute('theta0', new THREE.BufferAttribute(theta0, 1));
  geo.setAttribute('nRad', new THREE.BufferAttribute(nRad, 1));
  geo.setAttribute('zAmp', new THREE.BufferAttribute(zAmp, 1));
  geo.setAttribute('zPhase', new THREE.BufferAttribute(zPhase, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);

  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uDays: { value: 0 },
      uBlend: { value: 1 },
      uAU: { value: 149.5978707 },
      uK: { value: 86.4 },
      uP: { value: 0.45 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

export class Belts {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    // Main belt: 2.1–3.3 AU with crude Kirkwood gaps at the 3:1, 5:2, 7:3, 2:1
    // resonances (2.50, 2.82, 2.96, 3.28 AU)
    const gaps = [2.5, 2.82, 2.96, 3.28];
    this.main = buildBelt({
      count: 24000,
      radiusFn: (rand) => {
        for (let tries = 0; tries < 8; tries++) {
          const a = 2.1 + Math.pow(rand(), 0.9) * 1.25;
          const nearGap = gaps.some((g) => Math.abs(a - g) < 0.035 && rand() < 0.85);
          if (!nearGap) return a;
        }
        return 2.1 + rand() * 1.25;
      },
      incSigmaDeg: 6,
      color: '#b3a68e',
      opacity: 0.5,
      sizeBase: 1.7,
      seed: 101,
    });
    this.group.add(this.main);

    // Kuiper belt: classical 39–48 AU core plus scattered tail out to ~60
    this.kuiper = buildBelt({
      count: 32000,
      radiusFn: (rand) => {
        const u = rand();
        if (u < 0.75) return 39 + rand() * 9;
        if (u < 0.92) return 32 + rand() * 7;
        return 48 + Math.pow(rand(), 2) * 14;
      },
      incSigmaDeg: 7,
      color: '#8fa5bd',
      opacity: 0.42,
      sizeBase: 1.6,
      seed: 202,
    });
    this.group.add(this.kuiper);
  }

  update(camPos, simDays, blend) {
    this.group.position.copy(camPos).multiplyScalar(-1);
    for (const p of [this.main, this.kuiper]) {
      p.material.uniforms.uDays.value = simDays;
      p.material.uniforms.uBlend.value = blend;
    }
  }
}
