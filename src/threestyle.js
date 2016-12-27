import parse from 'css-parse';
import select from './select';
import createMaterial from './materials';
import observe from './observe';


var _lastId = 0;
var _cachedMaterials = {};

const NON_COMMENT_NODE = ({type}) => type !== 'comment';

/**
 * Get a material instance made up of the declarations in the given rules.
 *
 * Materials are cached as they are created. A call with the same set of rules
 * is just a lookup.
 *
 * @param {Array<Object>} rules - an array of rules from a CSS syntax tree.
 * @returns {three.Material} material
 */
export function getMaterial(rules) {
  let key = rules.map(({id}) => id).join(':');

  if (!_cachedMaterials[key]) {
    _cachedMaterials[key] = createMaterial(
      [].concat(...rules.map(({declarations}) => declarations.filter(NON_COMMENT_NODE)))
        .reduce((style, {property, value}) => (style[property] = value, style), {})
    );
  }

  return _cachedMaterials[key];
}


/**
 * Search the document for `style` and `link[rel="stylesheet"]` tags.
 *
 * @returns {Promise} - resolves with the string contents of any embedded or
 *  linked styles concatenated in the order of their appearance.
 */
export function loadStyles() {
  let sources = [].slice.call(
    document.querySelectorAll([
      'head link[type="text/threejs+css"]',
      'head style[type="text/threejs+css"]'
    ])
  );

  return Promise.all(
    sources.map(source => {
      // embedded styles can resolve right away
      if (source.tagName === 'STYLE') {
        return Promise.resolve(source.textContent);
      }

      // linked styles must be fetched asynchronously
      return fetch(source.href)
        .then(res => {
          if (!res.ok) throw Object.assign(new Error(res.statusText), {res});
          return res.text();
        })
    })
  ).then(styles => styles.join('\n'));
}


/**
 * Apply a material stylesheet to the given scene graph.
 *
 * Stylesheet may be given as a string or omitted to automatically find <style>
 * nodes in the document head with the "text/threejs+css" mimetype.
 *
 * The graph will be monitored for changes to re-apply styles as needed.
 *
 * @param {three.Object3D} graph - the "root" of a hierarchy. Not necessarily a scene object.
 * @param {String|Object} [options={}] - string contents of a stylesheet, an options object
 * @param {String} [options.style=undefined] - a specific set of styles or else whatever appropriate styles can be found in the document.
 */
export function applyStyle(graph, options={}) {
  let {style} = options,
    load = style !== undefined
      ? Promise.resolve(style)
      : loadStyles();

  return load.then(style => {
    if (!style) {
      console.warn('No styles provided or found in document.');
      return;
    }

    let {stylesheet} = parse(style);
    stylesheet.rules = stylesheet.rules.filter(NON_COMMENT_NODE)
    stylesheet.rules.forEach(rule => rule.id = rule.id || ++_lastId);

    updateStyle(graph, stylesheet.rules);
    observe(graph, ['name', 'userData']);
    graph.addEventListener('childUpdated', () => updateStyle(graph, stylesheet.rules));
  });
}


/**
 * Update the materials assigned to nodes in the given graph as necessary.
 *
 * @param {three.Object3D} graph
 * @param {Array<Object>} rules - a set of available rules to match to the graph's nodes
 */
export function updateStyle(graph, rules) {
  graph.traverse(node => {
    let matchedRules = rules.filter(
      ({selectors}) => select(selectors.join(', '))(node)
    );

    if (matchedRules.length > 0) {
      node.material = getMaterial(matchedRules);
    }
  });
}

export default {getMaterial};
