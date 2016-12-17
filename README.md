# threestyle

> What if three.js materials, but CSS?

## Introduction

This module seeks to make it possible to use familiar CSS selectors and style
rule syntax for defining and applying _[three.js]_ materials to scenes.


## Example Usage

Set up a simple scene with some objects and a light, then apply a stylesheet.

Any object which includes a geometry can be selected by that geometry's name.
Additionally, a property `className` in the object's userData can further
describe the object and make sharing of style rules easier.

Calling `applyStyle` with a given node and stylesheet will parse the stylesheet
and traverse the graph to match nodes with rules to dynamically create and apply
materials.

```js
import three from 'three';
import {applyStyle} from 'threestyle';

let camera = new three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000),
  scene = new three.Scene()
  renderer = new three.WebGLRenderer(),
  sphere = new three.Mesh(new three.SphereGeometry(5)),
  box = new three.Mesh(new three.BoxGeometry(5, 5, 5)),
  light = new three.PointLight();

camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

light.position.set(-10, 10, 10);
sphere.userData.className = 'transparent';
sphere.position.set(-5, 0, 0);
box.position.set(5, 0, 0);

scene.add(camera, sphere, box, light);

applyStyle(
  scene,
  `
    BoxGeometry {
      color: red;
    }

    SphereGeometry {
      color: blue;
    }

    .transparent {
      transparent: true;
      opacity: 0.5;
    }
  `
);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

```

## Acknowledgements

Inspiration for this project comes from [threess] which takes steps towards
separating material assignment from the scene graph hierarchy. Additional heavy
lifting will hopefully come from:

* _[reworkcss]_: parsing a stylesheet into an AST
* _[cssauron]_: tree node matching via selectors

Demo texture maps created by [soady](https://www.facebook.com/soady3D).

[three.js]:https://threejs.org/
[threess]:https://github.com/fluxio/threess/
[reworkcss]:https://github.com/reworkcss/css
[cssauron]:https://github.com/chrisdickinson/cssauron
