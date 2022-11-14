import * as Three from "three";
import * as Cannon from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();
scene.background = new Three.Color(0xf0f0f0);

const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 4, 15)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update();

const world = new Cannon.World({ gravity: new Cannon.Vec3(0, -9.81, 0) });

const planeGeometry = new Three.PlaneGeometry(10, 10);
const planeMaterial = new Three.MeshBasicMaterial({ color: '#fff', side: Three.DoubleSide });
const planeMesh = new Three.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
const planeMat = new Cannon.Material();
const planeBody = new Cannon.Body({
  type: Cannon.Body.STATIC,
  shape: new Cannon.Box(new Cannon.Vec3(15, 15, 0.1)),
  material: planeMat
})
world.addBody(planeBody);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const timestep = 1 / 60;

const sphereGeo = new Three.SphereGeometry(0.3);

const spheres = [];
const bodies = [];
let sphereCount = 0;
const sphereLimit = 100;

function createSphereMesh() {
  const sphereMaterial = new Three.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    metalness: 0,
    roughness: 0
  })
  const object = new Three.Mesh(sphereGeo, sphereMaterial);
  scene.add(object)
  spheres.push(object)
  return object
}

function createSphereBpdy() {
  const sphereMat = new Cannon.Material();
  const sphereBody = new Cannon.Body({
    mass: 0.3,
    shape: new Cannon.Sphere(0.125),
    position: new Cannon.Vec3(Math.random() * 2 - 1, Math.random() * (5 - 2) + 2, Math.random() * 4 - 2),
    material: sphereMat
  });
  world.addBody(sphereBody);

  const groundSphereContactMat = new Cannon.ContactMaterial(
    planeMat,
    sphereMat,
    { restitution: 0.9 }
  );
  world.addContactMaterial(groundSphereContactMat);
  bodies.push(sphereBody)
  return sphereBody
}

function throttle(fn, wait) {
  var timer;
  return function (...args) {
    const context = this;
    if (!timer) {
      timer = setTimeout(function () {
        fn.call(context, ...args);
        timer = null
      }, wait)
    }
    return timer
  }
}

setInterval(() => {
  if (sphereCount++ < sphereLimit) {
    createSphereMesh();
    createSphereBpdy();
  }
}, 1000)

function animate() {
  world.step(timestep);
  planeMesh.position.copy(planeBody.position);
  planeMesh.quaternion.copy(planeBody.quaternion);
  spheres.forEach((item, index) => {
    item.position.copy(bodies[index].position);
    item.quaternion.copy(bodies[index].quaternion)
  })
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);