const State = {
    canvas: {
        width: 500,
        height: 500,
        strokeStyle: 'hsla(300, 100%, 75%, 1)',
        fillStyle: 'rgba(0, 0, 0, .08)',
        lineWidth: 0.1
    },
    clone: function (prop, merge) {
        merge = merge || {};

        const clone = {};
        Object.keys(this[prop]).forEach((key) => {
            clone[key] = (key in merge) ? merge[key] : this[prop][key];
        });

        return clone;
    }
};

export default State;
