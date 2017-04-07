/* globals Space */

'use strict';

import Space from '../src/Space';
import assert from 'assert';

describe('Path 2D', function() {

    ////
    // Path.constructor
    ////

    it('new Path(x, y, z)', function() {
        let path = new Space.Path(50, 50, -50);
        const o = path.origin();

        assert.strictEqual(o.x, 50);
        assert.strictEqual(o.y, 50);
        assert.strictEqual(o.z, -50);
    });

    it('new Path(Point.Cartesian)', function() {
        let path = new Space.Path(new Space.Point.Cartesian(50, 50, -50));
        const o = path.origin();

        assert.strictEqual(o.x, 50);
        assert.strictEqual(o.y, 50);
        assert.strictEqual(o.z, -50);
    });

    ////
    // Path.addPoint()
    ////

    // tests are implicit in add() and progress()

    ////
    // Path.add()
    ////

    it('add(x,y,z)', function() {
        let path = new Space.Path(50, 50);
        path.add(50, 50);

        assert.strictEqual(path.points.length, 1);
        assert.strictEqual(path.last().x, 100);
        assert.strictEqual(path.last().y, 100);

        path = new Space.Path();
        path.add(50, 50);

        assert.strictEqual(path.points.length, 1);
        assert.strictEqual(path.last().x, 50);
        assert.strictEqual(path.last().y, 50);
    });

    it('add(point.cartesian)', function() {
        let path = new Space.Path(50, 50);
        path.add(new Space.Point.Cartesian(50, 50));

        assert.strictEqual(path.points.length, 1);
        assert.strictEqual(path.last().x, 100);
        assert.strictEqual(path.last().y, 100);

        path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));

        assert.strictEqual(path.points.length, 1);
        assert.strictEqual(path.last().x, 50);
        assert.strictEqual(path.last().y, 50);
    });

    ////
    // Path.progress()
    ////

    it('progress(x,y,z)', function() {
        let path = new Space.Path(50, 50);
        path.add(50, 50);
        path.progress(50, 50);

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(path.last().x, 150);
        assert.strictEqual(path.last().y, 150);

        path = new Space.Path();
        path.add(50, 50);
        path.progress(50, 50);

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(path.last().x, 100);
        assert.strictEqual(path.last().y, 100);
    });

    it('progress(point.cartesian)', function() {
        let path = new Space.Path(50, 50);
        path.add(50, 50);
        path.progress(new Space.Point.Cartesian(50, 50));

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(path.last().x, 150);
        assert.strictEqual(path.last().y, 150);

        path = new Space.Path();
        path.add(50, 50)
        path.progress(new Space.Point.Cartesian(50, 50));

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(path.last().x, 100);
        assert.strictEqual(path.last().y, 100);
    });

    it('progress(-x,-y,z)', function() {
        let path = new Space.Path(50, 50);
        path.add(50, 50);
        path.progress(50, 50);
        path.progress(-50, -50);

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last().x, 100);
        assert.strictEqual(path.last().y, 100);
    });

    it('progress() on a empty path should throw an error', function() {
        const path = new Space.Path(50, 50);

        const fn = () => {
            path.progress(new Space.Point.Cartesian(50, 50));
        };

        assert.throws(fn, Error);
        assert.strictEqual(path.points.length, 0);
    });

    ////
    // Path.close()
    ////

    it('close()', function() {
        let path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        const p = path.close();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last(), path.first());
        assert.strictEqual(p, path.first());
        assert.strictEqual(p, path.last());
    });

    it('close() on an empty path returns null', function() {
        let path = new Space.Path();
        const p = path.close();

        assert.strictEqual(path.points.length, 0);
        assert.strictEqual(p, null);
    });

    it('close() an already closed path doesn\'t mutate the points array', function() {
        let path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        const p1 = path.close();
        const p2 = path.close();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last(), path.first());
        assert.strictEqual(p1, p2);
    });

    ////
    // Path.open()
    ////

    it('open()', function() {
        let path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        const p = path.close();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last(), path.first());

        const o = path.open();

        assert.strictEqual(path.points.length, 2);
        assert.notStrictEqual(path.last(), path.first());
        assert.notStrictEqual(o, p);
    });

    it('open() on an empty path returns null', function() {
        let path = new Space.Path();
        const p = path.open();

        assert.strictEqual(path.points.length, 0);
        assert.strictEqual(p, null);
    });

    it('open() an already closed path doesn\'t mutate the points array', function() {
        let path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        const o = path.open();

        assert.strictEqual(path.points.length, 2);
        assert.notStrictEqual(path.last(), path.first());
        assert.strictEqual(o, path.last());
    });


    ////
    // Path.isClosed()
    ////

    it('isClosed()', function() {
        const path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        const q = path.isClosed();
    });

    it('isClosed() on re-opened path', function() {
        const path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        path.close();
        const q = path.isClosed();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(q, true);

        path.open();
        const q1 = path.isClosed();

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(q1, false);
    });

    it('isClosed() on empty path should return false', function() {
        const path = new Space.Path();
        const q = path.isClosed();

        assert.strictEqual(path.points.length, 0);
        assert.strictEqual(q, false);
    });

    it('isClosed() on path with only one point should return false', function() {
        const path = new Space.Path();
        path.add(50, 50);
        const q = path.isClosed();

        assert.strictEqual(path.points.length, 1);
        assert.strictEqual(q, false);
    });


    ////
    // Path.add() on closed path
    ////

    it('add() on closed path should add the new point before the closing point', function() {
        let path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.add(new Space.Point.Cartesian(150, 150));
        path.close();
        const q = path.isClosed();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(q, true);
        assert.strictEqual(path.last(), path.first());

        path.add(75, 75);
        const q1 = path.isClosed();

        assert.strictEqual(path.points.length, 4);
        assert.strictEqual(q1, true);
        assert.strictEqual(path.last(), path.first());

        assert.strictEqual(path.points[2].x, 75);
        assert.strictEqual(path.points[2].y, 75);
        assert.strictEqual(path.points[2].z, 0);
    });


    it('progress() on closed path should add the new point before the closing point', function() {
        let path = new Space.Path();
        path.add(new Space.Point.Cartesian(50, 50));
        path.close();
        const q = path.isClosed();

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(q, true);
        assert.strictEqual(path.last(), path.first());

        path.progress(50, 50);
        const q1 = path.isClosed();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(q1, true);
        assert.strictEqual(path.last(), path.first());

        assert.strictEqual(path.points[1].x, 100);
        assert.strictEqual(path.points[1].y, 100);
        assert.strictEqual(path.points[1].z, 0);
    });

    ////
    // Path.first()
    ////

    it('first()', function() {
        const path = new Space.Path(50, 50);
        path.add(25, 25);
        path.progress(100, 100);
        const p = path.first();

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(p.x, 75);
        assert.strictEqual(p.y, 75);
    });

    it('first() on empty path should return null', function() {
        const path = new Space.Path(50, 50);

        assert.strictEqual(path.points.length, 0);
        assert.strictEqual(path.first(), null);
    });

    ////
    // Path.last()
    ////

    it('last()', function() {
        const path = new Space.Path(50, 50);
        path.add(50, 50);
        path.progress(100, 100);

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(path.last().x, 200);
        assert.strictEqual(path.last().y, 200);
    });

    it('last() on empty path should return null', function() {
        const path = new Space.Path(50, 50);

        assert.strictEqual(path.points.length, 0);
        assert.strictEqual(path.last(), null);
    });

    ////
    // Path.translate()
    ////

    it('translate()', function() {
        const path = new Space.Path();
        path.add(50, 50);
        path.progress(100, 100);
        path.translate(-50, 50, 500);

        assert.strictEqual(path.points[0].x, 0);
        assert.strictEqual(path.points[0].y, 100);
        assert.strictEqual(path.points[0].z, 500);

        assert.strictEqual(path.points[1].x, 100);
        assert.strictEqual(path.points[1].y, 200);
        assert.strictEqual(path.points[1].z, 500);

    });

    it('translate() on closed path should not mutate the closing point twice', function() {
        const path = new Space.Path();
        path.add(50, 50);
        path.add(100, 100);
        path.close();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last(), path.first());

        path.translate(-50, 50, 500);

        assert.strictEqual(path.last().x, 0);
        assert.strictEqual(path.last().y, 100);
        assert.strictEqual(path.last().z, 500);

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last(), path.first());
    });

    it('translate() should not mutate the origin', function() {
        const origin = new Space.Point.Cartesian(50, 50);
        const path = new Space.Path(origin);
        path.add(50, 50);
        path.add(100, 100);
        path.translate(-50, 50, 500);
        const o = path.origin();

        assert.strictEqual(path.points[0].x, 50);
        assert.strictEqual(path.points[0].y, 150);
        assert.strictEqual(path.points[0].z, 500);

        assert.strictEqual(path.points[1].x, 100);
        assert.strictEqual(path.points[1].y, 200);
        assert.strictEqual(path.points[1].z, 500);

        assert.deepStrictEqual(o, origin);
    });

});
