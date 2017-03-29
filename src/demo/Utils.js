export default {
    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    randInt: function (min, max) {
        min = min || -1;
        max = max || 1;
        // eslint-disable-next-line no-mixed-operators
        return Math.random() * (max - min) + min;
    },

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    bounds: function (val, min, max) {
        val = (min !== false && val < min) ? min : val;
        val = (max !== false && val > max) ? max : val;
        return val;
    },

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    randIntRange: function (base, range, bounce = []) {
        if (bounce.length) {
            if ((base + range[1]) > bounce[1]) {
                base -= range[1];
            }
            if ((base + range[0]) < bounce[0]) {
                base -= range[0];
            }
        }

        return base + this.randInt(range[0], range[1]);
    }
};
