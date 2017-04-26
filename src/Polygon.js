import Path from './Path';
import Point from './Point';
import Bezier from './Bezier';

////
// Polygon
////

/**
 * x translate
 * rotate
 * scale
 */

const Polygon = function (segments, radius, origin) {
    const path = new Path(origin);
    let i = 0;

    //@see http://stackoverflow.com/a/7198179
    const delta = (Math.PI * 2) / segments;

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

    const _point = function (radius, delta) {
        let point = new Point.Polar(radius, delta);
        point = point.toCartesian();
        return point;
    };

    //@see http://stackoverflow.com/a/7198179
    const rad0 = Math.PI / 2;
    const delta = (Math.PI * 2) / segments;
    let _delta;
    let inner;
    let outer;
    let i = 0;

    while (i < segments) {
        _delta = (i * (delta)) - rad0;
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

    //@TODO, sharable function (star)
    const _point = function (radius, delta) {
        let point = new Point.Polar(radius, delta);
        point = point.toCartesian();
        return point;
    };

    //@TODO, sharable constant
    // 5 segments > 10 outer points > 10 inner points
    const rad0 = Math.PI / 2;
    const delta = (Math.PI * 2) / (segments * 4);
    let _delta;
    let inner;
    let outer;
    let i = 0;

    while (i < segments) {
        _delta = (i * delta) - rad0;
        outer = [
            _point(outerRadius, _delta),
            _point(outerRadius, _delta + delta)
        ];

        path.add(outer[0].x, outer[0].y);
        path.add(outer[1].x, outer[1].y);

        if (i <= segments - 1) {
            _delta += delta / 2;
            inner = [
                _point(innerRadius, _delta),
                _point(innerRadius, _delta + delta)
            ];
            path.add(inner[0].x, inner[0].y);
            path.add(inner[1].x, inner[1].y);
        }
        i += 2;
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
