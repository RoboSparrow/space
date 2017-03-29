import Point from './Point';
import Path from './Path';
import * as Polygons from './Polygon';

const Module = {
    Point,
    Path
};

// hm...
Object.keys(Polygons).forEach((key) => {
    Module[key] = Polygons[key];
});

export default Module;
