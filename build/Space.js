var Space = (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var Point = {};

////
// Point.Cartesian
////

Point.Cartesian = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

// Convert to Spherical

Point.Cartesian.prototype.r = function () {
    // eslint-disable-next-line no-restricted-properties
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
};

Point.Cartesian.prototype.phi = function () {
    return Math.atan2(this.y, this.x);
};

Point.Cartesian.prototype.theta = function () {
    return Math.acos(this.z / this.r());
};

//@TODO test
Point.Cartesian.prototype.toPolar = function () {
    return new Point.Polar(this.r(), this.phi());
};

Point.Cartesian.prototype.toSpherical = function () {
    return new Point.Spherical(this.r(), this.phi(), this.theta());
};

// Geographical
// https://vvvv.org/blog/polar-spherical-and-geographic-coordinates

Point.Cartesian.prototype.lat = function () {
    return this.phi() - Math.PI / 2;
};

Point.Cartesian.prototype.lng = function () {
    return this.theta();
};

// Ops

Point.Cartesian.prototype.clone = function () {
    return new Point.Cartesian(this.x, this.y, this.z);
};

Point.Cartesian.prototype.multiply = function (p) {
    this.x *= p.x;
    this.y *= p.y;
    this.z *= p.z;
};

//@TODO test
Point.Cartesian.prototype.scale = function (origin, p) {
    this.substract(origin);
    this.multiply(p);
    this.add(origin);
};

Point.Cartesian.prototype.rotate2D = function (origin, phi) {
    this.substract(origin);
    var p = this.toPolar();
    p.phi += phi;
    p = p.toCartesian();
    this.x = p.x;
    this.y = p.y;
    this.add(origin);
};

Point.Cartesian.prototype.translate = function (x, y, z) {
    x = x || 0;
    y = y || 0;
    z = z || 0;
    this.x += x;
    this.y += y;
    this.z += z;
};

Point.Cartesian.prototype.add = function (p) {
    this.x += p.x;
    this.y += p.y;
    this.z += p.z;
};

Point.Cartesian.prototype.substract = function (p) {
    this.x -= p.x;
    this.y -= p.y;
    this.z -= p.z;
};

Point.Cartesian.prototype.equals = function (p) {
    return this.x === p.x && this.y === p.y && this.z === p.z;
};

Point.Cartesian.prototype.toArray = function () {
    return [this.x, this.y, this.z];
};

// static methods
Point.Cartesian.create = function (x, y, z) {
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof x.clone === 'function') {
        return x;
    }
    return new Point.Cartesian(x, y, z);
};

////
// Point.Polar
////

Point.Polar = function (r, phi) {
    this.r = r || 0; // distance
    this.phi = phi || 0; // polar angle
};

//// Point.Polar conversions

// Cartesian

Point.Polar.prototype.x = function () {
    return this.r * Math.cos(this.phi);
};

Point.Polar.prototype.y = function () {
    return this.r * Math.sin(this.phi);
};

Point.Polar.prototype.toCartesian = function () {
    return new Point.Cartesian(this.x(), this.y());
};

////
// Point.Spherical
////

Point.Spherical = function (r, phi, theta) {
    this.r = r || 0; // distance
    this.phi = phi || 0; // polar angle
    this.theta = theta || 0; // azimuthal angle
};

//// Point.Spherical conversions

// Cartesian

Point.Spherical.prototype.x = function () {
    return this.r * Math.sin(this.theta) * Math.cos(this.phi);
};

Point.Spherical.prototype.y = function () {
    return this.r * Math.sin(this.theta) * Math.sin(this.phi);
};

Point.Spherical.prototype.z = function () {
    return this.r * Math.cos(this.theta);
};

Point.Spherical.prototype.toCartesian = function () {
    return new Point.Cartesian(this.x(), this.y(), this.z());
};

// Geographical
// https://vvvv.org/blog/polar-spherical-and-geographic-coordinates

Point.Spherical.prototype.lat = function () {
    return this.phi - Math.PI / 2;
};

Point.Spherical.prototype.lng = function () {
    return this.theta;
};

var World = function World(origin) {
    origin = origin || null;

    if (!origin || typeof origin.clone !== 'function') {
        throw Error('World constructor requires a Space.Point.Cartesian instance');
    }

    this.origin = function () {
        return origin.clone();
    };

    this.locate = function (point) {
        point.add(origin);
        return point;
    };
};

//https://github.com/d3/d3-path/blob/master/src/path.js
var Path = function Path(x, y, z) {
    var origin = Point.Cartesian.create(x, y, z);
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
    var v = this.locate(Point.Cartesian.create(x, y, z));
    this.addPoint(v);
};

// relatve coords from last point
Path.prototype.progress = function (x, y, z) {
    if (!this.points.length) {
        throw new Error('Path error: cannot progress on an empty path');
    }
    var v = Point.Cartesian.create(x, y, z);
    v.add(this.last());
    this.addPoint(v);
};

Path.prototype.last = function () {
    return this.points.length ? this.points[this.points.length - 1] : null;
};

Path.prototype.first = function () {
    return this.points.length ? this.points[0] : null;
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
    return this.points.length > 1 && this.last() === this.first();
};

// could be bundled to .transform('translate' x,y,z) ?

Path.prototype.translate = function (x, y, z) {
    var i = void 0;
    var v = Point.Cartesian.create(x, y, z);
    var length = this.isClosed() ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
};

Path.prototype.scale = function (x, y, z) {
    var i = void 0;
    var v = Point.Cartesian.create(x, y, z);
    var length = this.isClosed() ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].scale(this.origin(), v);
    }
};

Path.prototype.rotate2D = function (rad) {
    var i = void 0;
    var length = this.isClosed() ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].rotate2D(this.origin(), rad);
    }
};

var BezierPath = function BezierPath(origin) {
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
        cp1: cp1 ? this.locate(cp1) : point.clone(),
        cp2: cp2 ? this.locate(cp2) : point.clone()
    });
};

// relatve coords from last point
BezierPath.prototype.progress = function (point, cp1, cp2) {
    if (!this.points.length) {
        throw new Error('Path error: cannot progress on an empty path');
    }
    cp1 = cp1 || null;
    cp2 = cp2 || null;
    var last = this.last();
    point = point.add(last.point);
    this.addPoint({
        point: point,
        cp1: cp1 ? this.locate(cp1) : point.clone(),
        cp2: cp2 ? this.locate(cp2) : point.clone()
    });
};

BezierPath.prototype.last = function () {
    return this.points.length ? this.points[this.points.length - 1] : null;
};

BezierPath.prototype.first = function () {
    return this.points.length ? this.points[0] : null;
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
    return this.points.length > 1 && this.last() === this.first();
};

////
// Polygon
////

/**
 * x translate
 * rotate
 * scale
 */

var Polygon = function Polygon(segments, radius, origin) {
    var path = new Path(origin);
    var i = 0;

    //@see http://stackoverflow.com/a/7198179
    var delta = Math.PI * 2 / segments;

    while (i < segments) {
        var p = new Point.Polar(radius, i * delta);
        var c = p.toCartesian();
        path.add(c.x, c.y);
        i += 1;
    }
    path.close();
    this.path = path;
};

////
// Rectangle
////

var Rectangle = function Rectangle(width, height, origin) {
    var path = new Path(origin);

    path.add(-width / 2, height / 2);
    path.progress(width, 0);
    path.progress(0, -height);
    path.progress(-width, 0);
    path.close();

    this.path = path;
};

////
// Star
////

var Star = function Star(segments, outerRadius, innerRadius, origin) {
    var path = new Path(origin);

    var _point = function _point(radius, delta) {
        var point = new Point.Polar(radius, delta);
        point = point.toCartesian();
        return point;
    };

    //@see http://stackoverflow.com/a/7198179
    var rad0 = Math.PI / 2;
    var delta = Math.PI * 2 / segments;
    var _delta = void 0;
    var inner = void 0;
    var outer = void 0;
    var i = 0;

    while (i < segments) {
        _delta = i * delta - rad0;
        outer = _point(outerRadius, _delta);
        path.add(outer.x, outer.y);

        if (i <= segments - 1) {
            _delta += delta / 2;
            inner = _point(innerRadius, _delta);
            path.add(inner.x, inner.y);
        }
        i += 1;
    }
    path.close();
    this.path = path;
};



var Polygons = Object.freeze({
	Polygon: Polygon,
	Rectangle: Rectangle,
	Star: Star
});

var Module = {
    Point: Point,
    Path: Path,
    BezierPath: BezierPath
};

// hm...
Object.keys(Polygons).forEach(function (key) {
    Module[key] = Polygons[key];
});

return Module;

}());
//# sourceMappingURL=Space.js.map
