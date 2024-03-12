// ThreeJS Import
import * as THREE from "three";
// OBJ File Loader
import { OBJLoader } from "three/addons/loaders/OBJLoader";
// Lighting Helpers
import { createLights, applyShadow } from "./lights";

import { ObjectWithAutoBox } from "./objectwithautobox";

// Cannon-ES Physics Library
import * as CANNON from "cannon-es";

import Stats from "stats.js";

let barrelBody;
let barrelMesh;
let delta;

let worldObjects = [];

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const clock = new THREE.Clock();

// Create physicsworld and apply gravity
var physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0);

// Instantiate OBJLoader
const objLoader = new OBJLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.z = 10;
camera.position.y = 10;
camera.position.x = -10;

const renderer = new THREE.WebGLRenderer({
  shadowMap: { enabled: true, type: THREE.VSMShadowMap },
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

scene.add(createLights());

scene.add(new THREE.AxesHelper(10));

objLoader.load("resources/models/barrel/barrel.obj", (barrel) => {
  barrelMesh = barrel.children[0];
  const barrelBox = new THREE.Box3().setFromObject(barrel);
  const barrelShape = new CANNON.Box(
    new CANNON.Vec3(
      (barrelBox.max.x - barrelBox.min.x) / 2,
      (barrelBox.max.y - barrelBox.min.y) / 2,
      (barrelBox.max.z - barrelBox.min.z) / 2,
    ),
  );
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
  barrel.material = new THREE.MeshNormalMaterial();
  console.log(barrel.material);

  scene.add(barrel);
});

objLoader.load("resources/models/backdrop/backdrop.obj", (backdrop) => {
  backdrop = applyShadow(backdrop);

  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body({ mass: 0 });
  planeBody.position.y = -5;
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  planeBody.addShape(planeShape);
  physicsWorld.addBody(planeBody);

  scene.add(backdrop);
});

function animate() {
  delta = Math.min(clock.getDelta(), 0.1);
  physicsWorld.step(delta);
  stats.begin();
  if (barrelMesh && barrelBody) {
    barrelMesh.position.x = barrelBody.position.x;
    barrelMesh.position.y = barrelBody.position.y;
    barrelMesh.position.z = barrelBody.position.z;
  }
  requestAnimationFrame(animate);
  camera.lookAt(0, 0);
  renderer.render(scene, camera);
  stats.end();
}

animate();
