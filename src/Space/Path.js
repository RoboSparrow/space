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

// replace (or set) a point at a specified index, updates closed index, doe NOT locate point to origin
Path.prototype.replace = function (index, v) {
    const closed = this.isClosed();
    if (closed) {
        this.open();
    }
    this.points[index] = v;
    if (closed) {
        this.close();
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
    v.add(this.last());
    this.addPoint(v);
};

// replace (or set) a point at a specified index, updates closed index
Path.prototype.set = function (index, x, y, z) {
    this.replace(index, this.locate(Point.Cartesian.create(x, y, z)));
};

// get a point for index
Path.prototype.get = function (index) {
    return (this.points[index] !== undefined) ? this.points[index] : null;
};

// get last point
Path.prototype.last = function () {
    return (this.points.length) ? this.points[this.points.length - 1] : null;
};

// get first point
Path.prototype.first = function () {
    return (this.points.length) ? this.points[0] : null;
};

// get  adjascent point for index
Path.prototype.prev = function (index) {
    if (!this.isClosed()) {
        return this.get(index - 1);
    }
    // if closed the last item in array === first
    return (index === 0) ? this.get(this.points.length - 2) : this.get(index - 1);
};

// get descendant point for index
Path.prototype.next = function (index) {
    if (!this.isClosed()) {
        return this.get(index + 1);
    }
    return (index === this.points.length - 1) ? this.first() : this.get(index + 1);
};

// open path
Path.prototype.open = function () {
    if (this.isClosed()) {
        this.points.splice(-1, 1);
    }
    return this.last();
};

// close path
Path.prototype.close = function () {
    if (this.points.length && !this.isClosed()) {
        this.points.push(this.first());
    }
    return this.last();
};

// check if path is closed
Path.prototype.isClosed = function () {
    return (this.points.length > 1 && this.last() === this.first());
};

// returns this.points length, excluding last element when path is losed
Path.prototype.length = function () {
    return (this.isClosed()) ? this.points.length - 1 : this.points.length;
};

// bounding box
//@TODO
Path.prototype.bounds = function () {
    if (!this.points.length) {
        return null;
    }
    const min = this.first().clone();
    const max = this.first().clone();
    const length = this.length();
    for (let i = 0; i < length; i += 1) {
        min.min(this.points[i]);
        max.max(this.points[i]);
    }
    //TODO point.between()
    const center = min.clone();
    center.translate((max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2);
    return { min, max, center };
};

// rotate path
Path.prototype.toArray = function () {
    const arr = [];
    const length = this.points.length;
    for (let i = 0; i < length; i += 1) {
        arr.push(this.points[i].toArray());
    }
    return arr;
};

// could be bundled to .transform('translate' x,y,z) ?

// translate path
Path.prototype.translate = function (x, y, z) {
    let i;
    const v = Point.Cartesian.create(x, y, z);
    const length = this.length();
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
};

// scale path
Path.prototype.scale = function (x, y, z) {
    let i;
    const v = Point.Cartesian.create(x, y, z);
    const length = this.length();
    for (i = 0; i < length; i += 1) {
        this.points[i].scale(this.origin(), v);
    }
};

// rotate path
Path.prototype.rotate2D = function (rad) {
    let i;
    const length = this.length();
    for (i = 0; i < length; i += 1) {
        this.points[i].rotate2D(this.origin(), rad);
    }
};

// expand path evenly, new path elements are crossproducts of siblings
Path.prototype.expand = function (n) {

    if (isNaN(n) || n <= 0) {
        return false;
    }
// todo : isopen
    const length = this.points.length; // true array length
    const projected = length + n;

    // the larger the expand factor is the smaller will be the iteration step
    // smallest step size is 1
    const gapSize = projected / length;

    // section < 1 :discard
    // section === 0: discard
    // section > 0 && < 1:
    // section === 1
    // section >1


    // using new length
    const step = Math.floor(gapSize);
    for (let i = step; i < projected; i += step) {
        this.points.splice(i * step, 0, new Point.Cartesian());//TODO path.insert
    }

    return true;
};


export default Path;
