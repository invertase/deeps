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
  var output = null;

  for (var key in objectB) {
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
 * @param keys
 * @param parent
 * @param joiner
 * @returns {*}
 * @private
 */
function _valuesChild(object, keys, parent, joiner) {
  for (var key in object) {
    if (isObject(object[key])) _valuesChild(object[key], keys, parent + joiner + key, joiner);
    else keys.push(object[key]);
  }
}

/**
 * Same as Object.keys except deeply
 * @param object
 * @param joiner
 * @returns {{}}
 */
function values(object, joiner) {
  if (!isObject(object)) return null;
  var values = [];
  var _joiner = joiner || '.';

  for (var key in object) {
    if (isObject(object[key])) _valuesChild(object[key], values, key, _joiner);
    else values.push(object[key]);
  }

  return values;
}


/**
 *
 * @param object
 * @param keys
 * @param parent
 * @param joiner
 * @returns {*}
 * @private
 */
function _keysChild(object, keys, parent, joiner) {
  for (var key in object) {
    if (isObject(object[key])) _keysChild(object[key], keys, parent + joiner + key, joiner);
    else keys.push(parent + joiner + key);
  }
}

/**
 * Same as Object.keys except deeply
 * @param object
 * @param joiner
 * @returns {{}}
 */
function keys(object, joiner) {
  if (!isObject(object)) return null;
  var keys = [];
  var _joiner = joiner || '.';

  for (var key in object) {
    if (isObject(object[key])) _keysChild(object[key], keys, key, _joiner);
    else keys.push(key);
  }

  return keys;
}


/**
 *
 * @param object
 * @param stack
 * @param parent
 * @param joiner
 * @returns {*}
 * @private
 */
function _flattenChild(object, stack, parent, joiner) {
  for (var key in object) {
    if (isObject(object[key])) {
      var p = parent + joiner + key;
      _flattenChild(object[key], stack, p, joiner);
    } else {
      stack[parent + joiner + key] = object[key];
    }
  }
  return stack;
}

/**
 * Deeply flattens an object into a 1 level deep object.
 * @param object
 * @param joiner
 * @returns {{}}
 */
function flatten(object, joiner) {
  var _joiner = joiner || '.';
  if (!isObject(object)) return null;

  var stack = {};

  for (var key in object) {
    if (isObject(object[key])) {
      _flattenChild(object[key], stack, key, _joiner);
    } else {
      stack[key] = object[key];
    }
  }

  return stack;
}

/**
 * Unflattens an previously flattened object  back into deep nested object.
 * @param object
 * @param joiner
 * @returns {{}}
 */
function unflatten(object, joiner) {
  var _joiner = joiner || '.';
  if (!isObject(object)) return null;

  var stack = {};

  for (var key in object) {
    if (key.indexOf(_joiner) === -1) stack[key] = object[key];
    else set(stack, key, object[key], true, _joiner);
  }

  return stack;
}


/**
 * Deep get a value from an object.
 * @param object
 * @param path
 * @param joiner
 * @returns {*}
 */
function get(object, path, joiner) {
  var keys = path.split(joiner || '.');

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
 * @param joiner
 */
function set(object, path, value, initPaths, joiner) {
  if (!isObject(object)) return false;
  var keys = path.split(joiner || '.');

  var i = 0;
  var len = keys.length - 1;

  while (i < len) {
    var key = keys[i++];
    if (initPaths && !hasOwnProperty.call(object, key)) object[key] = {};
    object = object[key];
  }

  if (isObject(object) || (Array.isArray(object) && !Number.isNaN(keys[i]))) object[keys[i]] = value;
  else return false;
  return true;
}

/**
 *
 * @param _condition
 * @param mapKey
 * @param _object
 * @param _source
 * @param key
 * @private
 */
function _stringCondition(_condition, mapKey, _object, _source, key) {
  var condition = _condition.split('=');
  var conditionTarget = condition[0];
  var conditionValue = condition[1];
  var notEqual = conditionTarget.indexOf('!') !== -1;
  if (notEqual) conditionTarget = conditionTarget.replace('!', '');

  if (conditionValue) { // value compare condition
    if (notEqual) {
      if (hasOwnProperty.call(_source, conditionTarget) && _source[conditionTarget].toString() !== conditionValue) _object[key] = mapKey;
      else delete _object[key];
    } else {
      if (hasOwnProperty.call(_source, conditionTarget) && _source[conditionTarget].toString() === conditionValue) _object[key] = mapKey;
      else delete _object[key];
    }
  } else { // hasOwnProp condition
    if (hasOwnProperty.call(_source, conditionTarget)) _object[key] = mapKey;
    else delete _object[key];
  }
}

/**
 *
 * @param func
 * @param mapKey
 * @param _object
 * @param flattened
 * @param original
 * @param key
 * @private
 */
function _functionCondition(func, mapKey, _object, flattened, original, key) {
  const result = func(original, flattened, mapKey, key);
  if (result) _object[key] = result === true ? mapKey : result;
  else delete _object[key];
}

/**
 *
 * @param _transformers
 * @param config
 * @param mapKey
 * @param _object
 * @param flattened
 * @param original
 * @param key
 * @private
 */
function _objectCondition(_transformers, config, mapKey, _object, flattened, original, key) {
  if (config.condition) {
    switch (typeof config.condition) {
      case 'string':
        _stringCondition(config.condition, mapKey, _object, flattened, key);
        break;
      case 'function':
        _functionCondition(config.condition, mapKey, _object, flattened, original, key);
        break;
    }
  } else {
    _object[key] = mapKey;
  }

  if (config.transformer && typeof config.transformer === 'function') {
    _transformers[key] = config.transformer;
  }
}
/**
 *
 * @param object
 * @param source
 * @param noUndef
 * @param joiner
 */
function mapToProps(object, source, noUndef, joiner) {
  if (!isObject(object)) return object;
  var key;
  var _joiner = typeof noUndef === 'string' ? noUndef : joiner;
  var _noUndef = typeof noUndef === 'boolean' ? noUndef : true;
  var _object = flatten(object, _joiner);
  var _source = flatten(source, _joiner);
  var _transformers = {};
  var checkForConditions = true;

  while (checkForConditions) {
    var foundCondition = false;

    for (key in _object) {
      var mapValue = _object[key];

      // todo support multiple conditions later on
      if (mapValue instanceof Array) {
        switch (typeof mapValue[0]) {
          case 'string':
            _stringCondition(mapValue[0], mapValue[1], _object, _source, key);
            break;
          case 'function':
            _functionCondition(mapValue[0], mapValue[1], _object, _source, source, key);
            break;
          case 'object':
            _objectCondition(_transformers, mapValue[0], mapValue[1], _object, _source, source, key);
            break;
        }

      }
    }
    _object = flatten(_object, _joiner);
    checkForConditions = foundCondition;
  }

  for (key in _object) {
    var targetKey = _object[key];
    var sourceValue = _source[targetKey];

    if (sourceValue === undefined) {
      sourceValue = get(source, targetKey, _joiner);
    }

    if (_transformers[key]) sourceValue = _transformers[key](sourceValue, key, _source);
    if (_noUndef && sourceValue !== undefined) _object[key] = sourceValue;
    else if (_noUndef) delete _object[key];
    else _object[key] = sourceValue;
  }

  return unflatten(_object, _joiner);
}

/**
 *
 * @param target
 * @param source
 * @returns {*}
 */
function merge(target, source) {
  if (isObject(target) && isObject(source)) {
    for (var key in source) {
      if (isObject(source[key])) {
        if (!target[key]) target[key] = {};
        merge(target[key], source[key]);
      } else {
        const additions = {};
        additions[key] = source[key];
        Object.assign(target, additions);
      }
    }
  }
  return target;
}

module.exports.get = get;
module.exports.set = set;
module.exports.diff = diff;
module.exports.keys = keys;
module.exports.merge = merge;
module.exports.values = values;
module.exports.flatten = flatten;
module.exports.expand = unflatten;
module.exports.collapse = flatten;
module.exports.isObject = isObject;
module.exports.unflatten = unflatten;
module.exports.mapToProps = mapToProps;

// // todo tests for keys, values, unflatten, mapToProps
// const test = unflatten({
//   'a.b.c.d.e.f.g': 1,
//   'a.b.c.d.ff': 2,
//   'a.b.f': true,
//   'a.k.j': 5,
//   abcc: {
//     foo: 'bar'
//   }
// });
//
// console.dir(test);
//
// const mappy = mapToProps({
//   f: 'abcc',
//   1: 'a.b.c.d.e.f.g',
//   2: 'a.b.f',
//   4: 'a.k.j',
//   5: 'a.k.j.k.l.m.n.o',
//   6: {
//     7: [{
//       condition: (original, flattened, targetKey, mapKey) => 'a.b.c.d.ff',
//       transformer: (original, mapKey) => original * 40000,
//     },
//       'a.k.j'
//     ],
//     8: 'a.b.f.b.c.d'
//   },
//   '99': {
//     7: [(src) => 'a.b.c.d.ff', 'a.b.f'],
//     8: ['a.b.f=true', 'a.b.c.d.ff']
//   },
//   1337: ['a.k.j=4', {
//     7: 'a.b.f',
//     8: 'a.b.f.b.c.d'
//   }]
// }, test);
//
// console.dir(mappy);
