import Path from './Path';
import Point from './Point';

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

export {
    Polygon,
    Rectangle,
    Star
};
