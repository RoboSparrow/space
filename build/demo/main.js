(function (Vue,VueRouter) {
'use strict';

Vue = 'default' in Vue ? Vue['default'] : Vue;
VueRouter = 'default' in VueRouter ? VueRouter['default'] : VueRouter;

var Animation = function Animation() {
    this.id = null;
    this.count = 0;
    this.running = false;
    this.interval = -1;
    this.last = new Date().getTime();
    this.callbacks = [];
};

// register callback
Animation.prototype.fps = function (fps) {
    this.interval = fps < 0 ? -1 : 1000 / fps;
    return this;
};

// register callback
Animation.prototype.add = function (callback) {
    this.callbacks.push(callback);
    return this;
};

// clear all callbacks
Animation.prototype.clear = function () {
    this.callbacks.splice(0, this.callbacks.length);
    return this;
};

// clear all callbacks
Animation.prototype.only = function (callback) {
    this.clear().add(callback);
    return this;
};

Animation.prototype.play = function () {
    var _this = this;

    this.running = true;

    var callback = function callback() {
        if (!_this.running) {
            return;
        }

        var now = new Date().getTime();
        var delta = now - _this.last;

        if (_this.interval < 0 || delta > _this.interval) {
            _this.last = now - delta % _this.interval;
            _this.callbacks.forEach(function (fn) {
                _this.count += 1;
                fn();
            });
        }

        _this.id = window.requestAnimationFrame(callback);
    };

    this.id = window.requestAnimationFrame(callback);
    return this;
};

Animation.prototype.stop = function () {
    this.running = false;
    this.count = 0;
    return this;
};

Animation.prototype.pause = function () {
    this.running = false;
    return this;
};

Animation.prototype.reset = function () {
    this.running = false;
    return this;
};

Animation.prototype.toggle = function () {
    if (this.running) {
        this.pause();
    } else {
        this.play();
    }
    return this;
};

var document$1 = window.document;
var CLASS_NAME = 'canvas';

var Canvas2d = function Canvas2d() {
    var canvas = document$1.createElement('canvas');
    canvas.className = CLASS_NAME;
    var ctx = canvas.getContext('2d');

    this.canvas = canvas;
    this.ctx = ctx;
};

Canvas2d.prototype.clear = function () {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

var Utils = {
    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    randInt: function randInt(min, max) {
        return Math.floor(Math.random() * (max - (min + 1))) + min;
    },

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    bounds: function bounds(val, min, max) {
        val = val < min ? min + 1 : val;
        val = val > max ? max - 1 : val;
        return val;
    },

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    randIntRange: function randIntRange(base, range) {
        var bounce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        if (bounce.length) {
            if (base + range[1] > bounce[1]) {
                base -= range[1];
            }
            if (base + range[0] < bounce[0]) {
                base -= range[0];
            }
        }

        return base + this.randInt(range[0], range[1]);
    }
};

(function () {
    if (document) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var Space = window.Space;
var state = {
    prev: null,
    segments: 100,
    segmentsRange: 10
};

var compute = function compute(state, canvas) {
    if (!state.prev) {
        state.prev = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    var path = new Space.Path(state.prev.x, state.prev.y);
    var range = state.segmentsRange;
    var count = 0;
    var rand = void 0;
    while (count < state.segments) {
        rand = Utils.randInt(-state.segmentsRange, state.segmentsRange);
        var x = Utils.bounds(path.last().x + rand, 0, canvas.width);
        rand = Utils.randInt(-state.segmentsRange, state.segmentsRange);
        var y = Utils.bounds(path.last().y + rand, 0, canvas.height);
        // console.log('here', x, y);
        path.add(x, y);
        count++;
    }

    return path;
};

var Path = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segments, expression: "state.segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "500", "step": "10" }, domProps: { "value": _vm.state.segments }, on: { "__r": function __r($event) {
                    _vm.state.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segments) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])]), _c('pre', [_vm._v(_vm._s(_vm.state))])])]);
    }, staticRenderFns: [],
    name: 'Path',
    props: ['animation', 'states', 'canvas'],
    mounted: function mounted() {
        var _this = this;

        var path = void 0;
        this.canvas.clear();

        this.animation
        // .fps(1)
        .only(function () {
            // compute path
            path = compute(_this.state, _this.canvas.canvas);

            // draw
            _this.canvas.clear();
            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(path.first().x, path.first().y);

            path.points.forEach(function (point, index) {
                if (index === 0) {
                    return;
                }
                _this.canvas.ctx.lineTo(point.x, point.y);
                _this.canvas.ctx.strokeStyle = _this.states.canvas.strokeStyle;
                _this.canvas.ctx.lineWidth = _this.states.canvas.lineWidth;
                _this.canvas.ctx.stroke();
            });
            _this.canvas.ctx.closePath();

            state.prev = path.last();
        }).play();
    },

    components: {},
    data: function data() {
        return {
            state: state
        };
    }
};

(function () {
    if (document) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var App = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('header', { staticClass: "mui-appbar mui--z1" }, [_c('div', { staticClass: "mui-container" }, [_c('table', { attrs: { "width": "100%" } }, [_c('tr', { staticClass: "mui--appbar-height" }, [_c('td', { staticClass: "mui--text-title" }, [_vm._v("Brand.io")]), _c('td', { attrs: { "align": "right" } }, [_c('ul', { staticClass: "mui-list--inline mui--text-body2" }, [_c('li', [_c('router-link', { attrs: { "to": "/Path" } }, [_vm._v("Path")])], 1)])])])])])]), _c('div', { staticClass: "mui-container-fluid", attrs: { "id": "content" } }, [_c('div', { staticClass: "mui-row" }, [_c('div', { staticClass: "mui-col-md-8 app--canvas" }), _c('div', { staticClass: "mui-col-md-4" }, [_c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('span', [_vm._v("count " + _vm._s(_vm.animation.count))])]), _c('div', { staticClass: "mui-textfield" }, [_c('button', { staticClass: "mui-btn mui-btn--small mui-btn--primary", on: { "click": function click($event) {
                    _vm.animation.toggle();
                } } }, [_vm._v(_vm._s(_vm.animation.running ? 'Pause' : 'Run'))])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { attrs: { "type": "range", "min": "0", "max": "500" }, on: { "change": _vm.setFps } }), _c('label', [_vm._v("fps "), _c('small', [_vm._v("(" + _vm._s(1000 / _vm.animation.interval) + ")")])])])]), _c('router-view', { staticClass: "view", attrs: { "states": _vm.states, "animation": _vm.animation, "canvas": _vm.canvas } }), _c('div')], 1)])])]);
    }, staticRenderFns: [],
    name: 'app',
    props: ['animation', 'states', 'canvas'],
    components: {
        Path: Path
    },
    mounted: function mounted() {
        this.$el.querySelector('.app--canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = this.states.canvas.width;
        this.canvas.canvas.height = this.states.canvas.height;
        this.canvas.ctx.fillStyle = this.states.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.states.canvas.lineWidth;
    },

    methods: {
        setFps: function setFps(e) {
            // @TODO: improve this crap algo
            var fps = parseInt(e.target.value, 10);
            if (isNaN(fps)) {
                e.target.classList.add('error');
                return;
            }

            e.target.classList.remove('error');
            if (fps >= 100) {
                fps = -1;
            }

            this.animation.fps(fps);
        }
    }
};

// import Space from '../Space';

// rollup-plugin-scss
var animation = new Animation();
var canvas = new Canvas2d();

var states = {
    canvas: {
        width: 500,
        height: 500,
        strokeStyle: 'hsla(300, 100%, 75%, 1)',
        fillStyle: 'rgba(0, 0, 0, .08)',
        lineWidth: 0.1
    }
};

// Create the router
var router = new VueRouter({
    mode: 'hash', //'history',
    routes: [{
        path: '/',
        component: Path
    }, {
        path: '/Path',
        component: Path
    },
    // catch all redirect
    {
        path: '*',
        redirect: '/'
    }]
});

// 4. Create and mount root instance.
// Make sure to inject the router.
new Vue({
    router: router,
    data: {
        animation: animation,
        states: states,
        canvas: canvas
    },
    components: {
        App: App
    },
    //render: h => h(App)
    template: '<App :states="states" :animation="animation" :canvas="canvas" />'
}).$mount('#app');

}(Vue,VueRouter));
//# sourceMappingURL=main.js.map
