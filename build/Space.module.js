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

//https://github.com/d3/d3-path/blob/master/src/path.js
/*
 * @TODO:
 * tranlate point
 * scale
 * rotate
 * arc
 */
var Path = function Path(x, y, z) {
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
    var v = new Point.Cartesian(x, y, z);
    var p = this.last().clone(); //@TODO what if empty?
    p.add(v);
    this.points.push(p);
    // return this?
};

Path.prototype.translate = function (x, y, z) {
    var i = void 0;
    var v = new Point.Cartesian(x, y, z);
    var length = this.points.length;
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
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
        this.points.push(this.first().clone());
    }
    return this.last();
};

Path.prototype.isClosed = function () {
    return this.last().equals(this.first());
};

////
// Polygon
////

/**
 * translate center
 * set center
 * rotate
 * scale
 */

var Polygon = function Polygon(segments, radius, center) {
    center = center || null; // node v8: no default params

    var path = new Path();
    var i = 0;

    if (!center) {
        center = new Point.Cartesian(0, 0, 0);
    }

    //@see http://stackoverflow.com/a/7198179
    var delta = Math.PI * 2 / segments;

    while (i < segments) {
        var p = new Point.Polar(radius, i * delta);
        var c = p.toCartesian();
        c.add(center);
        path.add(c.x, c.y);
        i += 1;
    }
    path.close();
    this.path = path;
};

////
// Rectangle
////

var Rectangle = function Rectangle(width, height, center) {
    center = center || null; // node v8: no default params

    //@TODO check ispoint
    if (!center) {
        center = new Point.Cartesian(0, 0, 0);
    }

    //@see http://stackoverflow.com/a/7198179
    var first = center.clone();
    first.add(new Point.Cartesian(-width / 2, height / 2));

    var path = new Path(first.x, first.y);
    path.progress(width, 0);
    path.progress(0, -height);
    path.progress(-width, 0);
    path.close();

    this.path = path;
};

////
// Star
////

var Star = function Star(segments, outerRadius, innerRadius, center) {

    var _point = function _point(radius, delta, center) {
        var point = new Point.Polar(radius, delta);
        point = point.toCartesian();
        point.add(center);
        return point;
    };

    center = center || null; // node v8: no default params
    var path = new Path();
    var i = 0;

    if (!center) {
        center = new Point.Cartesian(0, 0, 0);
    }

    //@see http://stackoverflow.com/a/7198179
    var rad0 = Math.PI / 2;
    var delta = Math.PI * 2 / segments;
    var _delta = void 0;
    var inner = void 0;
    var outer = void 0;

    while (i < segments) {
        _delta = i * delta - rad0;
        outer = _point(outerRadius, _delta, center);
        path.add(outer.x, outer.y);

        if (i <= segments - 1) {
            _delta += delta / 2;
            inner = _point(innerRadius, _delta, center);
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
