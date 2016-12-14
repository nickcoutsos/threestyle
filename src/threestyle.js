import createMaterial from './materials';

export function getMaterial(style) {
  return createMaterial(style);
}

export {createMaterial};

export default {getMaterial};
