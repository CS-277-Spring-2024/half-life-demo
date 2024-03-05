import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import { createLights, applyShadow} from "./lights";
import * as CANNON from 'cannon-es'
import { MeshPhongMaterial } from "three";

var physicsWorld = new CANNON.World();

physicsWorld.gravity.set(0, 0, -9.82);

const objLoader = new OBJLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

document.body.appendChild(renderer.domElement);


scene.add(createLights());

scene.add(new THREE.AmbientLight(0xffffff))

scene.add(new THREE.AxesHelper(10))

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = -5;

objLoader.load("resources/models/barrel/barrel.obj", (barrel) => {
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
  requestAnimationFrame(animate);
  camera.lookAt(0, 0);
  renderer.render(scene, camera);
}

animate();
