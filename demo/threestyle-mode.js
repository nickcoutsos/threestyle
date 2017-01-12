import CodeMirror from 'codemirror';
import {PROPERTIES} from '../src/materials';

let cssMode = CodeMirror.resolveMode('text/css');

// Define a mimeSpec for our "custom" CSS properties and add them to
// CodeMirror's CSS mode so that they don't appear as errors in the editor's
// syntax highlighting.
CodeMirror.defineMIME(
  'text/threejs+css',
  Object.assign({}, cssMode, {
    name: 'css', helperType: 'threestyle',
    propertyKeywords: Object.assign(
      {},
      cssMode.propertyKeywords,
      Object.keys(PROPERTIES)
        .map(key => key.toLowerCase())
        .reduce((map, key) => (map[key.toLowerCase()] = true, map), {})
    )
  })
);
