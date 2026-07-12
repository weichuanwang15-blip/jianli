import * as THREE from "./assets/vendor/three.module.js";

const canvas = document.querySelector(".surprise-canvas");
const stage = document.querySelector(".surprise-stage");
const counter = document.querySelector(".reward-counter strong");

if (!canvas || !stage) {
  throw new Error("Surprise scene canvas is missing.");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe5ef);
scene.fog = new THREE.Fog(0xbfe5ef, 28, 88);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 130);
camera.position.set(10.5, 11.8, 20);
camera.lookAt(0, 0, -12);

scene.add(new THREE.HemisphereLight(0xf5ffff, 0x5e7c81, 2.7));
const sunlight = new THREE.DirectionalLight(0xfff4d6, 4);
sunlight.position.set(-10, 18, 12);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -18;
sunlight.shadow.camera.right = 18;
sunlight.shadow.camera.top = 25;
sunlight.shadow.camera.bottom = -15;
sunlight.shadow.camera.near = 1;
sunlight.shadow.camera.far = 70;
sunlight.shadow.bias = -0.0004;
scene.add(sunlight);

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x2b3c47, roughness: 0.92 });
const roadEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0xe9eee8, roughness: 0.82 });
const stripeMaterial = new THREE.MeshStandardMaterial({
  color: 0xf7f4df,
  emissive: 0x4a451c,
  emissiveIntensity: 0.12,
});
const coralMaterial = new THREE.MeshStandardMaterial({ color: 0xe65f52, roughness: 0.58 });
const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x247ba0, roughness: 0.5 });
const ivoryMaterial = new THREE.MeshStandardMaterial({ color: 0xf6f0df, roughness: 0.8 });
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8bd2df,
  roughness: 0.18,
  metalness: 0.04,
  transmission: 0.12,
});
const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x172129, roughness: 0.82 });
const goldMaterial = new THREE.MeshStandardMaterial({
  color: 0xffc84f,
  roughness: 0.34,
  metalness: 0.24,
  emissive: 0x6a3200,
  emissiveIntensity: 0.18,
});

function makeMesh(geometry, material, position, rotation = [0, 0, 0]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

const road = makeMesh(new THREE.BoxGeometry(11.8, 0.5, 125), roadMaterial, [0, -0.35, -38]);
scene.add(road);

[-6.45, 6.45].forEach((x) => {
  scene.add(makeMesh(new THREE.BoxGeometry(1.05, 0.72, 125), roadEdgeMaterial, [x, -0.22, -38]));
});

const movingRoad = new THREE.Group();
scene.add(movingRoad);
const laneDashes = [];
for (const x of [-2, 2]) {
  for (let index = 0; index < 18; index += 1) {
    const dash = makeMesh(
      new THREE.BoxGeometry(0.12, 0.035, 3.2),
      stripeMaterial,
      [x, -0.07, -72 + index * 7.2],
    );
    dash.castShadow = false;
    laneDashes.push(dash);
    movingRoad.add(dash);
  }
}

const roadsideObjects = [];
for (let index = 0; index < 18; index += 1) {
  const side = index % 2 ? 1 : -1;
  const height = 1.2 + (index % 4) * 0.7;
  const block = makeMesh(
    new THREE.BoxGeometry(1.2 + (index % 3) * 0.4, height, 1.2),
    index % 5 === 0 ? coralMaterial : ivoryMaterial,
    [side * (8.2 + (index % 3)), height / 2 - 0.05, -74 + index * 7.4],
    [0, index * 0.28, 0],
  );
  roadsideObjects.push(block);
  movingRoad.add(block);
}

function buildTruck() {
  const truck = new THREE.Group();
  const chassis = makeMesh(new THREE.BoxGeometry(3.15, 0.46, 5.2), tireMaterial, [0, 0.72, 0]);
  const cargo = makeMesh(new THREE.BoxGeometry(3.05, 2.25, 2.9), coralMaterial, [0, 2.05, -0.85]);
  const cab = makeMesh(new THREE.BoxGeometry(2.9, 1.9, 1.85), blueMaterial, [0, 1.86, 1.55]);
  const windshield = makeMesh(new THREE.BoxGeometry(2.35, 0.86, 0.08), glassMaterial, [0, 2.15, 2.49], [-0.08, 0, 0]);
  const bumper = makeMesh(new THREE.BoxGeometry(2.8, 0.28, 0.25), ivoryMaterial, [0, 0.92, 2.58]);
  truck.add(chassis, cargo, cab, windshield, bumper);

  const wheels = [];
  for (const x of [-1.58, 1.58]) {
    for (const z of [-1.45, 1.62]) {
      const wheel = makeMesh(
        new THREE.CylinderGeometry(0.57, 0.57, 0.4, 24),
        tireMaterial,
        [x, 0.63, z],
        [0, 0, Math.PI / 2],
      );
      wheels.push(wheel);
      truck.add(wheel);
    }
  }

  for (const x of [-0.86, 0.86]) {
    const lamp = makeMesh(new THREE.SphereGeometry(0.16, 18, 12), goldMaterial, [x, 1.18, 2.7]);
    truck.add(lamp);
  }

  truck.userData.wheels = wheels;
  return truck;
}

const truck = buildTruck();
truck.position.set(0, 0, 7);
truck.rotation.y = Math.PI;
scene.add(truck);

const rewardGeometry = new THREE.OctahedronGeometry(0.62, 0);
const rewards = [];
const lanePositions = [-3.25, 0, 3.25];
const rewardLanes = [1, 0, 2, 1, 2, 0, 1, 0, 2, 1, 0, 2];
for (let index = 0; index < rewardLanes.length; index += 1) {
  const lane = rewardLanes[index];
  const reward = makeMesh(
    rewardGeometry,
    index % 3 === 0 ? coralMaterial : goldMaterial,
    [lanePositions[lane], 1.15, -82 + index * 8.5],
    [0.2, 0, 0.18],
  );
  reward.userData.lane = lane;
  reward.userData.collected = false;
  rewards.push(reward);
  scene.add(reward);

  const ring = makeMesh(
    new THREE.TorusGeometry(0.92, 0.08, 12, 32),
    ivoryMaterial,
    [0, 0, 0],
    [Math.PI / 2, 0, 0],
  );
  reward.add(ring);
}

let requestedLane = 1;
let targetPage = 0;
let collected = 0;
const clock = new THREE.Clock();

window.updateSurpriseScene = ({ page = 0, lane = 0 } = {}) => {
  targetPage = page;
  requestedLane = THREE.MathUtils.clamp(lane + 1, 0, 2);
};

function respawnReward(reward) {
  const farthest = Math.min(...rewards.map((item) => item.position.z));
  reward.position.z = farthest - 9 - Math.random() * 5;
  reward.userData.lane = (reward.userData.lane + 1 + targetPage) % 3;
  reward.position.x = lanePositions[reward.userData.lane];
  reward.scale.setScalar(1);
  reward.visible = true;
  reward.userData.collected = false;
}

function resize() {
  const width = Math.max(stage.clientWidth, 1);
  const height = Math.max(stage.clientHeight, 1);
  camera.aspect = width / height;
  camera.fov = width < 700 ? 50 : 42;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

new ResizeObserver(resize).observe(stage);
resize();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const speed = 13.5;

  [...laneDashes, ...roadsideObjects].forEach((item) => {
    item.position.z += speed * delta;
    if (item.position.z > 22) item.position.z -= 126;
  });

  const upcoming = rewards
    .filter((reward) => !reward.userData.collected && reward.position.z < 8)
    .sort((a, b) => b.position.z - a.position.z)[0];
  const autoLane = upcoming && upcoming.position.z > -18 ? upcoming.userData.lane : requestedLane;
  truck.position.x = THREE.MathUtils.damp(truck.position.x, lanePositions[autoLane], 4.8, delta);
  truck.rotation.z = THREE.MathUtils.damp(truck.rotation.z, (lanePositions[autoLane] - truck.position.x) * -0.035, 5, delta);
  truck.position.y = Math.sin(clock.elapsedTime * 5.5) * 0.035;
  truck.userData.wheels.forEach((wheel) => { wheel.rotation.x += delta * speed * 1.8; });

  rewards.forEach((reward, index) => {
    reward.position.z += speed * delta;
    reward.rotation.y += delta * (1.5 + index * 0.03);
    reward.position.y = 1.2 + Math.sin(clock.elapsedTime * 2.8 + index) * 0.18;

    const closeToTruck = Math.abs(reward.position.z - truck.position.z) < 1.05;
    const sameLane = Math.abs(reward.position.x - truck.position.x) < 1.1;
    if (!reward.userData.collected && closeToTruck && sameLane) {
      reward.userData.collected = true;
      collected += 1;
      if (counter) counter.textContent = String(collected).padStart(2, "0");
    }

    if (reward.userData.collected) {
      reward.scale.multiplyScalar(Math.max(0.01, 1 - delta * 7));
      reward.position.y += delta * 4;
      if (reward.scale.x < 0.08) respawnReward(reward);
    } else if (reward.position.z > 24) {
      respawnReward(reward);
    }
  });

  camera.position.x = THREE.MathUtils.damp(camera.position.x, 10.5 + truck.position.x * 0.18, 2.8, delta);
  camera.lookAt(truck.position.x * 0.32, 0.7, -13);
  renderer.render(scene, camera);
}

animate();
