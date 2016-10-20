'use strict';

var assert = require('assert');
var deeps = require('../');

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
  foos: {
    bars: {
      bazs: 'potato',
      'escape.me': '1234',
    }
  },
  'fosos.barrzas': 1234,
  fooStr: 'foobar',
};

describe('flatten', function () {
  it('should flatten a deeply nested object', function () {
    assert.equal(deeps.flatten(testy)['foo.bar'][0].baz.faz, 'boom');
    assert.equal(deeps.flatten(testy)['foos.bars.bazs'], 'potato');
  });

  it('should return null if not an object', function () {
    assert.equal(deeps.flatten('abc'), null);
  });
});
