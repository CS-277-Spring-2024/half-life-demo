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
let barrelObject;
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
  barrelObject = new ObjectWithAutoBox(barrel, 1, scene, physicsWorld);
  worldObjects.push(barrelObject);
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
  stats.begin();
  delta = Math.min(clock.getDelta(), 0.1);
  physicsWorld.step(delta);
  for (let i in worldObjects) {
    worldObjects[i].mesh.position.x = worldObjects[i].body.position.x;
    worldObjects[i].mesh.position.y = worldObjects[i].body.position.y;
    worldObjects[i].mesh.position.z = worldObjects[i].body.position.z;
  }
  requestAnimationFrame(animate);
  camera.lookAt(0, 0);
  renderer.render(scene, camera);
  stats.end();
}

animate();
