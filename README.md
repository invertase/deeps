# deeps

[![Coverage Status](https://coveralls.io/repos/github/Salakar/deeps/badge.svg?branch=master)](https://coveralls.io/github/Salakar/deeps?branch=master)
[![build](https://travis-ci.org/Salakar/deeps.svg)](https://travis-ci.org/Salakar/deeps)
[![npm version](https://img.shields.io/npm/v/deeps.svg)](https://www.npmjs.com/package/deeps)
[![License](https://img.shields.io/npm/l/deeps.svg)](/LICENSE)


High performance utilities for dealing with nested objects.

#### get
#### set
#### diff
#### flatten
#### merge

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

