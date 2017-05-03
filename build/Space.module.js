////
// Spherical
////

var Spherical = function Spherical(r, phi, theta) {
    this.r = r || 0; // distance
    this.phi = phi || 0; // polar angle
    this.theta = theta || 0; // azimuthal angle
};

//// Spherical conversions

// Cartesian

Spherical.prototype.x = function () {
    return this.r * Math.sin(this.theta) * Math.cos(this.phi);
};

Spherical.prototype.y = function () {
    return this.r * Math.sin(this.theta) * Math.sin(this.phi);
};

Spherical.prototype.z = function () {
    return this.r * Math.cos(this.theta);
};

Spherical.prototype.toCartesian = function () {
    return new Cartesian(this.x(), this.y(), this.z());
};

// Geographical
// https://vvvv.org/blog/polar-spherical-and-geographic-coordinates

Spherical.prototype.lat = function () {
    return this.phi - Math.PI / 2;
};

Spherical.prototype.lng = function () {
    return this.theta;
};

////
// Polar
////

var Polar = function Polar(r, phi) {
    this.r = r || 0; // distance
    this.phi = phi || 0; // polar angle
};

//// Polar conversions

// Cartesian

Polar.prototype.x = function () {
    return this.r * Math.cos(this.phi);
};

Polar.prototype.y = function () {
    return this.r * Math.sin(this.phi);
};

Polar.prototype.toCartesian = function () {
    return new Cartesian(this.x(), this.y());
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

////
// Cartesian
////

var Cartesian = function Cartesian(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

// Convert to Spherical

Cartesian.prototype.r = function () {
    // eslint-disable-next-line no-restricted-properties
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
};

Cartesian.prototype.phi = function () {
    return Math.atan2(this.y, this.x);
};

Cartesian.prototype.theta = function () {
    return Math.acos(this.z / this.r());
};

//@TODO test
Cartesian.prototype.toPolar = function () {
    return new Polar(this.r(), this.phi());
};

Cartesian.prototype.toSpherical = function () {
    return new Spherical(this.r(), this.phi(), this.theta());
};

// Geographical
// https://vvvv.org/blog/polar-spherical-and-geographic-coordinates

Cartesian.prototype.lat = function () {
    return this.phi() - Math.PI / 2;
};

Cartesian.prototype.lng = function () {
    return this.theta();
};

// Operations

Cartesian.prototype.add = function (p) {
    this.x += p.x;
    this.y += p.y;
    this.z += p.z;
};

Cartesian.prototype.substract = function (p) {
    this.x -= p.x;
    this.y -= p.y;
    this.z -= p.z;
};

Cartesian.prototype.multiply = function (p) {
    this.x *= p.x;
    this.y *= p.y;
    this.z *= p.z;
};

// world operations

Cartesian.prototype.scale = function (origin, p) {
    this.substract(origin);
    this.multiply(p);
    this.add(origin);
};

Cartesian.prototype.rotate2D = function (origin, phi) {
    this.substract(origin);
    var p = this.toPolar();
    p.phi += phi;
    p = p.toCartesian();
    this.x = p.x;
    this.y = p.y;
    this.add(origin);
};

// operations with primitives

Cartesian.prototype.translate = function (x, y, z) {
    x = x || 0;
    y = y || 0;
    z = z || 0;
    this.x += x;
    this.y += y;
    this.z += z;
};

Cartesian.prototype.multiplyBy = function (f) {
    this.x *= f;
    this.y *= f;
    this.z *= f;
};

// comparasion

Cartesian.prototype.equals = function (p) {
    return this.x === p.x && this.y === p.y && this.z === p.z;
};

// min, max

Cartesian.prototype.min = function (v) {
    this.x = this.x > v.x ? v.x : this.x;
    this.y = this.y > v.y ? v.y : this.y;
};

Cartesian.prototype.max = function (v) {
    this.x = this.x < v.x ? v.x : this.x;
    this.y = this.y < v.y ? v.y : this.y;
};

// exports

Cartesian.prototype.clone = function () {
    return new Cartesian(this.x, this.y, this.z);
};

Cartesian.prototype.toArray = function () {
    return [this.x, this.y, this.z];
};

// static methods

Cartesian.create = function (x, y, z) {
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof x.clone === 'function') {
        return x;
    }
    return new Cartesian(x, y, z);
};

var Point = {
    Cartesian: Cartesian,
    Spherical: Spherical,
    Polar: Polar
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

// replace (or set) a point at a specified index, updates closed index, doe NOT locate point to origin
Path.prototype.replace = function (index, v) {
    var closed = this.isClosed();
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

// replace (or set) a point at a specified index, updates closed index
Path.prototype.set = function (index, x, y, z) {
    this.replace(index, this.locate(Point.Cartesian.create(x, y, z)));
};

// get a point for index
Path.prototype.get = function (index) {
    return this.points[index] !== undefined ? this.points[index] : null;
};

// get last point
Path.prototype.last = function () {
    return this.points.length ? this.points[this.points.length - 1] : null;
};

// get first point
Path.prototype.first = function () {
    return this.points.length ? this.points[0] : null;
};

// get  adjascent point for index
Path.prototype.prev = function (index) {
    if (!this.isClosed()) {
        return this.get(index - 1);
    }
    // if closed the last item in array === first
    return index === 0 ? this.get(this.points.length - 2) : this.get(index - 1);
};

// get descendant point for index
Path.prototype.next = function (index) {
    if (!this.isClosed()) {
        return this.get(index + 1);
    }
    return index === this.points.length - 1 ? this.first() : this.get(index + 1);
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
    return this.points.length > 1 && this.last() === this.first();
};

// returns this.points length, excluding last element when path is losed
Path.prototype.length = function () {
    return this.isClosed() ? this.points.length - 1 : this.points.length;
};

// bounding box
//@TODO
Path.prototype.bounds = function () {
    if (!this.points.length) {
        return null;
    }
    var min = this.first().clone();
    var max = this.first().clone();
    var length = this.length();
    for (var i = 0; i < length; i += 1) {
        min.min(this.points[i]);
        max.max(this.points[i]);
    }
    //TODO point.between()
    var center = min.clone();
    center.translate((max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2);
    return { min: min, max: max, center: center };
};

// rotate path
Path.prototype.toArray = function () {
    var arr = [];
    var length = this.points.length;
    for (var i = 0; i < length; i += 1) {
        arr.push(this.points[i].toArray());
    }
    return arr;
};

// could be bundled to .transform('translate' x,y,z) ?

// translate path
Path.prototype.translate = function (x, y, z) {
    var i = void 0;
    var v = Point.Cartesian.create(x, y, z);
    var length = this.length();
    for (i = 0; i < length; i += 1) {
        this.points[i].add(v);
    }
};

// scale path
Path.prototype.scale = function (x, y, z) {
    var i = void 0;
    var v = Point.Cartesian.create(x, y, z);
    var length = this.length();
    for (i = 0; i < length; i += 1) {
        this.points[i].scale(this.origin(), v);
    }
};

// rotate path
Path.prototype.rotate2D = function (rad) {
    var i = void 0;
    var length = this.length();
    for (i = 0; i < length; i += 1) {
        this.points[i].rotate2D(this.origin(), rad);
    }
};

////
// Group is a Group of Cartesian Points
////

var Group = function Group(x, y, z) {
    Cartesian.call(this, x, y, z);

    // control points
    this.members = [];
};

Group.prototype = Object.create(Cartesian.prototype);
Group.prototype.constructor = Group;

// Operations

Group.prototype.add = function (p) {
    Cartesian.prototype.add.call(this, p);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].add(p);
    }
};

Group.prototype.substract = function (p) {
    Cartesian.prototype.substract.call(this, p);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].substract(p);
    }
};

Group.prototype.multiply = function (p) {
    Cartesian.prototype.multiply.call(this, p);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].multiply(p);
    }
};

// world operations

Group.prototype.scale = function (origin, p) {
    Cartesian.prototype.scale.call(this, origin, p);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].scale(origin, p);
    }
};

Group.prototype.rotate2D = function (origin, phi) {
    Cartesian.prototype.rotate2D.call(this, origin, phi);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].rotate2Dy(origin, phi);
    }
};

// operations with primitives

Group.prototype.translate = function (x, y, z) {
    Cartesian.prototype.translate.call(this, x, y, z);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].translate(x, y, z);
    }
};

Group.prototype.multiplyBy = function (f) {
    Cartesian.prototype.multiplyBy.call(this, f);
    console.log(this.x, this.y);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        this.members[i].multiplyBy(f);
    }
};

// exports

Group.prototype.clone = function () {
    var clone = new Group(this.x, this.y, this.z);
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        clone.members[i] = this.members[i].clone();
    }
    return clone;
};

Group.prototype.toArray = function () {
    var arr = [this.x, this.y, this.z];
    var length = this.members.length;
    for (var i = 0; i < length; i += 1) {
        arr.push(this.members[i].x, this.members[i].y, this.members[i].z);
    }
    return arr;
};

// static methods

Group.create = function (x, y, z) {
    //is point like
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof x.clone === 'function') {
        // is a a group already
        if (typeof x.members !== 'undefined') {
            return x;
        }
        // is a cartesian point
        return new Group(x.x, x.y, x.z);
    }
    return new Group(x, y, z);
};

/**
 * Rob Spencer's algorithm
 * @see http://scaledinnovation.com/analytics/splines/aboutSplines.html
 * @TODO angles. Angles from tangent (positive, negative) It might be worth to check if we can use Point.polar ops in general
 * @TODO tension as absolute progression value (pixels) if tension is an array add instead multiply
 * function bezier(prev, curr, next, [100, 50], [45, -25])
 */
var smoothPoint = function smoothPoint(prev, curr, next, tension) {

    //@TODO, this is a temporary workaround
    curr = Group.create(curr); //expensive

    if (!next || !prev) {
        return curr;
    }

    //  prev.x,prev.y,curr.x,curr.y are the coordinates of the end (knot) pts of this segment
    //  next.x,next.y is the next knot -- not connected here but needed to calculate p2
    //  p1 is the control curr calculated here, from curr.x back toward prev.x.
    //  p2 is the next control curr, calculated here and returned to become the
    //  next segment's p1.
    //  t is the 'tension' which controls how far the control currs spread.

    //  Scaling factors: distances from this knot to the previous and following knots

    /* eslint-disable no-restricted-properties */
    var d01 = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    var d12 = Math.sqrt(Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2));
    /* eslint-enable no-restricted-properties */

    var fa = tension * (d01 / (d01 + d12)); // scaling factor for triangle Ta
    var fb = tension - fa; // ditto for Tb, simplifies to fb=t-fa

    var p1x = curr.x + fa * (prev.x - next.x); // x2-x0 is the width of triangle T
    var p1y = curr.y + fa * (prev.y - next.y); // y2-y0 is the height of T

    var p2x = curr.x - fb * (prev.x - next.x);
    var p2y = curr.y - fb * (prev.y - next.y);

    //return [new curr.Cartesian(p1x, p1y), new curr.Cartesian(p2x, p2y)];

    curr.members[0] = new Point.Cartesian(p1x, p1y);
    curr.members[1] = new Point.Cartesian(p2x, p2y);

    // Everything else in the code is just bookkeeping.
    // In these sketches we found two control points, but for different bezier curves:
    //  - control point p1 (Figure 4) is needed to draw the left bezier (red in Figures 1 & 2)
    //  - and p2 is needed to draw the right (orange) bezier.
    // This just means that we have to calculate all of the control points
    // (or at least those a knot fore and aft of where we are) before drawing.
    // Closed curves need the control points at the "beginning" and "end" points (wherever you start and end),
    // more bookkeeping.
    // But the result is a simple, fast bezier spline routine with only one parameter to adjust the curvature.

    // Note in the demo that when t=0 the curves become straight lines connecting the knot points,
    // and when t=1 the curves are "too curvy" for the open zigzag curve,
    // but actually for the square (lower left), t=1 makes a nice "rounded square" that might be a useful shape.
    // There is no upper bound to t, but above t=1 you're almost guaranteed to get distracting cusps and loops.
    // For that matter, t can be negative, which is great for drawing knots.

    return curr;
};

var smoothPath = function smoothPath(path, curviness) {
    //@TODO, only sections params
    //@TODO, cache handles
    var bezier = void 0;
    var length = path.isClosed() ? path.points.length - 1 : path.points.length;
    for (var i = 0; i < length; i += 1) {
        bezier = smoothPoint(path.prev(i), path.get(i), path.next(i), curviness);
        path.replace(i, bezier);
    }
};

var Bezier = {
    smoothPath: smoothPath,
    smoothPoint: smoothPoint
};

var TWO_PI = Math.PI * 2;
var HALF_PI = Math.PI / 2;

var cartesianFromPolar = function cartesianFromPolar(radius, delta) {
    var point = new Point.Polar(radius, delta);
    point = point.toCartesian();
    return point;
};

////
// Line
////

var Line = function Line(from, to, segments, origin) {
    var path = new Path(origin);
    path.add(from);
    path.add(to);
    this.path = path;

    if (typeof segments === 'number') {
        this.segmentize(segments);
    }
};

// TODO maybe this is a good general path method. if so it needs to consider open and close
Line.prototype.segmentize = function (segments) {
    var last = this.path.last();
    var length = this.path.length();

    var segm = last.clone();
    segm.substract(this.path.first());
    segm.multiplyBy(1 / segments);

    // remove everything except first element, keep instance
    if (length > 1) {
        this.path.points.splice(1, this.path.length());
    }

    segments -= 2; // first, lasts
    for (var i = 0; i <= segments; i += 1) {
        this.path.progress(segm.clone());
    }
    this.path.addPoint(last);
};

////
// Polygon
////

var Polygon = function Polygon(segments, radius, origin) {
    var path = new Path(origin);
    var i = 0;

    //@see http://stackoverflow.com/a/7198179
    var delta = TWO_PI / segments;

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

    //@see http://stackoverflow.com/a/7198179
    var rad0 = HALF_PI;
    var delta = TWO_PI / segments;
    var _delta = void 0;
    var inner = void 0;
    var outer = void 0;
    var i = 0;

    while (i < segments) {
        _delta = i * delta - rad0;
        outer = cartesianFromPolar(outerRadius, _delta);
        path.add(outer.x, outer.y);

        if (i <= segments - 1) {
            _delta += delta / 2;
            inner = cartesianFromPolar(innerRadius, _delta);
            path.add(inner.x, inner.y);
        }
        i += 1;
    }
    path.close();
    this.path = path;
};

// apply bezier to outer points only
Star.prototype.flower = function (tension) {
    var bezier = void 0;
    var length = this.path.points.length - 1;
    for (var i = 0; i < length; i += 2) {
        bezier = Bezier.smoothPoint(this.path.prev(i), this.path.get(i), this.path.next(i), tension);
        this.path.replace(i, bezier);
    }
};

// apply bezier to outer points only
Star.prototype.seaStar = function (tension) {
    var bezier = void 0;
    var length = this.path.points.length - 1;
    for (var i = 1; i < length; i += 2) {
        bezier = Bezier.smoothPoint(this.path.prev(i), this.path.get(i), this.path.next(i), tension);
        this.path.replace(i, bezier);
    }
};

////
// Cog
////

var Cog = function Cog(segments, outerRadius, innerRadius, origin) {
    var path = new Path(origin);

    //@TODO, sharable constant
    // 5 segments > 10 outer points > 10 inner points
    var rad0 = HALF_PI;
    var delta = TWO_PI / segments;
    var _innerDelta = delta - delta / 2;
    var _delta = void 0;
    var inner = void 0;
    var outer = void 0;
    var i = 0;

    while (i < segments) {
        _delta = i * delta - rad0;
        outer = [cartesianFromPolar(outerRadius, _delta + _innerDelta), cartesianFromPolar(outerRadius, _delta + 2 * _innerDelta)];
        //outer
        path.add(outer[0].x, outer[0].y);
        path.add(outer[1].x, outer[1].y);
        // inner
        _delta += delta / 2;
        inner = [cartesianFromPolar(innerRadius, _delta + _innerDelta), cartesianFromPolar(innerRadius, _delta + 2 * _innerDelta)];
        path.add(inner[0].x, inner[0].y);
        path.add(inner[1].x, inner[1].y);

        i += 1;
    }
    path.close();
    this.path = path;
};



var Polygons = Object.freeze({
	Line: Line,
	Polygon: Polygon,
	Rectangle: Rectangle,
	Star: Star,
	Cog: Cog
});

/**
 *  Goal
 * - define steps
 * - set counter 0
 * - create mrph array
 * - target figure
 * - src figure
 *      - set each point to i * segment, centerY
 *          -set each handle to 0,0,0
 *      - targ[i].x - src[i].x / steps
 *          - set each handle targ[i].member[k] - src[i].members[k] / steps
 * morph from a line into a star and back
 * better: store array of polar points in template,
 * convert figure point to polar and check radius length
 * star is closed, so length - 1
*/

//@TODO morphe groups
//@TODO replace callback with just two paths to morphe, do not make them dependent on the lasme length
var computeUnit = function computeUnit(src, targ, steps) {
    var unit = targ.clone();
    unit.substract(src);
    unit.multiplyBy(1 / steps);
    return unit;
};

var Morpher = function Morpher(srcPath, targPath, steps) {
    var map = [];
    var length = srcPath.length();
    console.log(srcPath.length(), targPath.length());
    // TODO: what to do if both paths have a different length?
    var unit = void 0;
    var mLength = void 0;

    for (var i = 0; i < length; i += 1) {
        // targ is group

        if (typeof targPath.points[i].members !== 'undefined') {
            mLength = targPath.points[i].members.length;
            for (var k = 0; k < mLength; k += 1) {
                //src to group
                if (typeof srcPath.points[i].members === 'undefined') {
                    srcPath.points[i] = Group.create(srcPath.points[i]);
                    srcPath.points[i].members.push(srcPath.points[i].clone());
                    srcPath.points[i].members.push(srcPath.points[i].clone());
                }
            }
        }

        unit = computeUnit(srcPath.points[i], targPath.points[i], steps);
        map.push([srcPath.points[i], targPath.points[i], unit]);
    }

    this.map = map;
    this.count = 0;
    this.steps = steps;
    this.direction = 1;
};

Morpher.prototype.next = function () {
    if (this.count >= this.steps) {
        this.direction = -1;
        return false;
    }

    var length = this.map.length;
    for (var i = 0; i < length; i += 1) {
        this.map[i][0].add(this.map[i][2]); //unit
    }

    this.count += 1;
    return true;
};

Morpher.prototype.prev = function () {
    if (this.count <= 0) {
        this.direction = 1;
        return false;
    }

    var length = this.map.length;
    for (var i = 0; i < length; i += 1) {
        this.map[i][0].substract(this.map[i][2]); //unit
    }

    this.count -= 1;
    return true;
};

Morpher.prototype.progress = function () {
    if (this.direction > 0) {
        this.next();
        return;
    }
    this.prev();
};

Morpher.prototype.finished = function () {
    if (this.direction > 0) {
        return this.count === this.steps;
    }
    return this.count === 0;
};

Morpher.prototype.reverse = function () {
    this.direction *= -1;
};

var Module = {
    Point: Point,
    Path: Path,
    Group: Group,
    Bezier: Bezier,
    Morpher: Morpher
};

// hm...
Object.keys(Polygons).forEach(function (key) {
    Module[key] = Polygons[key];
});

export default Module;
//# sourceMappingURL=Space.module.js.map
