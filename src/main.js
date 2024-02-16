import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshToonMaterial({
  color: 0x00ff00,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.z = 2;
cube.castShadow = true;
scene.add(cube);

camera.position.z = 5;
camera.position.y = -5;
//camera.position.x = 5;

camera.rotation.x = 0.7854;
// camera.rotation.z = 0.7854;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshToonMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
scene.add(floor);

const light = new THREE.DirectionalLight(0xfff0dd, 2);
light.position.set(0, 5, 10);
light.castShadow = true;
scene.add(light);

animate();
