import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Camera-relative rendering: the GL camera never leaves the origin; every
// object's mesh position is (world position − virtual camera position),
// computed in JS doubles. This kills float32 jitter at Kuiper-belt range.

export function createStage(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04050a);

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1e-5,   // 10 km — log depth buffer keeps this workable
    4e6
  );
  camera.position.set(0, 0, 0);

  // Deep-space cinematic grade: one warm sun light (decay 0 — outer planets
  // stay readable, per the museum-exhibit brief), faint cool fill for the
  // shadowed sides, near-black ambient floor.
  const sunLight = new THREE.PointLight(0xfff2dd, 2.6, 0, 0);
  scene.add(sunLight);
  const coolFill = new THREE.HemisphereLight(0x2a3550, 0x0a0d18, 0.35);
  scene.add(coolFill);
  const ambient = new THREE.AmbientLight(0x11141f, 0.5);
  scene.add(ambient);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.75, // strength
    0.85, // radius
    0.82  // threshold — only the sun and bright glows bloom
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  return { renderer, scene, camera, composer, sunLight, bloom };
}
