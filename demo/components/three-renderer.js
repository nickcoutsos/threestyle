import Vue from 'vue';
import * as three from 'three';

export default Vue.component('three-renderer', {
  props: ['type', 'camera', 'scene'],

  data: () => ({renderer: null}),

  created() {
    this.renderer = new three[this.type]();
  },

  mounted() {
    this.$el.appendChild(this.renderer.domElement);
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  },

  methods: {
    onResize() {
			this.renderer.domElement.style = {};
			this.renderer.domElement.removeAttribute('width');

			let [width, height] = [this.$el.offsetWidth, this.$el.offsetHeight];
			this.renderer.setSize(width, height);
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderFrame();
    },

    renderFrame() {
      let {scene, camera, renderer} = this;
      renderer.render(scene, camera);
      requestAnimationFrame(() => this.renderFrame());
    }
  },

  render(h) {
    return h('div');
  }
});
