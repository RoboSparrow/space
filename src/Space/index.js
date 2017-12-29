import Point from './Point';
import Path from './Path';
import Group from './Group';
import * as Polygons from './Polygon';
import Bezier from './Bezier';
import Morpher from './Morpher';

const Module = {
    Point,
    Path,
    Group,
    Bezier,
    Morpher
};

// hm...
Object.keys(Polygons).forEach((key) => {
    Module[key] = Polygons[key];
});

export default Module;
