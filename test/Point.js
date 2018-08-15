/* global Space */

'use strict';

import Space from '../src/Space';
import assert from 'assert';

describe('new Space.Point.Cartesian conversions', function() {

    it('should convert between cartesian and spherical (maintain: 1)', function() {
        var cP = new Space.Point.Cartesian(1, 1, 1);
        var sP = cP.toSpherical();
        var cP1 = sP.toCartesian();

        assert.strictEqual(Number(cP1.x.toFixed(3)), cP.x);
        assert.strictEqual(Number(cP1.y.toFixed(3)), cP.y);
        assert.strictEqual(Number(cP1.z.toFixed(3)), cP.z);
    });

    it('should convert between cartesian and spherical (maintain: 0)', function() {
        var cP = new Space.Point.Cartesian(0, 0, 0);
        var sP = cP.toSpherical();
        var cP1 = sP.toCartesian();

        assert.strictEqual(Number(cP1.x.toFixed(3)), cP.x);
        assert.strictEqual(Number(cP1.y.toFixed(3)), cP.y);
        assert.strictEqual(Number(cP1.z.toFixed(3)), cP.z);
    });

    it('should convert between cartesian and spherical (maintain: float)', function() {
        var cP = new Space.Point.Cartesian(22.229, 33.339, 44.449);
        var sP = cP.toSpherical();
        var cP1 = sP.toCartesian();

        assert.strictEqual(Number(cP1.x.toFixed(3)), cP.x);
        assert.strictEqual(Number(cP1.y.toFixed(3)), cP.y);
        assert.strictEqual(Number(cP1.z.toFixed(3)), cP.z);
    });

    it('should convert between cartesian and spherical (maintain: negative)', function() {
        var cP = new Space.Point.Cartesian(-22.229, -33.339, -44.449);
        var sP = cP.toSpherical();
        var cP1 = sP.toCartesian();

        assert.strictEqual(Number(cP1.x.toFixed(3)), cP.x);
        assert.strictEqual(Number(cP1.y.toFixed(3)), cP.y);
        assert.strictEqual(Number(cP1.z.toFixed(3)), cP.z);
    });

});

describe('new Space.Point.Cartesian operations', function() {

    it('clone() creates new instance', function() {
        var p = new Space.Point.Cartesian(5, 5, 5);
        var clone = p.clone();

        assert.strictEqual(p.x, clone.x);
        assert.strictEqual(p.y, clone.y);
        assert.strictEqual(p.z, clone.z);

        clone.y = 0;
        assert.notStrictEqual(p.y, clone.y);
    });

    it('add() without mutating the reference point', function() {
        var p1 = new Space.Point.Cartesian(5, 5, 5);
        var p2 = new Space.Point.Cartesian(5, 10, 20);
        p1.add(p2);

        assert.strictEqual(p1.x, 10);
        assert.strictEqual(p1.y, 15);
        assert.strictEqual(p1.z, 25);

        assert.strictEqual(p2.x, 5);
        assert.strictEqual(p2.y, 10);
        assert.strictEqual(p2.z, 20);
    });

    it('substract() without mutating the reference point', function() {
        var p1 = new Space.Point.Cartesian(5, 5, 5);
        var p2 = new Space.Point.Cartesian(5, 10, 20);
        p1.substract(p2);

        assert.strictEqual(p1.x, 0);
        assert.strictEqual(p1.y, -5);
        assert.strictEqual(p1.z, -15);

        assert.strictEqual(p2.x, 5);
        assert.strictEqual(p2.y, 10);
        assert.strictEqual(p2.z, 20);
    });

    it('equals(): true', function() {
        var p1 = new Space.Point.Cartesian(5, 5, 5);
        var p2 = new Space.Point.Cartesian(5, 5, 5);

        assert.strictEqual(p1.equals(p2), true);
        assert.strictEqual(p2.equals(p1), true);
    });

    it('equals(): false', function() {
        var p1 = new Space.Point.Cartesian(5, 5, 5);
        var p2 = new Space.Point.Cartesian(5, 10, 20);

        assert.strictEqual(p1.equals(p2), false);
        assert.strictEqual(p2.equals(p1), false);
    });

});

describe('new Space.Point.Spherical conversions', function() {

    it('should convert between spherical and cartesian (maintain: 1)', function() {
        var sP = new Space.Point.Spherical(1, 1, 1);
        var cP = sP.toCartesian();
        var sP1 = cP.toSpherical();

        assert.strictEqual(sP1.x, sP.x);
        assert.strictEqual(sP1.y, sP.y);
        assert.strictEqual(sP1.z, sP.z);
    });

    it('should convert between spherical and cartesian (maintain: 0)', function() {
        var sP = new Space.Point.Spherical(0, 0, 0);
        var cP = sP.toCartesian();
        var sP1 = cP.toSpherical();

        assert.strictEqual(sP1.x, sP.x);
        assert.strictEqual(sP1.y, sP.y);
        assert.strictEqual(sP1.z, sP.z);
    });

    it('should convert between spherical and cartesian (maintain: float)', function() {
        var sP = new Space.Point.Spherical(22.22, Math.Pi/2,  Math.Pi/2);
        var cP = sP.toCartesian();
        var sP1 = cP.toSpherical();

        assert.strictEqual(sP1.x, sP.x);
        assert.strictEqual(sP1.y, sP.y);
        assert.strictEqual(sP1.z, sP.z);
    });

    it('should convert between spherical and cartesian (maintain: negative)', function() {
        var sP = new Space.Point.Spherical(-22.22, -Math.Pi/2, -Math.Pi/2);
        var cP = sP.toCartesian();
        var sP1 = cP.toSpherical();

        assert.strictEqual(sP1.x, sP.x);
        assert.strictEqual(sP1.y, sP.y);
        assert.strictEqual(sP1.z, sP.z);
    });

});
