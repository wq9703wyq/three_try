import * as Three from "three";

let container;
let camera, scene, raycaster, renderer;

let INTERSECTED;
let theta = 0;

const pointer = new Three.Vector2();
const radius = 100;

init()
animate()

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);

  scene = new Three.Scene();
  scene.background = new Three.Color(0xf0f0f0);

  const light = new Three.DirectionalLight(0xffffff, 0.8);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const geometry = new Three.BoxGeometry(20, 20, 20);

  for (let i = 0; i < 2000; i++) {
    const randomColor = new Three.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const object = new Three.Mesh(geometry, randomColor);

    const randomPositionMake = () => Math.random() * 800 - 400;
    const randomRotationMake = () => Math.random() * 2 * Math.PI;

    object.position.set(randomPositionMake(), randomPositionMake(), randomPositionMake());
    object.rotation.set(randomRotationMake(), randomRotationMake(), randomRotationMake());

    scene.add(object)
  }

  raycaster = new Three.Raycaster();

  renderer = new Three.WebGL1Renderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  document.addEventListener('mousemove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
  })

}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  theta += 0.1;

  camera.position.x = radius * Math.sin(Three.MathUtils.degToRad(theta));
  camera.position.y = radius * Math.sin(Three.MathUtils.degToRad(theta));
  camera.position.z = radius * Math.cos(Three.MathUtils.degToRad(theta));

  camera.lookAt(scene.position);

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  let lastHex;
  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED) {
        INTERSECTED.material.emissive.setHex(lastHex);
      }

      INTERSECTED = intersects[0].object;
      lastHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex('0xff0000');
    }
  } else {
    if (INTERSECTED) {
      INTERSECTED.material.emissive.setHex(lastHex);
    }
    lastHex = null;
    INTERSECTED = null;
  }

  renderer.render(scene, camera)
}
