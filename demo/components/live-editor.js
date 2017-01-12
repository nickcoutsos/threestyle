import Vue from 'vue';
import CodeMirrorEditor from './codemirror-editor';

const icon = (h, name) => h('i', {class: `fa fa-${name}`});

export default Vue.component('live-editor', {
  props: ['title', 'mode', 'value'],
  data: () => ({
    autoUpdate: true,
    value_: null
  }),

  created() {
    this.value_ = this.value;
  },

  methods: {
    onToggleAutoUpdate() {
      this.autoUpdate = !this.autoUpdate;
    },

    onChange(e) {
      this.value_ = e;
      if (this.autoUpdate) {
        this.$emit('change', e);
      }
    },

    onUpdate() {
      this.$emit('change', this.value_);
    },

    onReset() {
      this.value_ = this.value;
    }
  },

  render(h) {
    let {title, mode, autoUpdate} = this;

    return h('div', [
      h('h2', title),
      h('div', {class: 'buttons'}, [
        h('button', {on: {click: this.onReset}}, [
          icon(h, 'undo'),
          'Reset'
        ]),

        !autoUpdate && h('button', {
          on: {click: this.onUpdate},
          key: 'update'
        }, [
          icon(h, 'play'),
          'Update'
        ]),

        h('button', {
          on: {click: this.onToggleAutoUpdate}
        }, [
          icon(h, `toggle-${autoUpdate ? 'on' : 'off'}`),
          'Auto-update'
        ]),
      ]),
      h(CodeMirrorEditor, {
        class: 'editor',
        props: {mode, value: this.value_},
        on: {change: this.onChange}
      })
    ])
  }
})
