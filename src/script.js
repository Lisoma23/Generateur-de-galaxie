import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/9.png");

/**
 * Particles
 */
// Geometry
const particulesGeometry = new THREE.BufferGeometry(1, 32, 32);
const particulesCount = 20000;

const positions = new Float32Array(particulesCount * 3);
const colors = new Float32Array(particulesCount * 3);

for (let i = 0; i < particulesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particulesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particulesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Tes
//const particulesGeometry = new THREE.BufferGeometry();
// const vertices = new Float32Array([
//   // x, y, z (9 vertices)
//   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

//   1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,

//   1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

//   -2.0, 2.0, 2.0, 2.0, -2.0, 2.0, 2.0, 2.0, 2.0,
// ]);
// particulesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(vertices, 4)
// );

// Material
const particulesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particleTexture,
  //alphaTest: 0.0001,
  //depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

// Points
const particules = new THREE.Points(particulesGeometry, particulesMaterial);
scene.add(particules);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particules
  //   particules.rotation.y = elapsedTime * 0.1;
  //   particules.rotation.x = elapsedTime * 0.1;
  //   particules.rotation.z = elapsedTime * 0.1;

  //   particules.position.y = Math.sin(elapsedTime * 0.02);
  //   particules.position.x = Math.cos(elapsedTime * 0.02);
  //   particules.position.z = Math.cos(elapsedTime * 0.02);

  //   particules.scale.x = Math.sin(elapsedTime * 0.02);
  //   particules.scale.y = Math.sin(elapsedTime * 0.02);
  //   particules.scale.z = Math.sin(elapsedTime * 0.02);

  // Update controls

  for (let i = 0; i < particulesCount; i++) {
    const i3 = i * 3;

    const x = particulesGeometry.attributes.position.array[i3];
    particulesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }

  particulesGeometry.attributes.position.needsUpdate = true;

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
