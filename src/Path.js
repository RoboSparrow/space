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
    const p = this.last().clone();
    p.add(v);
    this.points.push(p);
    // return this?
};

Path.prototype.translate = function (x, y, z) {
    let i;
    const v = new Point.Cartesian(x, y, z);
    const length = (this.isClosed()) ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
};

Path.prototype.scale = function (x, y, z) {
    let i;
    const v = new Point.Cartesian(x, y, z);
    const length = (this.isClosed()) ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].scaleBy(v);
    }
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
    if (!this.isClosed()) {
        this.points.push(this.first());
    }
    return this.last();
};

Path.prototype.isClosed = function () {
    return (this.points.length > 1 && this.last() === this.first());
};

export default Path;
