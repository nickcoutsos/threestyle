import Vue from 'vue';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

export default Vue.component('codemirror-editor', {
	props: ['mode', 'value'],
	data: () => ({value: null}),

	mounted() {
    let textarea = this.$el.querySelector('textarea');
    let config = {
      mode: this.mode,
      theme: 'material',
      lineNumbers: true,
      value: this.value || '',
    };

    this.instance = CodeMirror(editor => this.$el.replaceChild(editor, textarea), config);
    this.instance.on('change', instance => {
      this.$emit('change', instance.getValue())
    });
	},

	watch: {
		value() {
			if (this.instance.getValue() !== this.value) {
				this.instance.setValue(this.value);
			}
		}
	},

	render(h) {
    let props = {};
    if (this.name) {
      props.name = this.name;
    }

		return h('div', props, [h('textarea')]);
	}
});
