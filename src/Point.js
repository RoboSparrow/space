const Point = {};

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
    return this.phi() - (Math.PI / 2);
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
    let p = this.toPolar();
    p.phi += phi;
    p = p.toCartesian();
    this.x = p.x;
    this.y = p.y;
    this.add(origin);
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
    return ((this.x === p.x) && (this.y === p.y) && (this.z === p.z));
};

Point.Cartesian.prototype.toArray = function () {
    return [this.x, this.y, this.z];
};

////
// Point.Polar
////

Point.Polar = function (r, phi) {
    this.r = r || 0;            // distance
    this.phi = phi || 0;        // polar angle
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
    this.r = r || 0;            // distance
    this.phi = phi || 0;        // polar angle
    this.theta = theta || 0;    // azimuthal angle
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
    return this.phi - (Math.PI / 2);
};

Point.Spherical.prototype.lng = function () {
    return this.theta;
};

export default Point;
