import cssauron from 'cssauron';
import parse from 'css-parse';
import createMaterial from './materials';

let language = cssauron({
  tag: node => (node.isMesh && node.geometry.type) || node.type,
  parent: 'parent',
  children: 'children',
  class: node => node.userData.className || '',
  attr : node => attr => node.hasOwnProperty(attr) ? node[attr] : node.userData[attr]
});

export function getMaterial(style) {
  return createMaterial(style);
}

export function applyStyle(graph, style) {
  let {stylesheet} = parse(style);

  graph.traverse(node => {
    let matchedStyles = [].concat(
      ...stylesheet.rules
        .filter(({type}) => type === 'rule')
        .filter(({selectors}) => language(selectors.join(', '))(node))
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

export function select(graph, query) {
  let selector = language(query),
    matches = [];

  graph.traverse(node => selector(node) && matches.push(node));
  return matches;
}

export default {getMaterial};
