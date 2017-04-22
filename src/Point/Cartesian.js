import Spherical from './Spherical';
import Polar from './Polar';

////
// Cartesian
////

const Cartesian = function (x, y, z) {
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
    return this.phi() - (Math.PI / 2);
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
    let p = this.toPolar();
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

// comparasion

Cartesian.prototype.equals = function (p) {
    return ((this.x === p.x) && (this.y === p.y) && (this.z === p.z));
};

// min, max

Cartesian.prototype.min = function (v) {
    this.x = (this.x > v.x) ? v.x : this.x;
    this.y = (this.y > v.y) ? v.y : this.y;
};

Cartesian.prototype.max = function (v) {
    this.x = (this.x < v.x) ? v.x : this.x;
    this.y = (this.y < v.y) ? v.y : this.y;
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
    if (typeof x === 'object' && typeof x.clone === 'function') {
        return x;
    }
    return new Cartesian(x, y, z);
};

export default Cartesian;
