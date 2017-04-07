import World from './World';

const BezierPath = function (origin) {
    World.call(this, origin);

    this.points = [];
};

BezierPath.prototype = Object.create(World.prototype);
BezierPath.prototype.constructor = BezierPath;

// push to points, consider closed
BezierPath.prototype.addPoint = function (v) {
    if (this.isClosed()) {
        this.points.splice(this.points.length - 1, 0, v);
    } else {
        this.points.push(v);
    }
};

BezierPath.prototype.add = function (point, cp1, cp2) {
    cp1 = cp1 || null;
    cp2 = cp2 || null;
    point = this.locate(point);
    this.addPoint({
        point: point,
        cp1: (cp1) ? this.locate(cp1) : point.clone(),
        cp2: (cp2) ? this.locate(cp2) : point.clone()
    });
};

// relatve coords from last point
BezierPath.prototype.progress = function (point, cp1, cp2) {
    if (!this.points.length) {
        throw new Error('Path error: cannot progress on an empty path');
    }
    cp1 = cp1 || null;
    cp2 = cp2 || null;
    const last = this.last();
    point = point.add(last.point);
    this.addPoint({
        point: point,
        cp1: (cp1) ? this.locate(cp1) : point.clone(),
        cp2: (cp2) ? this.locate(cp2) : point.clone()
    });
};

BezierPath.prototype.last = function () {
    return (this.points.length) ? this.points[this.points.length - 1] : null;
};

BezierPath.prototype.first = function () {
    return (this.points.length) ? this.points[0] : null;
};

BezierPath.prototype.open = function () {
    if (this.isClosed()) {
        this.points.splice(-1, 1);
    }
    return this.last();
};

BezierPath.prototype.close = function () {
    if (this.points.length && !this.isClosed()) {
        this.points.push(this.first());
    }
    return this.last();
};

BezierPath.prototype.isClosed = function () {
    return (this.points.length > 1 && this.last() === this.first());
};

export default BezierPath;
