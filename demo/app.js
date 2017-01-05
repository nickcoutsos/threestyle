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
    styleCode: defaultStyle,
    sceneBuilder: () => {},
    style: defaultStyle
  },

  created() {
    this.camera.position.set(15, 15, 15);
    this.camera.lookAt(new three.Vector3(0, 0, 0));
  },

  mounted() {
    this.updateScene(this.sceneCode);
  },

  methods: {
    updateScene: debounce(function(sceneCode) {
      try {
        let func = new Function('three', 'scene', `"use strict";\n${sceneCode}`),
          builder = () => {
            let scene = new three.Scene();
            func(three, scene);
            return scene;
          };

        builder();
        this.sceneBuilder = builder;
      }
      catch (e) {
        console.error('Exception in scene code, could not update');
        console.error(e);
      }
    }, 200),

    updateStyle: debounce(function(style) {
      // TODO: validate style code
      this.style = style;
    }, 200),


    refresh() {
      let scene = this.sceneBuilder();
      applyStyle(scene, {style: this.style, update: 'node'});

      scene.add(this.camera);
      this.scene = scene;
    }
  },

  watch: {
    sceneBuilder() {
      this.refresh();
    },

    style() {
      this.refresh();
    }
  }
});
