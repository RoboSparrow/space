/* global SPACE */

'use strict';

// !commonJS
var vm = require('vm');
var fs = require('fs');
var script = fs.readFileSync('./src/Point.js');
vm.runInThisContext(script);

var assert = require('assert');

describe('new SPACE.Point.Cartesian conversions', function() {

  it('should convert between cartesian and spherical (maintain: 1)', function() {
    var cP = new SPACE.Point.Cartesian(1, 1, 1);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();

    assert.strictEqual(cP1.x, cP.x);
    assert.strictEqual(cP1.y, cP.y);
    assert.strictEqual(cP1.z, cP.z);
  });

  it('should convert between cartesian and spherical (maintain: 0)', function() {
    var cP = new SPACE.Point.Cartesian(0, 0, 0);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();

    assert.strictEqual(cP1.x, cP.x);
    assert.strictEqual(cP1.y, cP.y);
    assert.strictEqual(cP1.z, cP.z);
  });

  it('should convert between cartesian and spherical (maintain: float)', function() {
    var cP = new SPACE.Point.Cartesian(22.22, 33.33, 44.44);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();

    assert.strictEqual(cP1.x, cP.x);
    assert.strictEqual(cP1.y, cP.y);
    assert.strictEqual(cP1.z, cP.z);
  });

  it('should convert between cartesian and spherical (maintain: negative)', function() {
    var cP = new SPACE.Point.Cartesian(-22.22, -33.33, -44.44);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();

    assert.strictEqual(cP1.x, cP.x);
    assert.strictEqual(cP1.y, cP.y);
    assert.strictEqual(cP1.z, cP.z);
  });

});

describe('new SPACE.Point.Cartesian operations', function() {

  it('should create an independent clone', function() {
    var p = new SPACE.Point.Cartesian(5, 5, 5);
    var clone = p.clone();

    assert.strictEqual(p.x, clone.x);
    assert.strictEqual(p.y, clone.y);
    assert.strictEqual(p.z, clone.z);

    clone.y = 0;
    assert.notStrictEqual(p.y, clone.y);
  });

  it('should add points without mutationg the second point', function() {
    var p1 = new SPACE.Point.Cartesian(5, 5, 5);
    var p2 = new SPACE.Point.Cartesian(5, 10, 20);
    p1.add(p2);

    assert.strictEqual(p1.x, 10);
    assert.strictEqual(p1.y, 15);
    assert.strictEqual(p1.z, 25);

    assert.strictEqual(p2.x, 5);
    assert.strictEqual(p2.y, 10);
    assert.strictEqual(p2.z, 20);
  });

  it('should substract without mutationg the second point', function() {
    var p1 = new SPACE.Point.Cartesian(5, 5, 5);
    var p2 = new SPACE.Point.Cartesian(5, 10, 20);
    p1.substract(p2);

    assert.strictEqual(p1.x, 0);
    assert.strictEqual(p1.y, -5);
    assert.strictEqual(p1.z, -15);

    assert.strictEqual(p2.x, 5);
    assert.strictEqual(p2.y, 10);
    assert.strictEqual(p2.z, 20);
  });

});

describe('new SPACE.Point.Spherical conversions', function() {

  it('should convert between spherical and cartesian (maintain: 1)', function() {
    var sP = new SPACE.Point.Spherical(1, 1, 1);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();

    assert.strictEqual(sP1.x, sP.x);
    assert.strictEqual(sP1.y, sP.y);
    assert.strictEqual(sP1.z, sP.z);
  });

  it('should convert between spherical and cartesian (maintain: 0)', function() {
    var sP = new SPACE.Point.Spherical(0, 0, 0);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();

    assert.strictEqual(sP1.x, sP.x);
    assert.strictEqual(sP1.y, sP.y);
    assert.strictEqual(sP1.z, sP.z);
  });

  it('should convert between spherical and cartesian (maintain: float)', function() {
    var sP = new SPACE.Point.Spherical(22.22, Math.Pi/2,  Math.Pi/2);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();

    assert.strictEqual(sP1.x, sP.x);
    assert.strictEqual(sP1.y, sP.y);
    assert.strictEqual(sP1.z, sP.z);
  });

  it('should convert between spherical and cartesian (maintain: negative)', function() {
    var sP = new SPACE.Point.Spherical(-22.22, -Math.Pi/2, -Math.Pi/2);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();

    assert.strictEqual(sP1.x, sP.x);
    assert.strictEqual(sP1.y, sP.y);
    assert.strictEqual(sP1.z, sP.z);
  });

});
