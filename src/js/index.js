import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const renderer = new Three.WebGL1Renderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);

const axesHelper = new Three.AxesHelper(20);
axesHelper.setColors("red", "blue", "yellow"); // x,y,z

const orbit = new OrbitControls(camera, renderer.domElement)

scene.add(axesHelper);

camera.position.set(30, 30, 30);

orbit.update();

const boxGeo = new Three.BoxGeometry();
const boxMater = new Three.MeshBasicMaterial({ color: "blue" });
const box = new Three.Mesh(boxGeo, boxMater);
scene.add(box);

const planeGeometry = new Three.PlaneGeometry(30, 30);
const planeMaterial = new Three.MeshStandardMaterial({ color: "#fff", side: Three.DoubleSide });
const plane = new Three.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new Three.GridHelper(30, 10);
scene.add(gridHelper)

const sphereeGeometry = new Three.SphereGeometry(3, 30, 30);
const sphereeMaterial = new Three.MeshStandardMaterial({ color: "red", wireframe: false })
const sphere = new Three.Mesh(sphereeGeometry, sphereeMaterial);
scene.add(sphere)
sphere.position.set(-10, 10, 0)
sphere.castShadow = true;

const ambinetLight = new Three.AmbientLight(0x333333);
scene.add(ambinetLight)

// const directionalLight = new Three.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new Three.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper)

// const dLightShadowHelper = new Three.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper)

const spoptLight = new Three.SpotLight(0xFFFFFF);
scene.add(spoptLight);
spoptLight.position.set(-100, 100, 0);
spoptLight.castShadow = true;
spoptLight.angle = 0.2;

const sLightHelper = new Three.SpotLightHelper(spoptLight);
scene.add(sLightHelper)

// scene.fog = new Three.Fog(0xFFFFFF, 0, 200)
scene.fog = new Three.FogExp2(0xFFFFFF, 0.01);

renderer.setClearColor('yellow')

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1
  // cameraBottom: -12
}
gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e)
})
gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
// gui.add(options, 'cameraBottom', -100, 100).onChange((e) => {
//   directionalLight.shadow.camera.bottom = Math.floor(e);
// });

let step = 0;

const mousePosition = new Three.Vector2();

document.addEventListener('click', (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
})
const rayCaster = new Three.Raycaster()

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  // spoptLight = { ...spoptLight, angle: options.angle, penumbra: options.penumbra, intensity: options.intensity };
  spoptLight.angle = options.angle;
  spoptLight.penumbra = options.penumbra;
  spoptLight.intensity = options.intensity;
  sLightHelper.update()

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);

  intersects.forEach(item => {
    if (item.object.id === sphere.id) {
      item.object.material.color.set('#f0cf00');
    }
  })

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)
