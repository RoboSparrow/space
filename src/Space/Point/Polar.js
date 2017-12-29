import Cartesian from './Cartesian';

////
// Polar
////

const Polar = function (r, phi) {
    this.r = r || 0;            // distance
    this.phi = phi || 0;        // polar angle
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

export default Polar;
