import * as three from 'three';
import {applyStyle} from '../src/threestyle';

let height = window.innerHeight,
  width = window.innerWidth,
  renderer = new three.WebGLRenderer(),
  camera = new three.PerspectiveCamera(70, width / height, 1, 10000),
  scene = new three.Scene();

renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
camera.position.set(15, 15, 15);
camera.lookAt(new three.Vector3());

let base = new three.Mesh(new three.PlaneGeometry(40, 40));
base.userData.className = 'floor';
base.rotation.x = -Math.PI/2;
base.receiveShadow = true;

let sphere = new three.Mesh(new three.SphereGeometry(5, 20, 20));
sphere.userData.className = 'dull';
sphere.castShadow = true;
sphere.position.set(-5, 5, 0);

let box = new three.Mesh(new three.BoxGeometry(5, 5, 5));
box.userData.className = 'ghost'
box.position.set(5, 5, -2);
box.castShadow = true;

let ring = new three.Mesh(new three.TorusGeometry(4, 1, 8, 20));
ring.userData.className = 'matrix';
ring.position.set(2, 2, 7);
ring.rotation.x = Math.PI / 2;
ring.castShadow = true;

let light = new three.PointLight();
light.position.set(5, 15, 0);

let spot = new three.SpotLight();
spot.position.set(-15, 15, 15);
spot.target.position.set(0, 0, 0);
spot.castShadow = true;
spot.penumbra = 0.6;
spot.distance = 130;

scene.add(
  camera,
  light,
  spot, spot.target,
  base,
  sphere,
  box,
  ring
);

applyStyle(scene);

document.body.appendChild(renderer.domElement);

var clock = 0,
  lastFrame = Date.now();

function render() {
  let currentFrame = Date.now(),
    delta = currentFrame - lastFrame;

  clock += delta;
  lastFrame = currentFrame;

  let rotation = delta / 1000 * .5;
  sphere.rotation.y += rotation;
  box.rotation.y += rotation;
  ring.rotation.z += rotation;
  if (clock >= 1000) {
    box.userData.className = box.userData.className.indexOf('selected') === -1
      ? 'ghost selected'
      : 'ghost';

    clock = 0;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
});

render();