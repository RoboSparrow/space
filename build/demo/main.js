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

var State = {
    canvas: {
        width: 500,
        height: 500,
        strokeStyle: 'hsla(300, 100%, 75%, 1)',
        fillStyle: 'rgba(0, 0, 0, .08)',
        lineWidth: 0.1
    },
    // shallow(!) clone and merge in submitted properties
    factor: function factor(property, merge) {
        var _this = this;

        merge = merge || {};
        Object.keys(this[property]).forEach(function (key) {
            merge[key] = typeof merge[key] !== 'undefined' ? merge[key] : _this[property][key];
        });
        return merge;
    }
};

var Utils = {
    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    randInt: function randInt(min, max) {
        min = min || -1;
        max = max || 1;
        // eslint-disable-next-line no-mixed-operators
        return Math.random() * (max - min) + min;
    },

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    bounds: function bounds(val, min, max) {
        val = min !== false && val < min ? min : val;
        val = max !== false && val > max ? max : val;
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

var compute = function compute(state, canvas) {
    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    var i = void 0;
    var origin = void 0;
    var figures = {};

    // Path
    var path = new Space.Path(canvas.width / 2, canvas.height / 2);
    var segments = Utils.randInt(10, 100);
    for (i = 1; i < segments; i += 1) {
        var prev = path.points[i - 1];
        path.add(prev.x + Utils.randInt(-100, 100), prev.y + Utils.randInt(-100, 100));
    }

    figures.Path = {
        path: path,
        fillStyle: [255, 255, 255, 0.05]
    };

    //
    // origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    origin = new Space.Point.Cartesian(Utils.randInt(canvas.width / 2, canvas.width), Utils.randInt(canvas.height / 2, canvas.height));
    var star = new Space.Star(Utils.randInt(3, 15), Utils.randInt(100, 300), Utils.randInt(10, 100), origin);

    figures.star = {
        path: star.path,
        fillStyle: [-1, -1, -1, 0.25]
    };

    // Square
    origin = new Space.Point.Cartesian(Utils.randInt(50, canvas.width / 2), Utils.randInt(50, canvas.height / 2));
    var dim = Utils.randInt(50, 75);
    var square = new Space.Rectangle(dim, dim, origin);

    figures.Square = {
        path: square.path,
        fillStyle: [-1, -1, -1, 0.25]
    };

    state.prev.figures = figures;
    return figures;
};

var randRgba = function randRgba(rgba) {
    var r = rgba[0] > 0 ? rgba[0] : Math.round(Utils.randInt(0, 255));
    var g = rgba[1] > 0 ? rgba[1] : Math.round(Utils.randInt(0, 255));
    var b = rgba[2] > 0 ? rgba[2] : Math.round(Utils.randInt(0, 255));
    var a = rgba[3] > 0 ? rgba[3] : Math.round(Utils.randInt(0, 1));
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

var draw = function draw(figure, ctx) {
    //init
    ctx.save();

    // styles
    ctx.fillStyle = randRgba(figure.fillStyle);
    ctx.strokeStyle = randRgba(figure.fillStyle);
    ctx.lineWidth = 1;

    // path
    var path = figure.path;
    ctx.beginPath();
    ctx.moveTo(path.first().x, path.first().y);
    path.points.forEach(function (point, index) {
        if (index === 0) {
            return;
        }
        ctx.lineTo(point.x, point.y);
    });

    // draw
    if (ctx.fillStyle) {
        ctx.fill();
    }
    ctx.stroke();

    // finish
    ctx.closePath();
    ctx.restore();
};

var Home = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_vm._v("nothing")]);
    }, staticRenderFns: [],
    name: 'Home',
    props: ['animation', 'appState', 'canvas'],
    data: function data() {
        return {
            state: {
                prev: {
                    figures: {}
                },
                origin: null,
                canvas: this.appState.factor('canvas')
            }
        };
    },
    created: function created() {
        // temp redirect
        // this.$router.push('/Path');
    },
    mounted: function mounted() {
        var _this = this;

        this.canvas.clear();

        this.animation.fps(32).only(function () {
            // compute path
            var figures = compute(_this.state, _this.canvas.canvas);
            var tasks = Object.keys(figures);
            // init
            _this.canvas.clear();

            // draw
            tasks.forEach(function (id) {
                draw(figures[id], _this.canvas.ctx);
            });
        }).play();
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

var Space$1 = window.Space;

var compute$1 = function compute$1(state, canvas) {
    if (!state.prev) {
        state.prev = new Space$1.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    var path = new Space$1.Path(state.prev.x, state.prev.y);
    var range = state.segmentsRange;
    var count = 0;

    while (count < state.segments) {
        var segX = Utils.randInt(-range, range) * Utils.randInt();
        var segY = Utils.randInt(-range, range) * Utils.randInt();
        var x = path.last().x + segX;
        var y = path.last().y + segY;
        x = Utils.bounds(x, 0, canvas.width);
        y = Utils.bounds(y, 0, canvas.height);
        path.add(x, y);
        count += 1;
    }

    state.prev = path.last();
    return path;
};

var Path = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segments, expression: "state.segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "10", "max": "800", "step": "10" }, domProps: { "value": _vm.state.segments }, on: { "__r": function __r($event) {
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
    props: ['animation', 'appState', 'canvas'],
    data: function data() {
        return {
            state: {
                prev: null,
                segments: 100,
                segmentsRange: 10,
                canvas: this.appState.factor('canvas')
            }
        };
    },
    mounted: function mounted() {
        var _this = this;

        var path = void 0;

        this.animation
        // .fps(1)
        .only(function () {
            // compute path
            path = compute$1(_this.state, _this.canvas.canvas);

            // draw
            _this.canvas.clear();
            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(path.first().x, path.first().y);

            path.points.forEach(function (point, index) {
                if (index === 0) {
                    return;
                }
                _this.canvas.ctx.lineTo(point.x, point.y);
                _this.canvas.ctx.strokeStyle = _this.state.canvas.strokeStyle;
                _this.canvas.ctx.lineWidth = _this.state.canvas.lineWidth;
                _this.canvas.ctx.stroke();
            });
            _this.canvas.ctx.closePath();
        }).play();
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

var Space$2 = window.Space;

var compute$2 = function compute$2(state, canvas) {
    if (!state.origin) {
        state.origin = new Space$2.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    var radius = Math.floor(Utils.randInt(5, state.radiusRange));
    var segments = Math.floor(Utils.randInt(3, state.segmentsRange));
    segments = Utils.bounds(segments, false, 25);
    radius = Utils.bounds(radius, false, canvas.width / 2);

    state.prev.segments = segments;
    state.prev.radius = radius;

    return new Space$2.Polygon(segments, radius, state.origin);
};

var Polygon = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.radiusRange, expression: "state.radiusRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "500" }, domProps: { "value": _vm.state.radiusRange }, on: { "__r": function __r($event) {
                    _vm.state.radiusRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.radiusRange) + ")")])])]), _c('pre', [_vm._v(_vm._s(_vm.state))])])]);
    }, staticRenderFns: [],
    name: 'Polygon',
    props: ['animation', 'appState', 'canvas'],
    data: function data() {
        return {
            state: {
                prev: {
                    segments: 3,
                    radius: 50
                },
                segmentsRange: 10,
                radiusRange: 200,
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(99, 9, 9, .8)'
                })
            }
        };
    },
    mounted: function mounted() {
        var _this = this;

        var polygon = void 0;

        this.animation
        // .fps(1)
        .only(function () {
            // compute path
            polygon = compute$2(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.clear();
            _this.canvas.ctx.save();

            // styles
            _this.canvas.ctx.fillStyle = _this.state.canvas.fillStyle;
            _this.canvas.ctx.strokeStyle = _this.state.canvas.strokeStyle;
            _this.canvas.ctx.lineWidth = _this.state.canvas.lineWidth;

            // path
            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(polygon.path.first().x, polygon.path.first().y);
            polygon.path.points.forEach(function (point, index) {
                if (index === 0) {
                    return;
                }
                _this.canvas.ctx.lineTo(point.x, point.y);
            });

            // draw
            if (_this.state.canvas.fillStyle) {
                _this.canvas.ctx.fill();
            }
            _this.canvas.ctx.stroke();

            // finish
            _this.canvas.ctx.closePath();
            _this.canvas.ctx.restore();
        }).play();
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

var Space$3 = window.Space;

var compute$3 = function compute$3(state, canvas) {
    if (!state.origin) {
        state.origin = new Space$3.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    var width = Math.floor(Utils.randInt(5, state.widthRange));
    var height = Math.floor(Utils.randInt(3, state.heightRange));

    state.prev.width = width;
    state.prev.height = height;

    return new Space$3.Rectangle(width, height, state.origin);
};

var Rectangle = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.widthRange, expression: "state.widthRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "1000" }, domProps: { "value": _vm.state.widthRange }, on: { "__r": function __r($event) {
                    _vm.state.widthRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.widthRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.heightRange, expression: "state.heightRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "1000" }, domProps: { "value": _vm.state.heightRange }, on: { "__r": function __r($event) {
                    _vm.state.heightRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Height Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.heightRange) + ")")])])]), _c('pre', [_vm._v(_vm._s(_vm.state))])])]);
    }, staticRenderFns: [],
    name: 'Rectangle',
    props: ['animation', 'appState', 'canvas'],
    data: function data() {
        return {
            state: {
                prev: {
                    width: 25,
                    height: 50
                },
                widthRange: 500,
                heightRange: 500,
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(255, 255, 255, .2)'
                })
            }
        };
    },
    mounted: function mounted() {
        var _this = this;

        var polygon = void 0;

        this.animation
        // .fps(1)
        .only(function () {
            // compute path
            polygon = compute$3(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.clear();
            _this.canvas.ctx.save();

            // styles
            _this.canvas.ctx.fillStyle = _this.state.canvas.fillStyle;
            _this.canvas.ctx.strokeStyle = _this.state.canvas.strokeStyle;
            _this.canvas.ctx.lineWidth = _this.state.canvas.lineWidth;

            // path
            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(polygon.path.first().x, polygon.path.first().y);
            polygon.path.points.forEach(function (point, index) {
                if (index === 0) {
                    return;
                }
                _this.canvas.ctx.lineTo(point.x, point.y);
            });

            // draw
            if (_this.state.canvas.fillStyle) {
                _this.canvas.ctx.fill();
            }
            _this.canvas.ctx.stroke();

            // finish
            _this.canvas.ctx.closePath();
            _this.canvas.ctx.restore();
        }).play();
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

var Space$4 = window.Space;

var compute$4 = function compute$4(state, canvas) {
    if (!state.origin) {
        state.origin = new Space$4.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    var outerRadius = Math.floor(Utils.randInt(5, state.outerRadiusRange));
    var innerRadius = Math.floor(Utils.randInt(5, state.innerRadiusRange));
    var segments = Math.floor(Utils.randInt(3, state.segmentsRange));
    segments = Utils.bounds(segments, false, 25);
    outerRadius = Utils.bounds(outerRadius, false, canvas.width / 2);
    innerRadius = Utils.bounds(innerRadius, false, canvas.width / 2);

    state.prev.segments = segments;
    state.prev.outerRadius = outerRadius;
    state.prev.innerRadius = innerRadius;

    return new Space$4.Star(segments, outerRadius, innerRadius, state.origin);
};

var Star = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.outerRadiusRange, expression: "state.outerRadiusRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "500" }, domProps: { "value": _vm.state.outerRadiusRange }, on: { "__r": function __r($event) {
                    _vm.state.outerRadiusRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Outer Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.outerRadiusRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.innerRadiusRange, expression: "state.innerRadiusRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "500" }, domProps: { "value": _vm.state.innerRadiusRange }, on: { "__r": function __r($event) {
                    _vm.state.innerRadiusRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Inner Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.innerRadiusRange) + ")")])])]), _c('pre', [_vm._v(_vm._s(_vm.state))])])]);
    }, staticRenderFns: [],
    name: 'Star',
    props: ['animation', 'appState', 'canvas'],
    data: function data() {
        return {
            state: {
                prev: {
                    segments: 3,
                    outerRadius: 50,
                    innerRadius: 10
                },
                segmentsRange: 10,
                outerRadiusRange: 200,
                innerRadiusRange: 200,
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(0, 99, 0, .6)'
                })
            }
        };
    },
    mounted: function mounted() {
        var _this = this;

        var polygon = void 0;

        this.animation
        // .fps(1)
        .only(function () {
            // compute path
            polygon = compute$4(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.clear();
            _this.canvas.ctx.save();

            // styles
            _this.canvas.ctx.fillStyle = _this.state.canvas.fillStyle;
            _this.canvas.ctx.strokeStyle = _this.state.canvas.strokeStyle;
            _this.canvas.ctx.lineWidth = _this.state.canvas.lineWidth;

            // path
            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(polygon.path.first().x, polygon.path.first().y);
            polygon.path.points.forEach(function (point, index) {
                if (index === 0) {
                    return;
                }
                _this.canvas.ctx.lineTo(point.x, point.y);
            });

            // draw
            if (_this.state.canvas.fillStyle) {
                _this.canvas.ctx.fill();
            }
            _this.canvas.ctx.stroke();

            // finish
            _this.canvas.ctx.closePath();
            _this.canvas.ctx.restore();
        }).play();
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

var Space$5 = window.Space;

var compute$5 = function compute$5(figure, state, canvas) {

    if (!state.origin) {
        state.origin = new Space$5.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    var fig = void 0;
    var width = void 0;
    var segments = void 0;

    switch (figure) {

        case 'Path':
            {
                var margin = 50;
                width = canvas.width - 2 * margin;
                segments = 5;
                var delta = width / segments;
                fig = new Space$5.Path(margin, margin);
                while (segments > 0) {
                    margin = -margin;
                    fig.progress(delta, margin > 0 ? margin : canvas.height - margin);
                    segments -= 1;
                }
                break;
            }

        default:
            {
                fig = null;
            }

    }

    return typeof fig.path !== 'undefined' ? fig.path : fig;
};

var draw$1 = function draw$1(path, state, canvas) {
    console.log(path, state, canvas);
    canvas.ctx.save();

    // styles
    canvas.ctx.fillStyle = state.canvas.fillStyle;
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;

    // path
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(path.first().x, path.first().y);
    path.points.forEach(function (point, index) {
        if (index === 0) {
            return;
        }
        canvas.ctx.lineTo(point.x, point.y);
    });

    // draw
    if (state.canvas.fillStyle) {
        canvas.ctx.fill();
    }
    canvas.ctx.stroke();

    // finish
    canvas.ctx.closePath();
    canvas.ctx.restore();
};

var Figures = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('h2', [_vm._v(_vm._s(_vm.$route.name))]), _c('pre', [_vm._v(_vm._s(_vm.state))])])]);
    }, staticRenderFns: [],
    name: 'Figures',
    props: ['animation', 'appState', 'canvas'],
    watch: {
        '$route': function $route(to, from) {
            console.log(this.$route);
            this.title = this.$route;
        }
    },
    data: function data() {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(255, 255, 255, 1)',
                    lineWidth: 2
                })
            },
            routes: Routes.figures(),
            title: this.$route
        };
    },
    mounted: function mounted() {
        this.animation.stop(); // !!!
        this.canvas.clear();

        var figure = typeof this.$route.params.figure !== 'undefined' ? this.$route.params.figure : 'Path';
        var path = compute$5(figure, this.state, this.canvas.canvas);
        draw$1(path, this.state, this.canvas);
    }
};

var routes = [{
    name: 'Home',
    path: '/',
    component: Home,
    meta: {
        menu: true,
        figure: false
    }
}, {
    name: 'Path',
    path: '/Path',
    component: Path,
    meta: {
        menu: true,
        figure: true
    }
}, {
    name: 'Polygon',
    path: '/Polygon',
    component: Polygon,
    meta: {
        menu: true,
        figure: true
    }
}, {
    name: 'Rectangle',
    path: '/Rectangle',
    component: Rectangle,
    meta: {
        menu: true,
        figure: true
    }
}, {
    name: 'Star',
    path: '/Star',
    component: Star,
    meta: {
        menu: true,
        figure: true
    }
}, {
    name: 'Figures',
    path: '/Figures',
    component: Figures,
    meta: {
        menu: true,
        figure: false
    }
}, {
    name: 'Figure',
    path: '/Figures/:name',
    component: Figures,
    meta: {
        menu: false,
        figure: false
    }
},
// catch all redirect
{
    name: '',
    path: '*',
    redirect: '/',
    meta: {
        menu: false,
        figure: false
    }
}];

var figures = function figures() {
    return routes.filter(function (item) {
        return item.meta.figure;
    });
};

var menu = function menu() {
    return routes.map(function (item) {
        return {
            name: item.name,
            path: item.path,
            meta: item.meta || {}
        };
    });
};

var byName = function byName(name) {
    var i = void 0;
    for (i = 1; i < routes.length; i += 1) {
        if (routes[i].name === name) {
            return routes[i];
        }
    }
    return null;
};

var Routes = {
    routes: routes,
    figures: figures,
    menu: menu,
    byName: byName
};

(function () {
    if (document) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " body{ background-color: black; } ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var App = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('header', { attrs: { "id": "header" } }, [_c('div', { staticClass: "mui-appbar mui--appbar-line-height mui--z1" }, [_c('div', { staticClass: "mui-container-fluid" }, [_c('table', { attrs: { "width": "100%" } }, [_c('tr', { staticClass: "mui--appbar-height" }, [_c('td', [_c('span', { staticClass: "app--brand" }), _c('div', { staticClass: "mui-dropdown" }, [_c('button', { staticClass: "mui-btn mui-btn-small", attrs: { "data-mui-toggle": "dropdown" } }, [_vm._v("Space "), _c('span', { staticClass: "mui--text-accent" }, [_vm._v("/")]), _vm._v(" " + _vm._s(_vm.$route.name) + " "), _c('span', { staticClass: "mui-caret mui--text-accent" })]), _c('ul', { staticClass: "mui-dropdown__menu" }, _vm._l(_vm.routes, function (route) {
            return route.name ? _c('li', { class: { 'router-link-active': _vm.$route.name === route.name } }, [_c('a', { on: { "click": function click($event) {
                        _vm.goTo(route);
                    } } }, [_vm._v(_vm._s(route.name))])]) : _vm._e();
        }))])]), _c('td', [_c('a', { staticClass: "app--sidebar-trigger mui--pull-right mui--text-display1", on: { "click": function click($event) {
                    _vm.toggle();
                } } }, [_c('i', { staticClass: "zmdi zmdi-settings" })])])])])])])]), _vm._m(0), _c('aside', { staticClass: "mui-panel", class: { 'visible': _vm.sidebar }, attrs: { "id": "sidebar" } }, [_vm._m(1), _c('div', { staticClass: "mui-divider" }), _c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('pre', [_vm._v("count " + _vm._s(_vm.animation.count))])]), _c('div', { staticClass: "mui-textfield" }, [_c('button', { staticClass: "mui-btn mui-btn--small mui-btn--primary", on: { "click": function click($event) {
                    _vm.animation.toggle();
                } } }, [_vm._v(_vm._s(_vm.animation.running ? 'Pause' : 'Run'))])]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.throttlePanel, expression: "throttlePanel" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.throttlePanel) ? _vm._i(_vm.throttlePanel, null) > -1 : _vm.throttlePanel }, on: { "click": function click($event) {
                    _vm.throttle(_vm.animation.interval < 0 ? 3 : -1);
                }, "__c": function __c($event) {
                    var $$a = _vm.throttlePanel,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.throttlePanel = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.throttlePanel = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.throttlePanel = $$c;
                    }
                } } }), _vm._v(" Throttle animation")])]), _vm.throttlePanel ? _c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { attrs: { "type": "range", "min": "0", "max": "100" }, on: { "change": function change($event) {
                    _vm.throttle($event.target.value);
                } } }), _c('label', [_vm._v("fps "), _c('small', [_vm._v("(" + _vm._s(1000 / _vm.animation.interval) + ")")])])])]) : _vm._e()]), _c('router-view', { staticClass: "view", attrs: { "app-state": _vm.appState, "animation": _vm.animation, "canvas": _vm.canvas } })], 1), _vm._m(2)]);
    }, staticRenderFns: [function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('footer', { attrs: { "id": "footer" } }, [_c('div', { staticClass: "app--footer-content mui-container-fluid mui--align-middle" }, [_vm._v("Demo made with "), _c('a', { attrs: { "href": "https://vuejs.org/" } }, [_vm._v("Vue")]), _vm._v(" & "), _c('a', { attrs: { "href": "https://www.muicss.com" } }, [_vm._v("MUICSS")])])]);
    }, function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "mui--appbar-line-height" }, [_c('span', { staticClass: "mui--text-title" }, [_vm._v("Params")])]);
    }, function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('main', { staticClass: "mui-container-fluid", attrs: { "id": "content" } }, [_c('div', { staticClass: "mui-row" }, [_c('div', { staticClass: "mui-col-md-12 app--canvas" })])]);
    }],
    name: 'app',
    props: ['animation', 'appState', 'canvas', 'routes'],
    mounted: function mounted() {
        this.sidebar = document.getElementById('sidebar');

        this.$el.querySelector('.app--canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = document.body.clientWidth;
        this.canvas.canvas.height = document.body.clientHeight;
        this.canvas.ctx.fillStyle = this.appState.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.appState.canvas.lineWidth;
    },

    methods: {
        throttle: function throttle(value) {
            if (value === null) {
                return;
            }
            value = parseInt(value, 10);
            if (!isNaN(value)) {
                this.animation.fps(value);
            }
        },
        goTo: function goTo(route) {
            var to = route.path.indexOf('/:') > -1 ? { name: route.name, params: {} } : route.path;
            this.$router.push(to);
        },
        toggle: function toggle() {
            if (!this.sidebar) {
                return;
            }
            var right = this.sidebar.style.right ? this.sidebar.style.right : window.getComputedStyle(this.sidebar).getPropertyValue('right');
            right = parseInt(right, 10);
            this.sidebar.style.right = (right < 0 ? 0 : -this.sidebar.clientWidth) + 'px';
        }
    },
    data: function data() {
        return {
            sidebar: null,
            throttlePanel: 0
        };
    }
};

// import Space from '../Space';

// rollup-plugin-scss
var animation = new Animation();
var canvas = new Canvas2d();

// Create the router
var router = new VueRouter({
    mode: 'hash', //'history',
    routes: Routes.routes
});

// 4. Create and mount root instance.
// Make sure to inject the router.
new Vue({
    router: router,
    data: {
        animation: animation,
        appState: State,
        canvas: canvas,
        routes: Routes.menu()
    },
    components: {
        App: App
    },
    //render: h => h(App)
    template: '<App :app-state="appState" :animation="animation" :canvas="canvas" :routes="routes"/>'
}).$mount('#app');

}(Vue,VueRouter));
//# sourceMappingURL=main.js.map
