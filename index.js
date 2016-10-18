'use strict';

var hasOwnProperty = Object.hasOwnProperty;

/**
 *
 * @param item
 * @returns {*|boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

/**
 *
 * @param objectA
 * @param objectB
 * @returns {*}
 */
function diff(objectA, objectB) {
  if (!isObject(objectA) || !isObject(objectB)) return null;
  var i = 0;
  var output = null;
  var keys = Object.keys(objectB);
  var len = keys.length;

  while (i < len) {
    var key = keys[i++];
    var aProp = objectA[key];
    var bProp = objectB[key];

    if (aProp !== bProp) {
      if (!output) output = {};
      output[key] = bProp;
    } else if (isObject(aProp) && isObject(bProp)) {
      var deepObjDif = diff(aProp, bProp);
      if (deepObjDif) {
        if (!output) output = {};
        output[key] = deepObjDif;
      }
    }
  }

  return output;
}

/**
 *
 * @param object
 * @param stack
 * @param parent
 * @param intermediate
 * @returns {*}
 * @private
 */
function _flattenChild(object, stack, parent, intermediate) {
  if (!isObject(object)) return {};

  var i = 0;
  var keys = Object.keys(object);
  var len = keys.length;

  while (i < len) {
    var key = keys[i++];
    var escaped = key.replace(/\./g, '\\\.');
    if (isObject(object[key])) {
      var p = parent + '.' + key;
      if (intermediate) stack[p] = object[key];
      _flattenChild(object[key], stack, p, intermediate);
    } else {
      stack[parent + '.' + escaped] = object[key];
    }
  }

  return stack;
}

/**
 * Deeply flattens an object into a 1 level deep object.
 * @param object
 * @param intermediate
 * @returns {{}}
 */
function flatten(object, intermediate) {
  if (!isObject(object)) return {};

  var i = 0;
  var stack = {};
  var keys = Object.keys(object);
  var len = keys.length;

  while (i < len) {
    var key = keys[i++];
    var escaped = key.replace(/\./g, '\\\.');
    if (isObject(object[key])) {
      if (intermediate) stack[escaped] = object[key];
      _flattenChild(object[key], stack, escaped, intermediate);
    } else {
      stack[escaped] = object[key];
    }
  }

  return stack;
}


/**
 * Deep get a value from an object.
 * @param object
 * @param path
 * @returns {*}
 */
function get(object, path) {
  var keys = path.split('.');

  var i = 0;
  var tmp = object;
  var len = keys.length;

  while (i < len) {
    var key = keys[i++];
    if (!tmp || !hasOwnProperty.call(tmp, key)) {
      return tmp = undefined;
    }
    tmp = tmp[key];
  }

  return tmp;
}

/**
 * Deep set a value
 * @param object
 * @param path
 * @param value
 * @param initPaths
 */
function set(object, path, value, initPaths) {
  var keys = path.split('.');

  var i = 0;
  var len = keys.length - 1;

  while (i < len) {
    var key = keys[i++];
    if (!object) return object;
    if (initPaths && !hasOwnProperty.call(object, key)) object[key] = {};
    object = object[key];
  }

  if (object) object[keys[i]] = value;
  else return undefined;
  return value;

}

if (typeof module !== 'undefined') {
  module.exports.get = get;
  module.exports.set = set;
  module.exports.flatten = flatten;
  module.exports.isObject = isObject;
} else {
  // d8 --trace-opt --trace-deopt index.js
  var i = 0;
  var testy = {
    foo: {
      bar: [
        {
          baz: {
            faz: 'boom',
          }
        }
      ]
    },
    fooStr: 'foobar',
  };

  while (i++ < 10000) {
    get(testy, 'fooStr');
    get(testy, 'foo.bar.0.baz.faz');
    set(testy, 'foogStr.bfb.ss.dfsdf.hfrnbere.ren.erner.erb.rb', '11111', true);
    set(testy, 'foogaStr.bfb.ss.dfsdf.hfrnbere.ren.erner.erb.rb', '11111');
    flatten(testy);
  }
}
