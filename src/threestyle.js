import parse from 'css-parse';
import select from './select';
import createMaterial from './materials';
import observe from './observe';

export function getMaterial(style) {
  return createMaterial(style);
}

export function applyStyle(graph, style) {
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
