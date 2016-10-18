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

console.log('\r\n');
require('./print');
console.log('\r\n');


suite
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
