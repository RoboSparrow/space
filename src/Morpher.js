import Group from './Group';

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

//@TODO morphe groups
//@TODO replace callback with just two paths to morphe, do not make them dependent on the lasme length
const computeUnit = function (src, targ, steps) {
    const unit = targ.clone();
    unit.substract(src);
    unit.multiplyBy(1 / steps);
    return unit;
};

const Morpher = function (srcPath, targPath, steps) {
    const map = [];
    const length = srcPath.length();
    // TODO: what to do if both paths have a different length?
    let unit;
    let mLength;

    for (let i = 0; i < length; i += 1) {
        // targ is group

        if (typeof targPath.points[i].members !== 'undefined') {
            mLength = targPath.points[i].members.length;
            for (let k = 0; k < mLength; k += 1) {
                //src to group
                if (typeof srcPath.points[i].members === 'undefined') {
                    srcPath.points[i] = Group.create(srcPath.points[i]);
                    srcPath.points[i].members.push(srcPath.points[i].clone());
                    srcPath.points[i].members.push(srcPath.points[i].clone());

                }
            }
        }

        unit = computeUnit(srcPath.points[i], targPath.points[i], steps);
        map.push([srcPath.points[i], targPath.points[i], unit]);
    }

    this.map = map;
    this.count = 0;
    this.steps = steps;
    this.direction = 1;
};

Morpher.prototype.next = function () {
    if (this.count >= this.steps) {
        this.direction = -1;
        return false;
    }

    const length = this.map.length;
    for (let i = 0; i < length; i += 1) {
        this.map[i][0].add(this.map[i][2]); //unit
    }

    this.count += 1;
    return true;
};

Morpher.prototype.prev = function () {
    if (this.count <= 0) {
        this.direction = 1;
        return false;
    }

    const length = this.map.length;
    for (let i = 0; i < length; i += 1) {
        this.map[i][0].substract(this.map[i][2]); //unit
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
