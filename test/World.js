/* globals Space */

'use strict';

import Space from '../src/Space';
import World from '../src/Space/World';
import assert from 'assert';

describe('World', function() {

    ////
    // Path.constructor
    ////

    it('new World() should thow an Error', function() {
        const fn = () => {
            return new World();
        };
        assert.throws(fn, Error);
    });

    it('new World(null) should thow an Error', function() {
        const fn = () => {
            return new World(null);
        };
        assert.throws(fn, Error);
    });

    it('new World(object) should thow an Error', function() {
        const fn = () => {
            return new World({ x: 50, clone: 3 });
        };
        assert.throws(fn, Error);
    });

    it('new World(point(x, y, z))', function() {
        const p = new Space.Point.Cartesian(50, 50, -50);
        let w = new World(p);
        const o = w.origin();

        assert.strictEqual(o.x, 50);
        assert.strictEqual(o.y, 50);
        assert.strictEqual(o.z, -50);
    });

    it('new World(point1) !== new World(point2)', function() {
        const p1 = new Space.Point.Cartesian(50, 50, -50);
        let w1 = new World(p1);
        const o1 = w1.origin();

        const p2 = new Space.Point.Cartesian(100, -100);
        let w2 = new World(p2);
        const o2 = w2.origin();

        assert.notStrictEqual(w1, w2);
        assert.notDeepStrictEqual(o1, o2);
    });

});
