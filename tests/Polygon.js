/* globals SPACE */

'use strict';

let vm = require('vm');
let fs = require('fs');
let script = fs.readFileSync('./src/Point.js');
script += fs.readFileSync('./src/Path.js');
script += fs.readFileSync('./src/Polygon.js');
vm.runInThisContext(script);

var assert = require('assert');

//@TODO polygon
describe('Rectangle 2D', function() {
    it('square', function() {
        let rect = new SPACE.Rectangle(100, 100);

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
});
