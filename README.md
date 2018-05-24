# deeps

[![Coverage Status](https://coveralls.io/repos/github/Salakar/deeps/badge.svg?branch=master)](https://coveralls.io/github/Salakar/deeps?branch=master)
[![build](https://travis-ci.org/Salakar/deeps.svg)](https://travis-ci.org/Salakar/deeps)
[![npm version](https://img.shields.io/npm/v/deeps.svg)](https://www.npmjs.com/package/deeps)
[![License](https://img.shields.io/npm/l/deeps.svg)](/LICENSE)
<a href="https://twitter.com/mikediarmid"><img src="https://img.shields.io/twitter/follow/mikediarmid.svg?style=social&label=Follow" alt="Follow on Twitter"></a>



High performance utilities for dealing with nested objects.

#### get (object, path, joiner)

Deep gets an object property value.

```js
const obj = {
  some: {
    deep: {
      prop: 'foobar',
    },
  },
};

const prop = deeps.get(obj, 'some.deep.prop'); // foobar
const prop = deeps.get(obj, 'some.deep.key'); // undefined
```

#### set (object, path, value, initPaths, joiner)

Deep sets an object property value.

```js
const obj = {
  some: {
    deep: {
      prop: 'foobar',
    },
  },
};

deeps.set(obj, 'some.deep.prop', 'barbaz');
```

#### keys (object, joiner)

Same as Object.keys except deeply.

```js
const obj = {
  some: {
    deep: {
      prop: 'foobar',
      key: 'barbaz',
    },
  },
};

const keys = deeps.keys(object); // ['some.deep.prop', 'some.deep.key']
```

#### diff (objectA, objectB)

Returns an object of differences between to objects.

```js
const obj1 = {
  a: 1,
  b: 3,
};

const obj2 = {
  a: 2,
  b: 3,
};

const diff = deeps.keys(obj1, obj2); // { a: 2 }
```

#### merge (target, source)

Same as Object.assign but deeply.

```js
const target = {
  a: 1,
  b: {
    c: 2,
  },
};
const source = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
};

deeps.merge(target, source);
// target = { a: 1, b: { c: 2, d: 3 } }
```

#### values (object, joiner)

```js
const object = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
};

deeps.values(object); // [1, 2, 3]
```

#### flatten (object, joiner)

Flattens an object to an object of key paths with the values

```js
const object = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
      f: 4
    },
  },
};

const flatten = deeps.flatten(object);

// flatten:
{
  'a': 1,
  'b.c': 2,
  'b.d.e': 3,
  'b.d.f': 4,
}

```

#### unflatten

Unflattens an object of key paths (reverse flatten)

```js
const object = {
  'a': 1,
  'b.c': 2,
  'b.d.e': 3,
  'b.d.f': 4,
}

const unflatten = deeps.unflatten(object);

// unflatten:
{
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
      f: 4,
    },
  },
};
```

#### mapToProps

TODO

### Why?

I've been using these utils a lot in personal projects so made sense to move them into a module. (and I wanted to make them more efficient ;p)

## Benchmarks
    Platform info:
    Darwin 15.6.0 x64
    Node.JS 6.8.1
    V8 5.1.281.84
    Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz × 8



    DIFF: deeply nested object x 1,305,372 ops/sec ±1.73% (89 runs sampled)
    FLATTEN: deeply nested with array x 1,574,470 ops/sec ±1.57% (87 runs sampled)
    GET: single depth x 10,753,107 ops/sec ±0.90% (92 runs sampled)
    GET: deeply nested with array x 6,302,773 ops/sec ±1.72% (89 runs sampled)
    SET: single depth x 7,480,487 ops/sec ±1.91% (84 runs sampled)
    SET: deeply nested with array x 6,010,088 ops/sec ±0.91% (93 runs sampled)

