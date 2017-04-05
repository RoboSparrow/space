var Point = {};

////
// Point.Cartesian
////

Point.Cartesian = function (x, y, z) {
    this.x = Math.round(x) || 0;
    this.y = Math.round(y) || 0;
    this.z = Math.round(z) || 0;
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

//https://github.com/d3/d3-path/blob/master/src/path.js
/*
 * @TODO:
 * tranlate point
 * scale
 * rotate
 * arc
 */
var createPoint = function createPoint(x, y, z) {
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof x.clone === 'function') {
        return x;
    }
    return new Point.Cartesian(x, y, z);
};

var Path = function Path(x, y, z) {
    this.points = [];

    var origin = createPoint(x, y, z);

    this.world = function (v) {
        v.add(origin);
        return v;
    };

    this.origin = function () {
        return origin.clone();
    };
};

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
    var v = this.world(createPoint(x, y, z));
    this.addPoint(v);
};

// relatve coords from last point
Path.prototype.progress = function (x, y, z) {
    if (!this.points.length) {
        throw new Error('Path error: cannot progress on an empty path');
    }
    var v = createPoint(x, y, z);
    var p = this.last().clone();
    p.add(v);
    this.addPoint(p);
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

Path.prototype.translate = function (x, y, z) {
    var i = void 0;
    var v = createPoint(x, y, z);
    var length = this.isClosed() ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
};

Path.prototype.scale = function (x, y, z) {
    var i = void 0;
    var v = createPoint(x, y, z);
    var length = this.isClosed() ? this.points.length - 1 : this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
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
    Path: Path
};

// hm...
Object.keys(Polygons).forEach(function (key) {
    Module[key] = Polygons[key];
});

export default Module;
//# sourceMappingURL=Space.module.js.map
