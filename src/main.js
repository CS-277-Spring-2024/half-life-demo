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

let barrelObject;
let pistolObject;
let crabObject;
let delta;

let gun = false;
let moved = false;
let mined = false;

let worldObjects = [];

const stats = new Stats();
stats.showPanel(0);
// document.body.appendChild(stats.dom);

const clock = new THREE.Clock();

// Create physicsworld and apply gravity
var physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -100, 0);

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

document.body.addEventListener("keydown", function (event) {
  const key = event.key; // "a", "1", "Shift", etc.
  if (key == 1) {
    moved = true;
  }
  if (key == 2) {
    mined = true;
  }
  if (key == 1 || key == 2) {
    if (moved == true && mined == true) {
      alert("You notice a small hole in the wall");
    }
  }
  if (key == 3 && moved == true && mined == true) {
    alert("Escaped, Yay!");
  }
});

scene.add(new THREE.AxesHelper(10));
function genBarrel(x, y, z) {
  const objLoader = new OBJLoader();
  objLoader.load("resources/models/barrel/barrel.obj", (barrel) => {
    barrel.position.x = x;
    barrel.position.y = y;
    barrel.position.z = z;
    barrelObject = new ObjectWithAutoBox(barrel, 1, scene, physicsWorld);
    worldObjects.push(barrelObject);
  });
}

function genCrab(x, y, z) {
  const objLoader = new OBJLoader();
  objLoader.load("resources/models/crab/crab.obj", (crab) => {
    crab.position.x = x;
    crab.position.y = y;
    crab.position.z = z;
    crabObject = new ObjectWithAutoBox(crab, 1, scene, physicsWorld);
    crabObject.object.rotateY(3.14 / 2);
    worldObjects.push(crabObject);
  });
}

function genPistol(x, y, z) {
  const objLoader = new OBJLoader();
  objLoader.load("resources/models/gun/pistol.obj", (pistol) => {
    pistol.position.x = x;
    pistol.position.y = y;
    pistol.position.z = z;
    pistolObject = new ObjectWithAutoBox(pistol, 11, scene, physicsWorld);
    worldObjects.push(pistolObject);
  });
}

genBarrel(0, -3, -3);
genPistol(0, 0, -3);

const objLoader = new OBJLoader();
objLoader.load("resources/models/backdrop/backdrop.obj", (backdrop) => {
  backdrop = applyShadow(backdrop);

  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body({ mass: 0 });
  planeBody.position.y = -5.3;
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  planeBody.addShape(planeShape);
  physicsWorld.addBody(planeBody);

  scene.add(backdrop);
});

let crab = genCrab(0, 0, 3);

function animate() {
  if (moved == true && worldObjects[2]) {
    worldObjects[2].body.position.x = -2;
  }
  console.log(mined, moved);
  stats.begin();
  delta = Math.min(clock.getDelta(), 0.1);
  physicsWorld.step(delta);
  for (let i in worldObjects) {
    console.log(worldObjects[i]);
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
