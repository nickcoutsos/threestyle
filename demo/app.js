import debounce from 'debounce';
import Vue from 'vue';
import * as three from 'three';

import {applyStyle} from '../src/threestyle';
import './components/codemirror-editor';
import './components/three-renderer';
import './threestyle-mode';

import defaultScene from '!raw-loader!./default-scene.js';
import defaultStyle from '!raw-loader!./default-style.three.css';

new Vue({
  el: '#app',
  data: {
    scene: new three.Scene(),
    camera: new three.PerspectiveCamera(70, 1, 1, 1000),
    sceneCode: defaultScene,
    styleCode: defaultStyle
  },

  created() {
    this.camera.position.set(15, 15, 15);
    this.camera.lookAt(new three.Vector3(0, 0, 0));
  },

  methods: {
    updateScene: debounce(function(sceneCode) {
      let scene = new three.Scene();
      try {
        new Function('three', 'scene', `"use strict";\n${sceneCode}`)(three, scene);
        this.scene.remove(this.camera);
        this.scene = scene;
      }
      catch (e) {
        console.error('Exception in scene code, could not update');
        console.error(e);
      }
    }, 200),

    updateStyle: debounce(function(styleCode) {
      // TODO: validate style code

      applyStyle(this.scene, styleCode);
    }, 200)
  },

  watches: {
    scene() {
      this.scene.add(this.camera);
    }
  }
});
