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
  nopes: undefined,
  nopesToo: false,
  okays: true,
  fooStr: 'foobar',
};

describe('set', function () {
  it('should set an object property by string', function () {
    assert.equal(deeps.set(testy, 'fooStr', 'bazz'), true);
    assert.equal(deeps.get(testy, 'fooStr'), 'bazz');
  });

  it('should set a deeply nested object (even with an array index)', function () {
    assert.equal(deeps.set(testy, 'foo.bar.0.baz.faz', 'baa'), true);
    assert.equal(deeps.get(testy, 'foo.bar.0.baz.faz'), 'baa');
  });

  it('should return false if not found', function () {
    assert.equal(deeps.set(testy, 'fooStrBar.baz', 'boo'), false);
    assert.equal(deeps.get(testy, 'fooStrBar.baz'), undefined);
  });

  it('should return false if not an object', function () {
    assert.equal(deeps.set('foo', 'fooStrBar.baz', 'boo'), false);
  });

  it('should return false if its not an object and cant have a property set', function () {
    assert.equal(deeps.set(testy, 'nopes.woops', 'boo'), false);
    assert.equal(deeps.set(testy, 'nopesToo.woops', 'boo'), false);
    assert.equal(deeps.set(testy, 'okays.woops', 'boo'), false);
  });

  it('should create a non existent nested object if initPaths is true', function () {
    assert.equal(deeps.set(testy, 'fooStrBar.bam.boo.meow', 'boo', true), true);
    assert.equal(typeof deeps.get(testy, 'fooStrBar.bam'), 'object');
    assert.equal(typeof deeps.get(testy, 'fooStrBar.bam.boo'), 'object');
    assert.equal(typeof deeps.get(testy, 'fooStrBar.bam.boo.meow'), 'string');
    assert.equal(deeps.get(testy, 'fooStrBar.bam.boo.meow'), 'boo');
  });
});
