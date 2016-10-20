'use strict';

var assert = require('assert');
var deeps = require('../');

var objA = { a: 1, c: { d: 1, e: 3, f: { j: 'k' } }, g: 6 };
var objB = { a: 1, c: { d: 1, e: 6, f: { j: 'm' } }, b: 2, g: '6' };
var expected = { c: { e: 6, f: { j: 'm' } }, b: 2, g: '6' };

describe('diff', function () {
  it('should output a diff for a deeply nested object', function () {
    assert.deepEqual(deeps.diff(objA, objB), expected);
  });

  it('should return null if either arg is not an object', function () {
    assert.equal(deeps.diff(objA, 'nopes'), null);
  });
});
