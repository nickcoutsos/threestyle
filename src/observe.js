/**
 * Observe changes to trees of three.Object3D to trigger related updates.
 *
 * Primarily the add/remove methods need to be wrapped to be able to propagate
 * change events from child nodes up to the top of the observed graph. Beyond
 * these structural changes it may also be necessary to observe other properties
 * as deemed relevant to the application.
 *
 */


/**
 * Create a proxy of a given object to detect changes to some/all properties.
 *
 * @param {Object} object
 * @param {Array<String>|null} props - specific properties to watch (or else all)
 * @param {Function} callback - called with (property, oldValue, newValue)
 * @returns {Proxy<Object>} - the wrapped object
 */
function proxyChangeHandler(object, props, callback) {
  let proxy = new Proxy(object, {
    set(target, property, value) {
      if (!props || props.indexOf(property) !== -1) {
        if (value instanceof Object) {
          value = proxyChangeHandler(value, null, callback);
        }

        callback(property, target[property], value);
      }

      target[property] = value;
      return true;
    }
  });

  props && props.forEach(property => {
    let value = object[property];
    if (!(value instanceof Object)) return;
    object[property] = proxyChangeHandler(value, null, callback);
  })

  return proxy;
}



/**
 * Observe changes to a node and its children.
 *
 * @param {three.Object3D} node - an object (and its children) to observe
 * @param {Array<String>} properties - an array of properties to observe
 * @returns {Proxy<three.Object3D>}
 */
export default function observe(node, properties) {
  let proxy = proxyChangeHandler(
    node, properties,
    (property, original, value) => {
      node.dispatchEvent({type: 'propertyChanged', property, original, value});
    }
  );

  let originalAdd = node.add.bind(node);
  let listener = event => {
    node.dispatchEvent({
      type: 'childUpdated',
      context: event.context || event.target
    });
  };

  /**
   * Manage listeners for propagating change events from a node's children.
   *
   * @param {three.Object3D} child
   */
  function propagateChangeEvents(child) {
    child.addEventListener('propertyChanged', listener);
    child.addEventListener('childUpdated', listener);
    child.addEventListener('removed', event => {
      child.removeEventListener('propertyChanged', listener);
      child.removeEventListener('childUpdated', listener);
      listener(event);
    });
  }

  node.children = node.children.map(child => observe(child, properties));
  node.children.forEach(propagateChangeEvents);
  node.add = (...children) => {
    children.forEach(propagateChangeEvents);
    originalAdd(...children.map(child => observe(child, properties)));
  };

  return proxy;
}
