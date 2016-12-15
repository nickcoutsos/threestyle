import * as three from 'three';

import {applyStyle} from './threestyle';

let height = window.innerHeight,
  width = window.innerWidth,
  renderer = new three.WebGLRenderer(),
  camera = new three.PerspectiveCamera(90, width / height, 1, 1000),
  scene = new three.Scene();

renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
camera.position.set(10, 10, 10);
camera.lookAt(new three.Vector3());

let base = new three.Mesh(new three.PlaneGeometry(30, 30));
base.userData.className = 'floor';
base.rotation.x = -Math.PI/2;
base.receiveShadow = true;

let sphere = new three.Mesh(new three.SphereGeometry(5, 20, 20));
sphere.userData.className = 'dull';
sphere.castShadow = true;
sphere.position.set(-5, 5, 0);

let box = new three.Mesh(new three.BoxGeometry(5, 5, 5));
box.userData.className = 'ghost'
box.position.set(5, 5, 0);
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

applyStyle(scene, `
  SphereGeometry {
    color: red
  }
  BoxGeometry {
    color: blue
  }
  .floor {
    color: grey;
  }
  .dull {
    shininess: 1;
  }
  .ghost {
    transparent: true;
    opacity: 0.5;
  }
  .selected {
    color: yellow;
  }
  .matrix {
    wireframe: true;
    color: green;
  }
`);

document.body.appendChild(renderer.domElement);

var clock = 0,
  lastFrame = Date.now();

function render() {
  let currentFrame = Date.now(),
    delta = currentFrame - lastFrame;

  clock += delta;
  lastFrame = currentFrame;

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
