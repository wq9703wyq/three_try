import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
// renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 20, 30);
orbit.update();

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false })
)
planeMesh.rotateX(-Math.PI / 2)
scene.add(planeMesh);

// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true })
)
highlightMesh.rotateX(-Math.PI / 2)
highlightMesh.position.set(0.5, 0, 0.5)
scene.add(highlightMesh)


const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

document.addEventListener('mousemove', (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
    highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
  }
})

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 4, 2),
  new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 'yellow'
  })
)
const objects = [];

document.addEventListener('mousedown', (e) => {
  const isObjectExist = objects.find(obj => obj.position.x === highlightMesh.position.x && obj.position.z === highlightMesh.position.z)
  if (!isObjectExist) {
    const _sphereMesh = sphereMesh.clone();
    _sphereMesh.position.copy(highlightMesh.position);
    scene.add(_sphereMesh);
    objects.push(_sphereMesh);
  }
})

function animate(time) {
  objects.forEach(sphere => {
    sphere.rotation.x = time / 1000;
    sphere.rotation.y = time / 1000;
    sphere.rotation.z = time / 1000;
  })
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});