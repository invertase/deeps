'use strict';

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
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var get = require('./../').get;
var set = require('./../').set;
var flatten = require('./../').flatten;
var diff = require('./../').diff;

console.log('\r\n');
require('./print');
console.log('\r\n');

var objA = { a: 1, c: { d: 1, e: 3, f: { j: 'k' } }, g: 6 };
var objB = { a: 1, c: { d: 1, e: 6, f: { j: 'm' } }, b: 2, g: '6' };

suite
  .add('DIFF: deeply nested object', function () {
    return diff(objA, objB);
  })

  .add('FLATTEN: deeply nested with array', function () {
    return flatten(testy);
  })
  .add('GET: single depth', function () {
    return get(testy, 'fooStr');
  })
  .add('GET: deeply nested with array', function () {
    return get(testy, 'foo.bar.0.baz.faz');
  })
  .add('SET: single depth', function () {
    return set(testy, 'fooStr', 'baz');
  })
  .add('SET: deeply nested with array', function () {
    return set(testy, 'foo.bar.0.baz.faz', 'VROOM');
  })
  .on('cycle', function (e) {
    console.log('' + e.target);
  })
  .run();
