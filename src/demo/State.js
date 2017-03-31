const State = {
    canvas: {
        width: 500,
        height: 500,
        strokeStyle: 'hsla(300, 100%, 75%, 1)',
        fillStyle: 'rgba(0, 0, 0, .08)',
        lineWidth: 0.1
    },
    // shallow(!) clone and merge in submitted properties
    factor: function (property, merge) {
        merge = merge || {};
        Object.keys(this[property]).forEach((key) => {
            merge[key] = (typeof merge[key] !== 'undefined') ? merge[key] : this[property][key];
        });
        return merge;
    }
};

export default State;
