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

    if (aProp !== bProp && !isObject(aProp) && !isObject(bProp)) {
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
function _flattenChild(object, stack, parent) {
  var i = 0;
  var keys = Object.keys(object);
  var len = keys.length;

  while (i < len) {
    var key = keys[i++];
    if (isObject(object[key])) {
      var p = parent + '.' + key;
      _flattenChild(object[key], stack, p);
    } else {
      var escaped = key.indexOf('.') > -1 ? key.replace(/\./g, '\\\.') : key;
      stack[parent + '.' + escaped] = object[key];
    }
  }

  return stack;
}

/**
 * Deeply flattens an object into a 1 level deep object.
 * @param object
 * @returns {{}}
 */
function flatten(object) {
  if (!isObject(object)) return null;

  var i = 0;
  var stack = {};
  var keys = Object.keys(object);
  var len = keys.length;

  while (i < len) {
    var key = keys[i++];
    var escaped = key.indexOf('.') > -1 ? key.replace(/\./g, '\\\.') : key;
    if (isObject(object[key])) {
      _flattenChild(object[key], stack, escaped);
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
  if (!isObject(object)) return false;
  var keys = path.split('.');

  var i = 0;
  var len = keys.length - 1;

  while (i < len) {
    var key = keys[i++];
    if (initPaths && !hasOwnProperty.call(object, key)) object[key] = {};
    object = object[key];
  }

  if (isObject(object)) object[keys[i]] = value;
  else return false;
  return true;

}

module.exports.get = get;
module.exports.set = set;
module.exports.diff = diff;
module.exports.flatten = flatten;
module.exports.isObject = isObject;
