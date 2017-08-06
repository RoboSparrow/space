import Group from './Group';
import Point from './Point';
import Path from './Path';

// TODO center view
// TODO Morph/Random/Line doesn't work

/**
 * Applies a step transform deeply to a group
 * our normal poitn.multiply cannot be used here as it would not deep transorm mebers against reference memebers,
 * only members against the main coordinates
 *
 * srcPath and targPath need to have the same length TODO: handle segment normalization
 * Ervery srcPath items will be first normalized against it's targPath partner,
 *      it will be always a group
 *      it will have n members, where n is the max of either length
 *      member indexes who dont exist in src will be created as point with the same coordinates as src
 */
const apply = function (point, reference, operator) {
    point.x += (operator * reference.x);
    point.y += (operator * reference.y);
    point.z += (operator * reference.z);

    if (typeof point.members !== 'undefined') {
        const length = point.members.length;
        for (let i = 0; i < length; i += 1) {
            apply(point.members[i], reference.members[i], operator);
        }
    }
};

/**
 * Comuptes a transformation unit group for a single src group vin relation to it's targ gruop based on the steps
 * src and targ need to be normalized groups, i.e. have the same member length
 */
const computeUnit = function (src, targ, steps) {
    let x;
    let y;
    let z;

    x = (targ.x - src.x) / steps;
    y = (targ.y - src.y) / steps;
    z = (targ.z - src.z) / steps;
    const unit = new Group(x, y, z);

    const length = src.members.length;
    for (let i = 0; i < length; i += 1) {
        x = (targ.members[i].x - src.members[i].x) / steps;
        y = (targ.members[i].y - src.members[i].y) / steps;
        z = (targ.members[i].z - src.members[i].z) / steps;
        unit.members[i] = new Point.Cartesian(x, y, z);
    }
    src.unit = unit;
    return unit;
};

const normalizeGroup = function (src, targ) {
    const length = (targ.members.length > src.members.length) ? targ.members.length : src.members.length;
    for (let i = 0; i < length; i += 1) {
        if (typeof src.members[i] === 'undefined') {
            src.members[i] = new Point.Cartesian(src.x, src.y, src.z);
        }
        if (typeof targ.members[i] === 'undefined') {
            targ.members[i] = new Point.Cartesian(targ.x, targ.y, targ.z);
        }
    }
    return [src, targ];
};

/**
 * Morper creates a new draw path (always path of groups) from a srcpath and normalizes it against targPath,
 * A computed array of computed "unit" groups maps against this path. Every unit contains
 *
 * targPath and srcPath need to be paths
 *      they must have the same length(),
 *      they can be open or closed
 */

const Morpher = function (srcPath, targPath, steps) {
    this.src = new Path(srcPath.origin());
    this.targ = new Path(targPath.origin());
    this.units = [];

    // TODO deal with origin for maps, and different origins for target and path
    const length = srcPath.length();

    for (let i = 0; i < length; i += 1) {
        this.compute(srcPath.points[i], targPath.points[i], steps);
    }

    if (srcPath.isClosed()) {
        this.src.close();
    }
    if (targPath.isClosed()) {
        this.src.close();
    }

    this.count = 0;
    this.steps = steps;
    this.direction = 1;
};

/**
 * normalize src vs targ and compute respective unit
 */
Morpher.prototype.compute = function (src, targ, steps) {
    const s = Group.create(src);
    const t = Group.create(targ);

    const g = normalizeGroup(s, t);
    this.src.add(g[0]);
    this.targ.add(g[1]);

    const unit = computeUnit(g[0], g[1], steps);
    this.units.push(unit);
};

/**
 * Apply forward transformation to single item
 */
Morpher.prototype.next = function () {
    //return;//dev
    if (this.count >= this.steps) {
        this.reverse();
        return false;
    }

    const length = this.src.length();//TODO global?
    let item;
    for (let i = 0; i < length; i += 1) {
        item = this.src.get(i);
        apply(item, item.unit, 1);
    }

    this.count += 1;
    return true;
};

/**
 * Apply backward transformation to single item
 */
Morpher.prototype.prev = function () {
    if (this.count <= 0) {
        this.reverse();
    }

    const length = this.src.length();//TODO global?
    let item;
    for (let i = 0; i < length; i += 1) {
        item = this.src.get(i);
        apply(item, item.unit, -1);
    }

    this.count -= 1;
    return true;
};

/**
 * progress transformation to next step, based on this.direction
 */
Morpher.prototype.progress = function () {
    if (this.direction > 0) {
        this.next();
        return;
    }
    this.prev();
};

/**
 * checks if a transformation progress is finished
 */
Morpher.prototype.finished = function () {
    if (this.direction > 0) {
        return this.count === this.steps;
    }
    return this.count === 0;
};

/**
 * reverse progress direction 
 */
Morpher.prototype.reverse = function () {
    this.direction *= -1;
};

export default Morpher;
