import Vue from 'vue';

export default Vue.component('resizable-panel', {
  props: ['flow'],

  methods: {
    onResize(a, b, {deltaX, deltaY}) {
      let dimension = this.flow === 'horizontal' ? 'offsetWidth' : 'offsetHeight',
        totalSize = a.elm[dimension] + b.elm[dimension],
        totalGrow = Number(a.elm.style.flexGrow) + Number(b.elm.style.flexGrow),
        delta = this.flow === 'horizontal' ? deltaX : deltaY,
        change = (delta / totalSize) * totalGrow;

      if (change === 0) {
        return;
      }

      a.elm.style.flexGrow = Number(a.elm.style['flex-grow']) + change;
      b.elm.style.flexGrow = Number(b.elm.style['flex-grow']) - change;

      this.$emit('resize');
    }
  },

  mounted() {
    this.$slots.default
      .filter(({tag}) => tag !== undefined)
      .forEach(
        ({elm}) => elm.style.flexGrow = Number(getComputedStyle(elm).flexGrow || 1)
      );
  },

  render(h) {
    let children = this.$slots.default.filter(node => node.tag !== undefined),
      {flow} = this;

    return h('div', {class: `resizable-container resize-${flow}`}, [].concat(
      children[0],
      ...[].concat(
        ...children.slice(1).map((node, i) => ([
          h('resize-widget', {
            props: {flow},
            on: {
              resize: delta => this.onResize(...children.slice(i, i + 2), delta),
              resizeStart: () => children.slice(i, i + 2).forEach(({elm}) => elm.classList.add('resizing')),
              resizeStop: () => children.slice(i, i + 2).forEach(({elm}) => elm.classList.remove('resizing'))
            }
          }),
          node
        ]))
      )
    ));
  }
});


Vue.component('resize-widget', {
  data: () => ({ lastPosition: null }),

  methods: {
    startHandler(e) {
      e.preventDefault();
      window.addEventListener('mousemove', this.moveHandler);
      window.addEventListener('mouseup', this.endHandler);
      window.addEventListener('touchmove', this.moveHandler);
      window.addEventListener('touchend', this.endHandler);

      this.lastPosition = {
        clientX: e.clientX,
        clientY: e.clientY
      };

      this.$emit('resizeStart');
    },

    moveHandler(e) {
      let {clientX, clientY} = e.type === 'touchmove' ? e.touches[0] : e,
        delta = {
          deltaX: clientX - this.lastPosition.clientX,
          deltaY: clientY - this.lastPosition.clientY
        };

      this.$emit('resize', delta);
      this.lastPosition = {clientX, clientY};
    },

    endHandler() {
      window.removeEventListener('touchmove', this.moveHandler);
      window.removeEventListener('mousemove', this.moveHandler);
      window.removeEventListener('touchend', this.endHandler);
      window.removeEventListener('mouseup', this.endHandler);

      this.$emit('resizeStop');
    },
  },

  render(h) {
    return h('div', {
      class: `resize-widget`,
      on: {
        mousedown: this.startHandler,
        touchstart: this.startHandler
      }
    });
  }
})
