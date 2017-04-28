import Path from './Path';
import Point from './Point';
import Bezier from './Bezier';

////
// Polygon
////

const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const cartesianFromPolar = function (radius, delta) {
    let point = new Point.Polar(radius, delta);
    point = point.toCartesian();
    return point;
};

const Line = function (from, to, segments, origin) {
    const path = new Path(origin);
    path.add(from);
    path.add(to);
    if(typeof segments === 'number'){
        this.segmentize(segments);
    }
    this.path = path;
};
// TODO maybe this is a good general path method. if so it needs to consider open and close
Line.prototype.segmentize = function (segments) {
    const length = this.path.length();
    const diff = this.path.first().clone().substract(this.path.last());
    //diff.multiplyBy();
    if(length > 2){
        this.path.points.splice(1, this.path.length() - 2);
    }
    //insert after
};

const Polygon = function (segments, radius, origin) {
    const path = new Path(origin);
    let i = 0;

    //@see http://stackoverflow.com/a/7198179
    const delta = TWO_PI / segments;

    while (i < segments) {
        const p = new Point.Polar(radius, i * delta);
        const c = p.toCartesian();
        path.add(c.x, c.y);
        i += 1;
    }
    path.close();
    this.path = path;
};

////
// Rectangle
////

const Rectangle = function (width, height, origin) {
    const path = new Path(origin);

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

const Star = function (segments, outerRadius, innerRadius, origin) {
    const path = new Path(origin);

    //@see http://stackoverflow.com/a/7198179
    const rad0 = HALF_PI;
    const delta = TWO_PI / segments;
    let _delta;
    let inner;
    let outer;
    let i = 0;

    while (i < segments) {
        _delta = (i * delta) - rad0;
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
    let bezier;
    const length = this.path.points.length - 1;
    for (let i = 0; i < length; i += 2) {
        bezier = Bezier.smoothPoint(this.path.prev(i), this.path.get(i), this.path.next(i), tension);
        this.path.replace(i, bezier);
    }
};

// apply bezier to outer points only
Star.prototype.seaStar = function (tension) {
    let bezier;
    const length = this.path.points.length - 1;
    for (let i = 1; i < length; i += 2) {
        bezier = Bezier.smoothPoint(this.path.prev(i), this.path.get(i), this.path.next(i), tension);
        this.path.replace(i, bezier);
    }
};

////
// Cog
////

const Cog = function (segments, outerRadius, innerRadius, origin) {
    const path = new Path(origin);

    //@TODO, sharable constant
    // 5 segments > 10 outer points > 10 inner points
    const rad0 = HALF_PI;
    const delta = TWO_PI / segments;
    const _innerDelta = delta - (delta / 2);
    let _delta;
    let inner;
    let outer;
    let i = 0;

    while (i < segments) {
        _delta = (i * delta) - rad0;
        outer = [
            cartesianFromPolar(outerRadius, _delta + _innerDelta),
            cartesianFromPolar(outerRadius, _delta + (2 * _innerDelta))
        ];
        //outer
        path.add(outer[0].x, outer[0].y);
        path.add(outer[1].x, outer[1].y);
        // inner
        _delta += delta / 2;
        inner = [
            cartesianFromPolar(innerRadius, _delta + _innerDelta),
            cartesianFromPolar(innerRadius, _delta + (2 * _innerDelta))
        ];
        path.add(inner[0].x, inner[0].y);
        path.add(inner[1].x, inner[1].y);

        i += 1;
    }
    path.close();
    this.path = path;
};

// apply bezier to outer points only
// Cog.prototype.flower = function (tension) {
//     //@TODO
// };

// // apply bezier to outer points only
// Cog.prototype.seaStar = function (tension) {
//     //@TODO
// };

export {
    Polygon,
    Rectangle,
    Star,
    Cog
};
