import Point from './Point';
import Group from './Group';

/**
 * Rob Spencer's algorithm
 * @see http://scaledinnovation.com/analytics/splines/aboutSplines.html
 * @TODO angles. Angles from tangent (positive, negative) It might be worth to check if we can use Point.polar ops in general
 * @TODO tension as absolute progression value (pixels) if tension is an array add instead multiply
 * function bezier(prev, curr, next, [100, 50], [45, -25])
 */
const smoothPoint = function (prev, curr, next, tension) {

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
    const d01 = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    const d12 = Math.sqrt(Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2));
    /* eslint-enable no-restricted-properties */

    const fa = tension * (d01 / (d01 + d12)); // scaling factor for triangle Ta
    const fb = tension - fa; // ditto for Tb, simplifies to fb=t-fa

    const p1x = curr.x + (fa * (prev.x - next.x)); // x2-x0 is the width of triangle T
    const p1y = curr.y + (fa * (prev.y - next.y)); // y2-y0 is the height of T

    const p2x = curr.x - (fb * (prev.x - next.x));
    const p2y = curr.y - (fb * (prev.y - next.y));

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

const smoothPath = function (path, curviness) {
    //@TODO, only sections params
    //@TODO, cache handles
    let bezier;
    const length = (path.isClosed()) ? path.points.length - 1 : path.points.length;
    for (let i = 0; i < length; i += 1) {
        bezier = smoothPoint(path.prev(i), path.get(i), path.next(i), curviness);
        path.replace(i, bezier);
    }
};

export default {
    smoothPath,
    smoothPoint
};
