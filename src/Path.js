//https://github.com/d3/d3-path/blob/master/src/path.js
import Point from './Point';

/*
 * @TODO:
 * tranlate point
 * scale
 * rotate
 * arc
 */
const Path = function (x, y, z) {
    this.points = [];
    if (x !== undefined) {
        this.add(x, y, z);
    }
    // return this?
};

//absolute coords
Path.prototype.add = function (x, y, z) {
    this.points.push(new Point.Cartesian(x, y, z));
    // return this?
};

// relatve coords from last point
Path.prototype.progress = function (x, y, z) {
    const v = new Point.Cartesian(x, y, z);
    const p = this.last().clone();//@TODO what if empty?
    p.add(v);
    this.points.push(p);
    // return this?
};

Path.prototype.last = function () {
    return this.points[this.points.length - 1];
};

Path.prototype.first = function () {
    return this.points[0];
};

Path.prototype.open = function () {
    if (this.isClosed()) {
        this.points.splice(-1, 1);
    }
    return this.last();
};

Path.prototype.close = function () {
    if (!this.isClosed()) {
        this.points.push(this.first());
    }
    return this.last();
};

Path.prototype.isClosed = function () {
    return this.last() === this.first();
};

export default Path;
