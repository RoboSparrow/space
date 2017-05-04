import Cartesian from './Point/Cartesian';

////
// Group is a Group of Cartesian Points
////

const Group = function (x, y, z) {
    Cartesian.call(this, x, y, z);

    // control points
    this.members = [];
};

Group.prototype = Object.create(Cartesian.prototype);
Group.prototype.constructor = Group;

// Operations

Group.prototype.add = function (p) {
    Cartesian.prototype.add.call(this, p);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].add(p);
    }
};

Group.prototype.substract = function (p) {
    Cartesian.prototype.substract.call(this, p);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].substract(p);
    }
};

Group.prototype.multiply = function (p) {
    Cartesian.prototype.multiply.call(this, p);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].multiply(p);
    }
};

// world operations

Group.prototype.scale = function (origin, p) {
    Cartesian.prototype.scale.call(this, origin, p);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].scale(origin, p);
    }
};

Group.prototype.rotate2D = function (origin, phi) {
    Cartesian.prototype.rotate2D.call(this, origin, phi);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].rotate2Dy(origin, phi);
    }
};

// operations with primitives

Group.prototype.translate = function (x, y, z) {
    Cartesian.prototype.translate.call(this, x, y, z);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].translate(x, y, z);
    }
};

Group.prototype.multiplyBy = function (f) {
    Cartesian.prototype.multiplyBy.call(this, f);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        this.members[i].multiplyBy(f);
    }
};


// exports

Group.prototype.clone = function () {
    const clone = new Group(this.x, this.y, this.z);
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        clone.members[i] = this.members[i].clone();
    }
    return clone;
};

Group.prototype.toArray = function () {
    const arr = [this.x, this.y, this.z];
    const length = this.members.length;
    for (let i = 0; i < length; i += 1) {
        arr.push(this.members[i].x, this.members[i].y, this.members[i].z);
    }
    return arr;
};

// static methods

Group.create = function (x, y, z) {
    //is point like
    if (typeof x === 'object' && typeof x.clone === 'function') {
        // is a a group already
        if (typeof x.members !== 'undefined') {
            return x;
        }
        // is a cartesian point
        return new Group(x.x, x.y, x.z);
    }
    return new Group(x, y, z);
};

// creates a bezier point with two handles from coordinates or a given cartesian point
// if not already set the handles are set to the coordinates of the group point (sharp edge)
Group.createBezier2D = function (x, y, z) {
    const g = Group.create(x, y, z);
    const handle = new Cartesian(g.x, g.y, g.z);
    if (!g.members.length) {
        g.members[0] = handle;
    }
    if (g.members.length === 1) {
        g.members[1] = handle.clone();
    }
    return g;
};


export default Group;
