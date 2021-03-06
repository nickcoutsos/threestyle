let base = new three.Mesh(
  new three.PlaneGeometry(40, 40)
);
base.userData.className = 'floor';
base.rotation.x = -Math.PI/2;
base.receiveShadow = true;

let sphere = new three.Mesh(
  new three.SphereGeometry(5, 20, 20)
);
sphere.userData.className = 'dull';
sphere.castShadow = true;
sphere.position.set(-5, 5, 0);
sphere.onBeforeRender = () => {
  sphere.rotation.y += 0.005;
}

let box = new three.Mesh(
  new three.BoxGeometry(5, 5, 5)
);
box.userData.className = 'ghost'
box.userData.ticks = 0;
box.position.set(5, 5, -2);
box.castShadow = true;
box.onBeforeRender = () => {
  box.userData.ticks += 0.016;
  box.rotation.y += 0.005;
  if (box.userData.ticks > 1) {
    box.userData.ticks = 0;
    box.userData.className =
      box.userData.className.indexOf('selected') === -1
        ? 'ghost selected'
        : 'ghost';
  }
}

let ring = new three.Mesh(
  new three.TorusGeometry(4, 1, 8, 20)
);
ring.userData.className = 'matrix';
ring.position.set(2, 2, 7);
ring.rotation.x = Math.PI / 2;
ring.castShadow = true;
ring.onBeforeRender = () => {
  ring.rotation.z -= 0.005;
}

let light = new three.PointLight();
light.position.set(5, 15, 0);

let spot = new three.SpotLight();
spot.position.set(-15, 15, 15);
spot.target.position.set(0, 0, 0);
spot.castShadow = true;
spot.penumbra = 0.6;
spot.distance = 130;

scene.add(
  light,
  spot, spot.target,
  base,
  sphere,
  box,
  ring
);
