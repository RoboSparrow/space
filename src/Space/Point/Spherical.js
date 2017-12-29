import Cartesian from './Cartesian';

////
// Spherical
////

const Spherical = function (r, phi, theta) {
    this.r = r || 0;            // distance
    this.phi = phi || 0;        // polar angle
    this.theta = theta || 0;    // azimuthal angle
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
    return this.phi - (Math.PI / 2);
};

Spherical.prototype.lng = function () {
    return this.theta;
};

export default Spherical;
