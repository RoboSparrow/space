import Path from './Path';
import Point from './Point';

////
// Polygon
////

/**
 * translate center
 * set center
 * rotate
 * scale
 */

const Polygon = function (segments, radius, center) {
    center = center || null;// node v8: no default params

    const path = new Path();
    let i = 0;

    if (!center) {
        center = new Point.Cartesian(0, 0, 0);
    }

    //@see http://stackoverflow.com/a/7198179
    const delta = (Math.PI * 2) / segments;

    while (i < segments) {
        const p = new Point.Polar(radius, i * delta);
        const c = p.toCartesian();
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

const Rectangle = function (width, height, center) {
    center = center || null;// node v8: no default params

    //@TODO check ispoint
    if (!center) {
        center = new Point.Cartesian(0, 0, 0);
    }

    //@see http://stackoverflow.com/a/7198179
    const first = center.clone();
    first.add(new Point.Cartesian(-width / 2, height / 2));

    const path = new Path(first.x, first.y);
    path.progress(width, 0);
    path.progress(0, -height);
    path.progress(-width, 0);
    path.close();

    this.path = path;
};

////
// Star
////

const Star = function (segments, outerRadius, innerRadius, center) {

    const _point = function (radius, delta, _center) {
        let point = new Point.Polar(radius, delta);
        point = point.toCartesian();
        point.add(_center);
        return point;
    };

    center = center || null;// node v8: no default params
    const path = new Path();
    let i = 0;

    if (!center) {
        center = new Point.Cartesian(0, 0, 0);
    }

    //@see http://stackoverflow.com/a/7198179
    const rad0 = Math.PI / 2;
    const delta = (Math.PI * 2) / segments;
    let _delta;
    let inner;
    let outer;

    while (i < segments) {
        _delta = (i * (delta)) - rad0;
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

export {
    Polygon,
    Rectangle,
    Star
};
