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

const Morpher = function (src, targ, steps) {
    const map = [];

    const length = src.length();
    // TODO: what to do if both paths have a different length?
    let unit;
    for (let i = 0; i < length; i += 1) {
        unit = src.points[i].clone();
        unit.substract(targ.points[i]);
        unit.multiplyBy(1 / steps);
        map.push([src.points[i], targ.points[i], unit]);
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
