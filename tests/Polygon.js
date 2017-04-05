/* globals Space */

'use strict';

import Space from '../src/Space';
import assert from 'assert';

//@TODO polygon
describe('Rectangle 2D', function() {
    it('square', function() {
        let rect = new Space.Rectangle(100, 100);

        assert.strictEqual(rect.path.points.length, 5);// with path.close() it should be 5

        assert.strictEqual(rect.path.points[0].x, -50);
        assert.strictEqual(rect.path.points[0].y, 50);

        assert.strictEqual(rect.path.points[1].x, 50);
        assert.strictEqual(rect.path.points[1].y, 50);

        assert.strictEqual(rect.path.points[2].x, 50);
        assert.strictEqual(rect.path.points[2].y, -50);

        assert.strictEqual(rect.path.points[3].x, -50);
        assert.strictEqual(rect.path.points[3].y, -50);

        assert.strictEqual(rect.path.last().x, rect.path.first().x);
        assert.strictEqual(rect.path.last().y, rect.path.first().y);
    });
    
    it('square with origin(x, y, z)', function() {
        let rect = new Space.Rectangle(100, 100, new Space.Point.Cartesian(50, 50, -50));

        assert.strictEqual(rect.path.points.length, 5);// with path.close() it should be 5

        assert.strictEqual(rect.path.points[0].x, 0);
        assert.strictEqual(rect.path.points[0].y, 100);
        assert.strictEqual(rect.path.points[0].z, -50);

        assert.strictEqual(rect.path.points[1].x, 100);
        assert.strictEqual(rect.path.points[1].y, 100);
        assert.strictEqual(rect.path.points[0].z, -50);

        assert.strictEqual(rect.path.points[2].x, 100);
        assert.strictEqual(rect.path.points[2].y, 0);
        assert.strictEqual(rect.path.points[0].z, -50);

        assert.strictEqual(rect.path.points[3].x, 0);
        assert.strictEqual(rect.path.points[3].y, 0);
        assert.strictEqual(rect.path.points[0].z, -50);

        assert.strictEqual(rect.path.last().x, rect.path.first().x);
        assert.strictEqual(rect.path.last().y, rect.path.first().y);
    });
});
