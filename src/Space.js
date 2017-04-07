import Point from './Point';
import Path from './Path';
import BezierPath from './BezierPath';
import * as Polygons from './Polygon';

const Module = {
    Point,
    Path,
    BezierPath
};

// hm...
Object.keys(Polygons).forEach((key) => {
    Module[key] = Polygons[key];
});

export default Module;
