const World = function (origin) {
    origin = origin || null;
    
    if(!origin || typeof origin.clone !== 'function'){
        throw Error('World constructor requires a Space.Point.Cartesian instance');
    }
    
    this.origin = function () {
        return origin.clone();
    };

    this.locate = function (point) {
        point.add(origin);
        return point;
    };
};

export default World;
