//https://github.com/d3/d3-path/blob/master/src/path.js
import Point from './Point';
import World from './World';

const Path = function (x, y, z) {
    const origin = Point.Cartesian.create(x, y, z);
    World.call(this, origin);
    
    this.points = [];
};

Path.prototype = Object.create(World.prototype);
Path.prototype.constructor = Path;

// push to points, consider closed
Path.prototype.addPoint = function (v) {
    if (this.isClosed()) {
        this.points.splice(this.points.length - 1, 0, v);
    } else {
        this.points.push(v);
    }
};

// add coords relative to origin
Path.prototype.add = function (x, y, z) {
    const v = this.locate(Point.Cartesian.create(x, y, z));
    this.addPoint(v);
};

// relatve coords from last point
Path.prototype.progress = function (x, y, z) {
    if (!this.points.length) {
        throw new Error('Path error: cannot progress on an empty path');
    }
    const v = Point.Cartesian.create(x, y, z);
    const p = this.last().clone();
    p.add(v);
    this.addPoint(p);
};

Path.prototype.last = function () {
    return (this.points.length) ? this.points[this.points.length - 1] : null;
};

Path.prototype.first = function () {
    return (this.points.length) ? this.points[0] : null;
};

Path.prototype.open = function () {
    if (this.isClosed()) {
        this.points.splice(-1, 1);
    }
    return this.last();
};

Path.prototype.close = function () {
    if (this.points.length && !this.isClosed()) {
        this.points.push(this.first());
    }
    return this.last();
};

Path.prototype.isClosed = function () {
    return (this.points.length > 1 && this.last() === this.first());
};

// could be bundled to .transform('translate' x,y,z) ?

Path.prototype.translate = function (x, y, z) {
    let i;
    const v = Point.Cartesian.create(x, y, z);
    const length = (this.isClosed()) ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
};

Path.prototype.scale = function (x, y, z) {
    let i;
    const v = Point.Cartesian.create(x, y, z);
    const length = (this.isClosed()) ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].scale(this.origin(), v);
    }
};

Path.prototype.rotate2D = function (rad) {
    let i;
    const length = (this.isClosed()) ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].rotate2D(this.origin(), rad);
    }
};

export default Path;
