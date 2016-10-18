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

describe('set', function () {
  it('should set an object property by string', function () {
    assert.equal(deeps.set(testy, 'fooStr', 'bazz'), 'bazz');
    assert.equal(deeps.get(testy, 'fooStr'), 'bazz');
  });

  it('should set a deeply nested object (even with an array index)', function () {
    assert.equal(deeps.set(testy, 'foo.bar.0.baz.faz', 'baa'), 'baa');
    assert.equal(deeps.get(testy, 'foo.bar.0.baz.faz'), 'baa');
  });

  it('should return value if not found', function () {
    assert.equal(deeps.set(testy, 'fooStrBar.baz', 'boo'), undefined);
    assert.equal(deeps.get(testy, 'fooStrBar.baz'), undefined);
  });

  it('should create a non existent nested object if initPaths is true', function () {
    assert.equal(deeps.set(testy, 'fooStrBar.bam.boo.meow', 'boo', true), 'boo');
    assert.equal(typeof deeps.get(testy, 'fooStrBar.bam'), 'object');
    assert.equal(typeof deeps.get(testy, 'fooStrBar.bam.boo'), 'object');
    assert.equal(typeof deeps.get(testy, 'fooStrBar.bam.boo.meow'), 'string');
    assert.equal(deeps.get(testy, 'fooStrBar.bam.boo.meow'), 'boo');
  });
});
