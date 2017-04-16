import Point from './Point';
import Path from './Path';
import Group from './Group';
import * as Polygons from './Polygon';
import Bezier from './Bezier';

const Module = {
    Point,
    Path,
    Group,
    Bezier
};

// hm...
Object.keys(Polygons).forEach((key) => {
    Module[key] = Polygons[key];
});

export default Module;
