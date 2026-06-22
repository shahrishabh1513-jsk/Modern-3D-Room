// script.js – Modern 3D Room with Three.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- Setup ---
const container = document.getElementById('room-container');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x12121a);

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
camera.position.set(4, 3, 6);
camera.lookAt(0, 0.5, 0);

// WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// CSS2 Renderer (for labels, optional)
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(width, height);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.autoRotate = false;
controls.minDistance = 1.8;
controls.maxDistance = 14;
controls.target.set(0, 0.8, 0);
controls.update();

// --- Lights ---
const ambient = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambient);

const mainLight = new THREE.DirectionalLight(0xffeedd, 1.6);
mainLight.position.set(4, 8, 4);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 20;
mainLight.shadow.camera.left = -8;
mainLight.shadow.camera.right = 8;
mainLight.shadow.camera.top = 8;
mainLight.shadow.camera.bottom = -8;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xffaa88, 0.4);
backLight.position.set(-2, 1, 5);
scene.add(backLight);

const pointLight = new THREE.PointLight(0xa78bfa, 0.6, 8);
pointLight.position.set(1.2, 2.0, -1.0);
scene.add(pointLight);

// --- Floor ---
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x1e1e2e,
  roughness: 0.6,
  metalness: 0.1,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.GridHelper(7, 14, 0x6C63FF, 0x3a3a5a);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

// --- Helper: create box ---
function createBox(w, h, d, color, pos, roughness = 0.4, metalness = 0.1) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos.x, pos.y, pos.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// --- Back Wall ---
const wallMat = new THREE.MeshStandardMaterial({ color: 0x26263a, roughness: 0.5, metalness: 0.05 });
const wall = new THREE.Mesh(new THREE.BoxGeometry(7.6, 3.2, 0.2), wallMat);
wall.position.set(0, 1.6, -3.8);
wall.receiveShadow = true;
scene.add(wall);

// --- Side Walls ---
const sideMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.6 });
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 7.6), sideMat);
leftWall.position.set(-3.8, 1.6, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 7.6), sideMat);
rightWall.position.set(3.8, 1.6, 0);
rightWall.receiveShadow = true;
scene.add(rightWall);

// --- Ceiling (glass-like) ---
const ceilingMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a44,
  roughness: 0.2,
  metalness: 0.4,
  transparent: true,
  opacity: 0.25
});
const ceiling = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.05, 7.6), ceilingMat);
ceiling.position.set(0, 3.2, 0);
scene.add(ceiling);

// --- Sofa ---
const sofaGroup = new THREE.Group();
const sofaBase = createBox(2.4, 0.4, 1.0, 0x3a3a5a, { x: -0.2, y: 0.2, z: 0.8 }, 0.5, 0.05);
sofaGroup.add(sofaBase);
const sofaBack = createBox(2.4, 0.5, 0.25, 0x4a4a6a, { x: -0.2, y: 0.55, z: 1.3 }, 0.5, 0.05);
sofaGroup.add(sofaBack);
const armL = createBox(0.2, 0.4, 0.9, 0x4a4a6a, { x: -1.4, y: 0.4, z: 0.8 }, 0.5, 0.05);
sofaGroup.add(armL);
const armR = createBox(0.2, 0.4, 0.9, 0x4a4a6a, { x: 1.0, y: 0.4, z: 0.8 }, 0.5, 0.05);
sofaGroup.add(armR);
const cushionMat = new THREE.MeshStandardMaterial({ color: 0x6a6a8a, roughness: 0.7 });
for (let i = -0.5; i <= 0.5; i += 1.0) {
  const c = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.7), cushionMat);
  c.position.set(i, 0.5, 0.8);
  c.castShadow = true;
  c.receiveShadow = true;
  sofaGroup.add(c);
}
sofaGroup.position.set(0.2, 0, -0.6);
scene.add(sofaGroup);

// --- Coffee Table ---
const tableMat = new THREE.MeshStandardMaterial({ color: 0x2e2e48, roughness: 0.3, metalness: 0.2 });
const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.8), tableMat);
tableTop.position.set(0.2, 0.8, 0.2);
tableTop.castShadow = true;
tableTop.receiveShadow = true;
scene.add(tableTop);
const legMat = new THREE.MeshStandardMaterial({ color: 0x4a4a6a, metalness: 0.4, roughness: 0.3 });
const legPositions = [[-0.5, 0.4, -0.25], [0.9, 0.4, -0.25], [-0.5, 0.4, 0.65], [0.9, 0.4, 0.65]];
legPositions.forEach(p => {
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), legMat);
  leg.position.set(p[0], p[1], p[2]);
  leg.castShadow = true;
  leg.receiveShadow = true;
  scene.add(leg);
});

// --- TV Unit ---
const tvUnit = createBox(1.8, 0.4, 0.4, 0x22223a, { x: -1.2, y: 0.2, z: -2.8 }, 0.3, 0.15);
scene.add(tvUnit);
const screenMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, emissive: 0x1a1a3a, emissiveIntensity: 0.3 });
const screen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.05), screenMat);
screen.position.set(-1.2, 0.6, -2.6);
scene.add(screen);
const tvLight = new THREE.PointLight(0x6C63FF, 0.3, 3);
tvLight.position.set(-1.2, 0.6, -2.4);
scene.add(tvLight);

// --- Shelf with Books ---
const shelfMat = new THREE.MeshStandardMaterial({ color: 0x2a2a44, roughness: 0.4 });
const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.3), shelfMat);
shelf.position.set(-2.9, 1.2, -1.2);
shelf.castShadow = true;
shelf.receiveShadow = true;
scene.add(shelf);
const bookColors = [0x6C63FF, 0xa78bfa, 0x4f46e5, 0x818cf8, 0x6366f1];
for (let i = 0; i < 4; i++) {
  const b = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.2 + i * 0.04, 0.2),
    new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length], roughness: 0.5 })
  );
  b.position.set(-2.9 + (i - 1.5) * 0.2, 0.9 + i * 0.04, -1.0);
  b.castShadow = true;
  b.receiveShadow = true;
  scene.add(b);
}

// --- Plant ---
const potMat = new THREE.MeshStandardMaterial({ color: 0x4a4a5a, roughness: 0.6 });
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.18, 0.4, 8), potMat);
pot.position.set(3.2, 0.2, -2.8);
pot.castShadow = true;
pot.receiveShadow = true;
scene.add(pot);
const leafMat = new THREE.MeshStandardMaterial({ color: 0x3a7a4a, roughness: 0.8 });
for (let i = 0; i < 6; i++) {
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12 + Math.random() * 0.08, 5), leafMat);
  const angle = (i / 6) * Math.PI * 2;
  leaf.position.set(3.2 + Math.cos(angle) * 0.2, 0.5 + Math.random() * 0.15, -2.8 + Math.sin(angle) * 0.2);
  leaf.castShadow = true;
  scene.add(leaf);
}

// --- Rug ---
const rugMat = new THREE.MeshStandardMaterial({ color: 0x2a2a4a, roughness: 0.9 });
const rug = new THREE.Mesh(new THREE.CircleGeometry(1.2, 20), rugMat);
rug.rotation.x = -Math.PI / 2;
rug.position.set(0.2, 0.01, 0.2);
rug.receiveShadow = true;
scene.add(rug);

// --- Art ---
const artColors = [0x6C63FF, 0xa78bfa, 0x818cf8];
for (let i = 0; i < 3; i++) {
  const art = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.05),
    new THREE.MeshStandardMaterial({ color: artColors[i], roughness: 0.3, metalness: 0.1 })
  );
  art.position.set(-1.0 + i * 0.9, 1.8, -3.6);
  scene.add(art);
}

// --- Lamp ---
const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.1, 8), new THREE.MeshStandardMaterial({ color: 0x6a6a8a, metalness: 0.3 }));
lampBase.position.set(1.6, 0.05, 0.6);
lampBase.castShadow = true;
scene.add(lampBase);
const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), new THREE.MeshStandardMaterial({ color: 0x8a8aaa, metalness: 0.4 }));
lampPole.position.set(1.6, 0.35, 0.6);
lampPole.castShadow = true;
scene.add(lampPole);
const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 8), new THREE.MeshStandardMaterial({ color: 0xeeeeff, emissive: 0xffeedd, emissiveIntensity: 0.15 }));
lampShade.position.set(1.6, 0.7, 0.6);
lampShade.castShadow = true;
scene.add(lampShade);
const lampLight = new THREE.PointLight(0xffcc88, 0.3, 2.5);
lampLight.position.set(1.6, 0.7, 0.6);
scene.add(lampLight);

// --- Floating Shelves ---
for (let i = 0; i < 2; i++) {
  const shelf2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.2), new THREE.MeshStandardMaterial({ color: 0x2a2a44 }));
  shelf2.position.set(3.2, 1.2 + i * 0.8, 0.2 + i * 0.6);
  shelf2.castShadow = true;
  shelf2.receiveShadow = true;
  scene.add(shelf2);
  const obj = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6), new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.2 }));
  obj.position.set(3.4, 1.25 + i * 0.8, 0.2 + i * 0.6);
  obj.castShadow = true;
  scene.add(obj);
}

// --- Window Frame ---
const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a3a5a, metalness: 0.2 });
const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.1), frameMat);
frame.position.set(2.5, 1.6, -3.75);
frame.castShadow = true;
scene.add(frame);
const glassMat = new THREE.MeshStandardMaterial({ color: 0x88bbff, emissive: 0x224466, emissiveIntensity: 0.08, transparent: true, opacity: 0.2 });
const glass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.02), glassMat);
glass.position.set(2.5, 1.6, -3.7);
scene.add(glass);

// --- Zoom Indicator ---
const zoomLabel = document.getElementById('zoomLevel');
function updateZoomLabel() {
  const dist = camera.position.distanceTo(controls.target);
  const percent = Math.round((1 / (dist / 5)) * 100);
  const clamped = Math.min(200, Math.max(30, percent));
  zoomLabel.textContent = clamped + '%';
}

// --- Resize ---
function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  labelRenderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// --- Zoom Buttons ---
document.getElementById('zoomIn').addEventListener('click', () => {
  const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const dist = camera.position.distanceTo(controls.target);
  const newDist = Math.max(1.8, dist * 0.85);
  camera.position.copy(controls.target.clone().add(dir.multiplyScalar(newDist)));
  controls.update();
  updateZoomLabel();
});
document.getElementById('zoomOut').addEventListener('click', () => {
  const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const dist = camera.position.distanceTo(controls.target);
  const newDist = Math.min(14, dist * 1.15);
  camera.position.copy(controls.target.clone().add(dir.multiplyScalar(newDist)));
  controls.update();
  updateZoomLabel();
});

// --- Animation ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  updateZoomLabel();
}
animate();
setTimeout(updateZoomLabel, 100);

// --- Idle animation for point light ---
let time = 0;
setInterval(() => {
  time += 0.01;
  pointLight.position.x = 1.2 + Math.sin(time * 0.5) * 0.5;
  pointLight.position.z = -1.0 + Math.cos(time * 0.3) * 0.6;
}, 50);