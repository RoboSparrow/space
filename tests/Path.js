/* globals Space */

'use strict';

import Space from '../src/Space';
import assert from 'assert';

describe('Path 2D', function() {
    it('progress', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);

        assert.strictEqual(path.points.length, 2);
        assert.strictEqual(path.last().x, 100);
        assert.strictEqual(path.last().y, 100);
    });

    it('progress negative', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);
        path.progress(-150, -150);

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.last().x, -50);
        assert.strictEqual(path.last().y, -50);
    });

    it('closing an open path should add 1 point', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);
        path.progress(-150, -150);
        path.close();

        assert.strictEqual(path.points.length, 4);
        assert.strictEqual(path.last().x, path.first().x);
        assert.strictEqual(path.last().y, path.first().y);
        assert.strictEqual(path.isClosed(), true);
    });

    it('Closing point and first point are the same instances.', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);
        path.progress(-150, -150);
        path.close();

        assert.strictEqual(path.points.length, 4);
        assert.strictEqual(path.isClosed(), true);
        assert.strictEqual(path.first(), path.last());
    });

    it('closing an already closed path should leave path.points untouched', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);
        path.progress(-150, -150);
        path.close();

        assert.strictEqual(path.points.length, 4);
        assert.strictEqual(path.isClosed(), true);
        assert.deepStrictEqual(path.last(), path.first());

        let last = path.last();
        path.close();

        assert.strictEqual(path.points.length, 4);
        assert.strictEqual(path.isClosed(), true);
        assert.deepStrictEqual(path.last(), last);

    });

    it('should open a closed path', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);
        path.progress(-150, -150);
        path.close();

        assert.strictEqual(path.points.length, 4);
        assert.strictEqual(path.isClosed(), true);
        assert.deepStrictEqual(path.last(), path.first());

        path.open();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.isClosed(), false);
        assert.notDeepStrictEqual(path.last(), path.first());
    });

    it('opening an already closed path should leave path.points untouched', function() {
        let path = new Space.Path(50, 50);
        path.progress(50, 50);
        path.progress(-150, -150);

        path.open();

        assert.strictEqual(path.points.length, 3);
        assert.strictEqual(path.isClosed(), false);
        assert.notDeepStrictEqual(path.last(), path.first());
    });

});
