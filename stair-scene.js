import * as THREE from "./assets/vendor/three.module.js";

const canvas = document.querySelector(".stair-canvas");
const stage = document.querySelector(".spiral-stage");
const fallback = document.querySelector(".webgl-fallback");

if (!canvas || !stage) {
  throw new Error("Product stair canvas is missing.");
}

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcfe8ed, 22, 52);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 80);
const stairGroup = new THREE.Group();
const architectureGroup = new THREE.Group();
scene.add(architectureGroup, stairGroup);

const marbleCanvas = document.createElement("canvas");
marbleCanvas.width = 512;
marbleCanvas.height = 512;
const marbleContext = marbleCanvas.getContext("2d");
const marbleGradient = marbleContext.createLinearGradient(0, 0, 512, 512);
marbleGradient.addColorStop(0, "#fffefa");
marbleGradient.addColorStop(1, "#e6ece7");
marbleContext.fillStyle = marbleGradient;
marbleContext.fillRect(0, 0, 512, 512);
marbleContext.strokeStyle = "rgba(72, 113, 125, .13)";
marbleContext.lineWidth = 2;
for (let index = 0; index < 12; index += 1) {
  marbleContext.beginPath();
  marbleContext.moveTo(-30, index * 54 + 10);
  marbleContext.bezierCurveTo(150, index * 38, 300, index * 69, 542, index * 36 + 24);
  marbleContext.stroke();
}
const marbleTexture = new THREE.CanvasTexture(marbleCanvas);
marbleTexture.colorSpace = THREE.SRGBColorSpace;
marbleTexture.wrapS = THREE.RepeatWrapping;
marbleTexture.wrapT = THREE.RepeatWrapping;
marbleTexture.repeat.set(1.8, 1.8);
const ivory = new THREE.MeshPhysicalMaterial({
  color: 0xf7f7f0,
  map: marbleTexture,
  roughness: 0.44,
  metalness: 0,
  clearcoat: 0.18,
});
const coolSide = new THREE.MeshPhysicalMaterial({
  color: 0x0e3151,
  roughness: 0.28,
  metalness: 0.38,
  clearcoat: 0.55,
});
const paleStone = new THREE.MeshStandardMaterial({
  color: 0xdfe7df,
  roughness: 0.9,
});
const coral = new THREE.MeshStandardMaterial({
  color: 0xd75f54,
  roughness: 0.68,
  emissive: 0x4a0805,
  emissiveIntensity: 0.08,
});
const activeStone = ivory.clone();
activeStone.color.set(0xfffcf2);
activeStone.emissive.set(0x3d5151);
activeStone.emissiveIntensity = 0.1;
const travelerMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xe34d42,
  roughness: 0.28,
  metalness: 0.02,
  clearcoat: 0.92,
  clearcoatRoughness: 0.08,
});

const hemi = new THREE.HemisphereLight(0xf7ffff, 0x7f9b98, 2.5);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff7e5, 4.2);
sun.position.set(-8, 17, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -14;
sun.shadow.camera.right = 14;
sun.shadow.camera.top = 18;
sun.shadow.camera.bottom = -10;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 45;
sun.shadow.bias = -0.0005;
scene.add(sun);

const fill = new THREE.DirectionalLight(0xb9e7f4, 1.4);
fill.position.set(10, 6, -8);
scene.add(fill);

function mesh(geometry, material, position, rotation = [0, 0, 0]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

const stepsPerTurn = 24;
const turnCount = 6;
const stepCount = stepsPerTurn * turnCount;
const stepsPerPage = stepsPerTurn;
const stairRadius = 3.15;
const stepRise = 0.15;
const turn = (Math.PI * 2) / stepsPerTurn;
const steps = [];
const innerRadius = 1.3;
const outerRadius = 4.28;
const stepHalfAngle = turn * 0.42;
const stepShape = new THREE.Shape();
const stepPoints = [];

for (let index = 0; index <= 10; index += 1) {
  const angle = -stepHalfAngle + ((stepHalfAngle * 2) / 10) * index;
  stepPoints.push(new THREE.Vector2(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle)));
}
for (let index = 10; index >= 0; index -= 1) {
  const angle = -stepHalfAngle + ((stepHalfAngle * 2) / 10) * index;
  stepPoints.push(new THREE.Vector2(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle)));
}
stepShape.moveTo(stepPoints[0].x, stepPoints[0].y);
stepPoints.slice(1).forEach((point) => stepShape.lineTo(point.x, point.y));
stepShape.closePath();
const stepGeometry = new THREE.ExtrudeGeometry(stepShape, {
  depth: 0.22,
  bevelEnabled: true,
  bevelSegments: 2,
  bevelSize: 0.045,
  bevelThickness: 0.04,
  curveSegments: 12,
});
stepGeometry.rotateX(-Math.PI / 2);

for (let index = 0; index < stepCount; index += 1) {
  const angle = index * turn - Math.PI * 0.35;
  const y = index * stepRise - 5.8;
  const step = mesh(
    stepGeometry,
    ivory,
    [0, y, 0],
    [0, angle, 0],
  );
  step.userData.index = index;
  steps.push(step);
  stairGroup.add(step);
}

const traveler = mesh(new THREE.SphereGeometry(0.34, 48, 32), travelerMaterial, [0, -5.3, 0]);
traveler.castShadow = true;
stairGroup.add(traveler);
const travelerContact = new THREE.Mesh(
  new THREE.CircleGeometry(0.28, 32),
  new THREE.MeshBasicMaterial({ color: 0x142a3d, transparent: true, opacity: 0.18, depthWrite: false }),
);
travelerContact.rotation.x = -Math.PI / 2;
stairGroup.add(travelerContact);

const centralTower = mesh(
  new THREE.CylinderGeometry(1.14, 1.14, 23.5, 80),
  coolSide,
  [0, 4.7, 0],
);
architectureGroup.add(centralTower);

const base = mesh(
  new THREE.CylinderGeometry(5.45, 5.45, 0.55, 80),
  ivory,
  [0, -6.25, 0],
);
architectureGroup.add(base);

const finalAngle = (stepCount - 1) * turn - Math.PI * 0.35;
const finalY = (stepCount - 1) * stepRise - 5.8;
const bridge = mesh(
  new THREE.BoxGeometry(7.4, 0.35, 1.35),
  ivory,
  [Math.cos(finalAngle) * (stairRadius + 3.3), finalY + 0.08, Math.sin(finalAngle) * (stairRadius + 3.3)],
  [0, -finalAngle, 0],
);
architectureGroup.add(bridge);

const summit = mesh(
  new THREE.BoxGeometry(7.6, 0.55, 5.8),
  ivory,
  [Math.cos(finalAngle) * (stairRadius + 8.2), finalY + 0.02, Math.sin(finalAngle) * (stairRadius + 8.2)],
  [0, -finalAngle, 0],
);
architectureGroup.add(summit);

const shadowPlane = mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.ShadowMaterial({ color: 0x496b6c, opacity: 0.16 }),
  [0, -6.55, 0],
  [-Math.PI / 2, 0, 0],
);
shadowPlane.castShadow = false;
architectureGroup.add(shadowPlane);

let targetPage = 0;
let travelProgress = 0;
let travelStart = 0;
let travelTarget = 0;
let travelStartTime = 0;
let travelDuration = 1.55;
let lastTravelIndex = 0;
const pointer = new THREE.Vector2();
const smoothPointer = new THREE.Vector2();
const clock = new THREE.Clock();

window.updateProductScene = (page) => {
  targetPage = THREE.MathUtils.clamp(page, 0, 5);
  travelStart = travelProgress;
  travelTarget = targetPage / 5;
  travelStartTime = clock.getElapsedTime();
  travelDuration = 1.8 + Math.abs(travelTarget - travelStart) * 0.7;
};

stage.addEventListener("pointermove", (event) => {
  const bounds = stage.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
});

stage.addEventListener("pointerleave", () => pointer.set(0, 0));

function resize() {
  const width = Math.max(stage.clientWidth, 1);
  const height = Math.max(stage.clientHeight, 1);
  const aspect = width / height;
  const viewHeight = width < 700 ? 11.8 : 10.6;
  camera.left = (-viewHeight * aspect) / 2;
  camera.right = (viewHeight * aspect) / 2;
  camera.top = viewHeight / 2;
  camera.bottom = -viewHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

const observer = new ResizeObserver(resize);
observer.observe(stage);
resize();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const easing = 1 - Math.exp(-delta * 3.3);
  smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 4));

  const travelT = THREE.MathUtils.clamp((clock.getElapsedTime() - travelStartTime) / travelDuration, 0, 1);
  const cinematicEase = travelT * travelT * (3 - 2 * travelT);
  travelProgress = THREE.MathUtils.lerp(travelStart, travelTarget, cinematicEase);
  const travelIndex = travelProgress * (stepCount - 1);
  const focusIndex = Math.min(stepCount - 1, travelIndex + 7);
  const focusAngle = focusIndex * turn - Math.PI * 0.35;
  const focusY = focusIndex * stepRise - 5.8;
  const terminalReveal = THREE.MathUtils.smoothstep(travelProgress, 0.84, 1);
  const cameraAngle = focusAngle - 1.12 + terminalReveal * 0.68 + smoothPointer.x * 0.12;
  const distance = window.innerWidth < 700 ? 20 : 18;
  const targetX = THREE.MathUtils.lerp(0, summit.position.x, terminalReveal);
  const targetZ = THREE.MathUtils.lerp(0, summit.position.z, terminalReveal);
  const targetY = THREE.MathUtils.lerp(focusY + 0.5, summit.position.y + 0.45, terminalReveal);

  camera.position.set(
    targetX + Math.cos(cameraAngle) * distance,
    targetY + 8.2 - smoothPointer.y * 0.7,
    targetZ + Math.sin(cameraAngle) * distance,
  );
  camera.lookAt(targetX, targetY, targetZ);
  camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetPage === 5 ? 1.2 : 1.08, easing);
  camera.updateProjectionMatrix();

  steps.forEach((step, index) => {
    const distanceFromFocus = Math.abs(index - focusIndex);
    step.visible = index >= travelIndex - 4 && index <= travelIndex + 27;
    step.material = distanceFromFocus < 4.5 ? activeStone : ivory;
    step.scale.y = THREE.MathUtils.lerp(step.scale.y, distanceFromFocus < 1.3 ? 1.28 : 1, easing);
  });

  const travelerAngle = travelIndex * turn - Math.PI * 0.35;
  const travelerRadius = (innerRadius + outerRadius) / 2;
  const stepPhase = travelIndex - Math.floor(travelIndex);
  const treadLift = Math.sin(stepPhase * Math.PI) * 0.065;
  const travelerY = travelIndex * stepRise - 5.8 + 0.22 + 0.34 + treadLift;
  traveler.position.set(
    Math.cos(travelerAngle) * travelerRadius,
    travelerY,
    Math.sin(travelerAngle) * travelerRadius,
  );
  travelerContact.position.set(traveler.position.x, travelerY - 0.342, traveler.position.z);
  const rollAxis = new THREE.Vector3(Math.cos(travelerAngle), 0, Math.sin(travelerAngle)).normalize();
  const pathLength = Math.hypot(travelerRadius * turn, stepRise);
  traveler.rotateOnWorldAxis(rollAxis, -(travelIndex - lastTravelIndex) * pathLength / 0.34);
  lastTravelIndex = travelIndex;

  architectureGroup.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.025;
  renderer.render(scene, camera);
}

fallback?.remove();
animate();
