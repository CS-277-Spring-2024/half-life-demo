// ThreeJS Import
import * as THREE from "three";
// OBJ File Loader
import { OBJLoader } from "three/addons/loaders/OBJLoader";
// Lighting Helpers
import { createLights, applyShadow } from "./lights";
// Cannon-ES Physics Library
import * as CANNON from "cannon-es";

import Stats from "stats.js";

let barrelBody;
let barrelMesh;

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Create physicsworld and apply gravity
var physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, 0, -9.82);

// Instantiate OBJLoader
const objLoader = new OBJLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({
  shadowMap: { enabled: true, type: THREE.VSMShadowMap },
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.VSMShadowMap;

document.body.appendChild(renderer.domElement);

scene.add(createLights());

scene.add(new THREE.AxesHelper(10));

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = -5;

objLoader.load("resources/models/barrel/barrel.obj", (barrel) => {
  barrelMesh = barrel.children[0];
  const barrelBox = new THREE.BoxHelper(barrel, 0xffff00);
  console.log(barrelBox);
  scene.add(barrelBox);
  const barrelShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  barrelBody = new CANNON.Body({ mass: 1 });
  barrelBody.addShape(barrelShape);
  barrelBody.position.x = barrelMesh.position.x;
  barrelBody.position.y = barrelMesh.position.y;
  barrelBody.position.z = barrelMesh.position.z;
  physicsWorld.addBody(barrelBody);

  barrel.scale.setScalar(1);

  console.log(barrel);

  barrel = applyShadow(barrel);

  console.log(barrel.material);
  // barrel.material = new THREE.MeshPhongMaterial({color: 0xFF00FF});
  barrel.material = new THREE.MeshNormalMaterial();
  console.log(barrel.material);
  // let barrelMesh = new THREE.Mesh(barrel, barrelMaterial);

  // barrelMesh = applyShadow(barrelMesh);

  scene.add(barrel);
});

objLoader.load("resources/models/backdrop/backdrop.obj", (backdrop) => {
  backdrop = applyShadow(backdrop);

  scene.add(backdrop);
});

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  camera.lookAt(0, 0);
  renderer.render(scene, camera);
  stats.end();
}

animate();
