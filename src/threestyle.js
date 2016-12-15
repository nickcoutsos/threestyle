import parse from 'css-parse';
import select from './select';
import createMaterial from './materials';
import observe from './observe';

export function getMaterial(style) {
  return createMaterial(style);
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
 * @param {String} [style=undefined] - a specific set of styles or else whatever appropriate styles are found in the document.
 */
export function applyStyle(graph, style) {
  if (style === undefined) {
    let styles = [].slice.call(document.head.querySelectorAll('style[type="text/threejs+css"]'));
    if (styles.length === 0) {
      console.warn('No styles provided and none found in document.');
      return;
    }

    style = styles
      .map(style => style.textContent)
      .join('\n');
  }

  updateStyle(graph, style);
  observe(graph, ['name', 'userData']);
  graph.addEventListener('childUpdated', () => updateStyle(graph, style));
}

export function updateStyle(graph, style) {
  let {stylesheet} = parse(style);
  graph.traverse(node => {
    let matchedStyles = [].concat(
      ...stylesheet.rules
        .filter(({type}) => type === 'rule')
        .filter(({selectors}) => select(selectors.join(', '))(node))
        .map(({declarations}) =>
          declarations.map(({property, value}) => ({[property]: value}))
        )
    );

    if (matchedStyles.length) {
      node.material = getMaterial(
        Object.assign({}, ...matchedStyles)
      );
    }
  });
}

export default {getMaterial};
