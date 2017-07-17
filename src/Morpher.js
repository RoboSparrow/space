import Group from './Group';
import Point from './Point';
import Path from './Path';

/**
 *  Goal
 * - define steps
 * - set counter 0
 * - create mrph array
 * - target figure
 * - src figure
 *      - set each point to i * segment, centerY
 *          -set each handle to 0,0,0
 *      - targ[i].x - src[i].x / steps
 *          - set each handle targ[i].member[k] - src[i].members[k] / steps
 * morph from a line into a star and back
 * better: store array of polar points in template,
 * convert figure point to polar and check radius length
 * star is closed, so length - 1
*/

// TODO center view

const apply = function (point, reference, operator) {
    point.x += (operator * reference.x);
    point.y += (operator * reference.y);
    point.z += (operator * reference.z);
    //TODO compute: create Group by default and remove condition
    if (typeof point.members !== 'undefined') {
        const length = point.members.length;
        for (let i = 0; i < length; i += 1) {
            apply(point.members[i], reference.members[i], operator);
        }
    }
};

const computeUnitArray = function (srcArr, targArr, steps) {
    const length = srcArr.length;
    const unit = [];
    for (let i = 0; i < length; i += 1) {
        unit[i] = targArr[i] - srcArr[i];
        unit[i] /= steps;
    }
    return unit;
};

const normalizeArray = function (arr, refArr) {
    if (arr.length >= refArr.length) {
        return arr;
    }
    const min = arr.length;
    const max = refArr.length;
    for (let i = min; i < max; i += 3) {
        Array.prototype.push.apply(arr, [arr[0], arr[1], arr[2]]);
    }
    return arr;
};

const compute = function (src, targ, steps) {
    let s = src.toArray();
    let t = targ.toArray();

    normalizeArray(s, t);
    normalizeArray(t, s);

    let unit = computeUnitArray(s, t, steps);

    if (s.length > 3) {
        s = Group.fromArray(s);
        t = Group.fromArray(t);
        unit = Group.fromArray(unit);
    } else {
        s = Point.Cartesian.fromArray(s);
        t = Point.Cartesian.fromArray(t);
        unit = Point.Cartesian.fromArray(unit);
    }

    return [s, t, unit];
};

const Morpher = function (srcPath, targPath, steps) {
    this.path = new Path(srcPath.origin());
    this.map = [];

    ////TODO deal with origin for maps, and different origins for target and path
    const length = srcPath.length();

    let computedStep;
    for (let i = 0; i < length; i += 1) {
        computedStep = compute(srcPath.points[i], targPath.points[i], steps);
        this.path.add(computedStep[0]);
        this.map.push(computedStep[2]);//TODO use an object instead
    }
    if (srcPath.isClosed()) {
        this.path.close();
    }

    this.count = 0;
    this.steps = steps;
    this.direction = 1;
};

Morpher.prototype.next = function () {
    if (this.count >= this.steps) {
        this.direction = -1;
        return false;
    }

    const length = this.path.length();//TODO global?
    let item;
    for (let i = 0; i < length; i += 1) {
        item = this.path.get(i);
        apply(item, this.map[i], 1);
    }

    this.count += 1;
    return true;
};

Morpher.prototype.prev = function () {
    if (this.count <= 0) {
        this.direction = 1;
        return false;
    }

    const length = this.path.length();//TODO global?
    let item;
    for (let i = 0; i < length; i += 1) {
        item = this.path.get(i);
        apply(item, this.map[i], -1);
    }

    this.count -= 1;
    return true;
};

Morpher.prototype.progress = function () {
    if (this.direction > 0) {
        this.next();
        return;
    }
    this.prev();
};

Morpher.prototype.finished = function () {
    if (this.direction > 0) {
        return this.count === this.steps;
    }
    return this.count === 0;
};

Morpher.prototype.reverse = function () {
    this.direction *= -1;
};

export default Morpher;
