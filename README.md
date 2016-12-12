# threestyle

> What if three.js materials, but CSS?

## Introduction

This module seeks to make it possible to use familiar CSS selectors and style
rule syntax for defining and applying _[three.js]_ materials to scenes.


## Example Usage

We first define a stylesheet with some trivially simple materials. By default a
declaration without a `type` property will use `three.MeshBasicMaterial`.

```css
/* mystyle.three.css */

Mesh {
  color: 'red';
}

.sphere {
  color: 'blue';
}

.transparent {
  transparent: true;
  opacity: 0.5;
}


```

Now we set up a simple scene with a camera, and box and sphere meshes. We also
add some user data to these meshes so that we can specify some style classes.

```js
import three from 'three';

export default scene = new three.Scene();
let camera = new three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000),
  renderer = new three.WebGLRenderer(),
  sphere = new three.Mesh(new three.SphereGeometry(5)),
  box = new three.Mesh(new three.BoxGeometry(5, 5, 5));

camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

sphere.userData.classes = ['sphere', 'transparent'];
sphere.position.set(-5, 0, 0);
box.userData.classes = ['box'];
box.position.set(5, 0, 0);

scene.add(camera, sphere, box);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

```

To bring it all together we import the _threestyle_ library and our stylesheet.
When we attach the stylesheet to the scene the declarations are matched up to
objects in the graph and turned into materials. Additionally, observers are
installed to keep track of changes to the graph that might require updating the
materials.

```js
import threestyle from 'threestyle';
import style from './mystyle.three.css';
import scene from './scene';

threestyle.attach(scene, style);

```

## Acknowledgements

Inspiration for this project comes from [threess] which takes steps towards
separating material assignment from the scene graph hierarchy. Additional heavy
lifting will hopefully come from:

* _[reworkcss]_: parsing a stylesheet into an AST
* _[cssauron]_: tree node matching via selectors


[three.js]:https://threejs.org/
[threess]:https://github.com/fluxio/threess/
[reworkcss]:https://github.com/reworkcss/css
[cssauron]:https://github.com/chrisdickinson/cssauron
