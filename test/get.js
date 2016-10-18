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
  fooStr: 'foobar',
};

describe('get', function () {
  it('should get an object property by string', function () {
    assert.equal(deeps.get(testy, 'fooStr'), 'foobar');
  });

  it('should get a deeply nested object (even with an array index)', function () {
    assert.equal(deeps.get(testy, 'foo.bar.0.baz.faz'), 'boom');
  });

  it('should return undefined if not found', function () {
    assert.equal(deeps.get(testy, 'fooStrBar.baz'), undefined);
  });
});
