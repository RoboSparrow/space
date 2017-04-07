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

// throttle - set frames per second
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

// clear existing callbacks and set one
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

Animation.prototype.cancel = function () {
    this.stop();
    window.cancelAnimationFrame(this.id);
    this.id = null;
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

Canvas2d.prototype.styles = function (styles) {
    var _this = this;

    Object.keys(styles).forEach(function (key) {
        if (key in _this.ctx) {
            _this.ctx[key] = styles[key];
        }
    });
};

Canvas2d.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas2d.prototype.fill = function () {
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
    },

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    radians: function radians(deg) {
        return deg * (Math.PI / 180);
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
    var path = new Space.Path(state.origin);
    var segments = Utils.randInt(10, 100);
    path.add(origin);
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

        this.canvas.fill();

        this.animation.fps(32).only(function () {
            // compute path
            var figures = compute(_this.state, _this.canvas.canvas);
            var tasks = Object.keys(figures);
            // init
            _this.canvas.fill();

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

var Dev = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('section', [_c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.show, expression: "show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.show) ? _vm._i(_vm.show, null) > -1 : _vm.show }, on: { "__c": function __c($event) {
                    var $$a = _vm.show,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.show = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.show = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.show = $$c;
                    }
                } } }), _vm._v(" " + _vm._s(_vm.label))])])])]), _vm.show ? _c('pre', [_vm._v(_vm._s(_vm.data))]) : _vm._e()]);
    }, staticRenderFns: [],
    name: 'Dev',
    props: ['data', 'label'],
    data: function data() {
        return {
            show: false
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

var Space$1 = window.Space;

var compute$1 = function compute$1(state, canvas) {
    if (!state.prev) {
        state.prev = new Space$1.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    var path = new Space$1.Path();
    var range = state.segmentsRange;
    var count = 0;
    var rand = void 0;
    path.add(state.prev);
    while (count < state.segments) {
        rand = new Space$1.Point.Cartesian(Utils.randInt(-range, range) * Utils.randInt(), Utils.randInt(-range, range) * Utils.randInt());
        rand.add(path.last());
        rand.x = Utils.bounds(rand.x, 0, canvas.width);
        rand.y = Utils.bounds(rand.y, 0, canvas.height);
        path.add(rand);
        count += 1;
    }

    state.prev = path.last();
    return path;
};

var Path = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Edit")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segments, expression: "state.segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "10", "max": "800", "step": "10" }, domProps: { "value": _vm.state.segments }, on: { "__r": function __r($event) {
                    _vm.state.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segments) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'Path',
    props: ['animation', 'appState', 'canvas'],
    components: {
        Dev: Dev
    },
    data: function data() {
        return {
            state: {
                prev: null,
                segments: 200,
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

            // init
            _this.canvas.fill();
            _this.canvas.ctx.save();

            // styles
            _this.canvas.ctx.strokeStyle = _this.state.canvas.strokeStyle;
            _this.canvas.ctx.lineWidth = _this.state.canvas.lineWidth;

            // path
            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(path.first().x, path.first().y);
            path.points.forEach(function (point, index) {
                if (index === 0) {
                    return;
                }
                _this.canvas.ctx.lineTo(point.x, point.y);
                // draw
                _this.canvas.ctx.stroke();
            });

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
            css = " .app--color-picker pre { text-align: center; border: 1px solid white; padding: 10px; font-size: 10px; } ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var match = function match(str, model) {
    var i = void 0;
    var n = void 0;
    var matches = str.match(/\d+/g);
    for (i = 0; i < matches.length; i += 1) {
        n = parseInt(matches[i], 10);
        if (!isNaN(n)) {
            model[i] = matches[i];
        }
    }
    return matches;
};

var ColorPicker = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "app--color-picker" }, [_c('table', { staticClass: "mui-table" }, [_c('tbody', [_c('tr', [_c('td', [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.RGBA[0], expression: "RGBA[0]", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "255" }, domProps: { "value": _vm.RGBA[0] }, on: { "__r": function __r($event) {
                    var $$exp = _vm.RGBA,
                        $$idx = 0;if (!Array.isArray($$exp)) {
                        _vm.RGBA[0] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } })]), _c('td', [_c('strong', { staticClass: "app--indicator", style: { color: 'rgb(' + _vm.RGBA[0] + ', 0, 0)' } }, [_vm._v("◼")])]), _c('td', [_c('small', [_vm._v("Red(" + _vm._s(_vm.RGBA[0]) + ")")])])]), _c('tr', [_c('td', [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.RGBA[1], expression: "RGBA[1]", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "255" }, domProps: { "value": _vm.RGBA[1] }, on: { "__r": function __r($event) {
                    var $$exp = _vm.RGBA,
                        $$idx = 1;if (!Array.isArray($$exp)) {
                        _vm.RGBA[1] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } })]), _c('td', [_c('strong', { staticClass: "app--indicator", style: { color: 'rgb(0, ' + _vm.RGBA[1] + ', 0)' } }, [_vm._v("◼")])]), _c('td', [_c('small', [_vm._v("Green(" + _vm._s(_vm.RGBA[1]) + ")")])])]), _c('tr', [_c('td', [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.RGBA[2], expression: "RGBA[2]", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "255" }, domProps: { "value": _vm.RGBA[2] }, on: { "__r": function __r($event) {
                    var $$exp = _vm.RGBA,
                        $$idx = 2;if (!Array.isArray($$exp)) {
                        _vm.RGBA[2] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } })]), _c('td', [_c('strong', { staticClass: "app--indicator", style: { color: 'rgb(0, 0, ' + _vm.RGBA[2] + ')' } }, [_vm._v("◼")])]), _c('td', [_c('small', [_vm._v("Blue(" + _vm._s(_vm.RGBA[2]) + ")")])])]), _c('tr', [_c('td', [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.RGBA[3], expression: "RGBA[3]", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "1", "step": "0.1" }, domProps: { "value": _vm.RGBA[3] }, on: { "__r": function __r($event) {
                    var $$exp = _vm.RGBA,
                        $$idx = 3;if (!Array.isArray($$exp)) {
                        _vm.RGBA[3] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } })]), _c('td'), _c('td', [_c('small', [_vm._v("Alpha(" + _vm._s(_vm.RGBA[3]) + ")")])])])])]), _c('pre', { staticClass: "app--color", style: { backgroundColor: _vm.rgbaString, color: _vm.rgbaStringContrast } }, [_vm._v(_vm._s(_vm.rgbaString))]), _c('a', { staticClass: "mui-btn mui-btn--small mui-btn--primary", on: { "click": function click($event) {
                    _vm.setColor();
                } } }, [_vm._v("Set color")])]);
    }, staticRenderFns: [],
    name: 'ColorPicker',
    props: ['rgba', 'targ'],
    data: function data() {
        return {
            RGBA: match(this.rgba, [0, 0, 0, 1])
        };
    },
    computed: {
        rgbaString: function rgbaString() {
            return 'rgba(' + this.RGBA.toString() + ')';
        },
        rgbaStringContrast: function rgbaStringContrast() {
            var yiq = (this.RGBA[0] * 299 + this.RGBA[1] * 587 + this.RGBA[2] * 114) / 1000;
            return yiq >= 128 ? 'black' : 'white';
        }
    },
    methods: {
        setColor: function setColor() {
            this.$parent.$emit('color-picker:' + this.targ, this.rgbaString);
        }
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

    var bezier = new Space$2.BezierPath(new Space$2.Point.Cartesian());
    var i = void 0;
    for (i = 1; i < state.segments; i += 1) {
        //const point = new Space.Point.Cartesian(
        //    Utils.randInt(0, state.origin.x),
        //    Utils.randInt(0, state.origin.y)
        //);
        var point = new Space$2.Point.Cartesian(i * 50, i * 50);

        var cp1 = point.clone();
        cp1.translate(Utils.randInt(-state.origin.x, state.origin.x), Utils.randInt(-state.origin.y, state.origin.y));

        var cp2 = point.clone();
        cp2.translate(Utils.randInt(-state.origin.x, state.origin.x), Utils.randInt(-state.origin.y, state.origin.y));

        bezier.add(point, cp1, cp2);
    }
    console.log(JSON.stringify(bezier.points));
    console.log(bezier.points);
    return bezier;
};

var Helpers = {
    drawPoint: function drawPoint(ctx, point, name, theme) {
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;

        ctx.fillText('' + name, point.x + 20, point.y + 20);
        ctx.strokeRect(point.x - 5, point.y - 5, 10, 10);

        ctx.restore();
    },

    drawHandle: function drawHandle(ctx, point, handle, name, theme) {
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        ctx.lineWidth = .5;
        ctx.fillText('' + name, handle.x + 20, handle.y + 20);
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(handle.x, handle.y);
        ctx.stroke();

        ctx.restore();
    }
};

var draw$1 = function draw$1(path, state, canvas) {
    canvas.ctx.save();
    // styles
    canvas.ctx.fillStyle = state.fill.show ? state.canvas.fillStyle : null;
    canvas.ctx.strokeStyle = state.stroke.show ? state.canvas.strokeStyle : null;
    canvas.ctx.lineWidth = state.canvas.lineWidth;

    // path

    canvas.ctx.moveTo(0, 0);
    canvas.ctx.beginPath();
    path.points.forEach(function (point, index) {
        if (index === 0) {
            return;
        }
        canvas.ctx.moveTo(path.points[index - 1].point.x, path.points[index - 1].point.y);
        canvas.ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.point.x, point.point.y);
    });

    // draw
    if (state.canvas.fillStyle) {
        canvas.ctx.fill();
    }
    canvas.ctx.stroke();

    // finish
    canvas.ctx.closePath();
    canvas.ctx.restore();

    if (state.drawHelpers) {
        path.points.forEach(function (point, index) {
            Helpers.drawHandle(canvas.ctx, point.point, point.cp1, index + ':cp1', 'red');
            Helpers.drawHandle(canvas.ctx, point.point, point.cp2, index + ':cp2', 'blue');
            Helpers.drawPoint(canvas.ctx, point.point, index + ':point', 'yellow');
        });
    }
};

var defaults = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

var BezierPath = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form--inline" }, [_vm.figure === 'Path' ? _c('section', [_c('div', { staticClass: "app--inline-field mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Path.segments, expression: "state.Path.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Path.segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Path.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.Path.segments) + ")")])])])]) : _vm._e(), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Background")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.fill.show, expression: "state.fill.show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.fill.show) ? _vm._i(_vm.state.fill.show, null) > -1 : _vm.state.fill.show }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.fill.show,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.fill.show = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.fill.show = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.fill.show = $$c;
                    }
                } } }), _vm._v(" Show")])]), _vm.state.fill.show ? _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.fill.edit, expression: "state.fill.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.fill.edit) ? _vm._i(_vm.state.fill.edit, null) > -1 : _vm.state.fill.edit }, on: { "__c": function __c($event) {
                    var $$a = _vm.state.fill.edit,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.fill.edit = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.fill.edit = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.fill.edit = $$c;
                    }
                } } }), _vm._v(" Edit")])]) : _vm._e()]), _vm.state.fill.edit ? _c('div', { staticClass: "mui-panel" }, [_c('color-picker', { attrs: { "targ": 'fillStyle', "rgba": _vm.state.canvas.fillStyle } })], 1) : _vm._e(), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Stroke")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.stroke.show, expression: "state.stroke.show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.stroke.show) ? _vm._i(_vm.state.stroke.show, null) > -1 : _vm.state.stroke.show }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.stroke.show,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.stroke.show = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.stroke.show = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.stroke.show = $$c;
                    }
                } } }), _vm._v(" Show")])]), _vm.state.stroke.show ? _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.stroke.edit, expression: "state.stroke.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.stroke.edit) ? _vm._i(_vm.state.stroke.edit, null) > -1 : _vm.state.stroke.edit }, on: { "__c": function __c($event) {
                    var $$a = _vm.state.stroke.edit,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.stroke.edit = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.stroke.edit = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.stroke.edit = $$c;
                    }
                } } }), _vm._v(" Edit")])]) : _vm._e()]), _vm.state.stroke.edit ? _c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.canvas.lineWidth, expression: "state.canvas.lineWidth", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.canvas.lineWidth }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.canvas.lineWidth = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width")])]), _c('color-picker', { attrs: { "targ": 'strokeStyle', "rgba": _vm.state.canvas.strokeStyle } })], 1) : _vm._e()]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'BezierPath',
    props: ['animation', 'appState', 'canvas'],
    created: function created() {
        var _this = this;

        this.$on('color-picker:fillStyle', function (val) {
            _this.state.canvas.fillStyle = val;
            _this.state.fill.edit = false;
            _this.init();
        });
        this.$on('color-picker:strokeStyle', function (val) {
            _this.state.canvas.strokeStyle = val;
            _this.state.stroke.edit = false;
            _this.init();
        });
    },
    data: function data() {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', defaults),
                // form
                fill: {
                    show: false,
                    edit: false
                },
                stroke: {
                    show: true,
                    edit: false
                },
                segments: 15,
                drawHelpers: true
            }
        };
    },
    components: {
        ColorPicker: ColorPicker,
        Dev: Dev
    },
    mounted: function mounted() {
        //@TODO cancel animation
        this.animation.only(function () {}).cancel(); // !!!!!
        this.init();
    },

    methods: {
        init: function init() {
            var _this2 = this;

            var timeout = null;
            this.canvas.clear();
            //@TODO
            timeout = window.setTimeout(function () {
                var path = compute$2(_this2.state, _this2.canvas.canvas);
                draw$1(path, _this2.state, _this2.canvas);
                window.clearTimeout(timeout);
            }, 100);
        }
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
    var radius = Math.floor(Utils.randInt(5, state.radiusRange));
    var segments = Math.floor(Utils.randInt(3, state.segmentsRange));
    segments = Utils.bounds(segments, false, 25);
    radius = Utils.bounds(radius, false, canvas.width / 2);

    state.prev.segments = segments;
    state.prev.radius = radius;

    return new Space$3.Polygon(segments, radius, state.origin);
};

var Polygon = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Edit")]), _c('form', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.radiusRange, expression: "state.radiusRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "500" }, domProps: { "value": _vm.state.radiusRange }, on: { "__r": function __r($event) {
                    _vm.state.radiusRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.radiusRange) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1)])]);
    }, staticRenderFns: [],
    name: 'Polygon',
    props: ['animation', 'appState', 'canvas'],
    components: {
        Dev: Dev
    },
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
            polygon = compute$3(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.fill();
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
    var width = Math.floor(Utils.randInt(5, state.widthRange));
    var height = Math.floor(Utils.randInt(3, state.heightRange));

    state.prev.width = width;
    state.prev.height = height;

    return new Space$4.Rectangle(width, height, state.origin);
};

var Rectangle = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Edit")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.widthRange, expression: "state.widthRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "1000" }, domProps: { "value": _vm.state.widthRange }, on: { "__r": function __r($event) {
                    _vm.state.widthRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.widthRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.heightRange, expression: "state.heightRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "1000" }, domProps: { "value": _vm.state.heightRange }, on: { "__r": function __r($event) {
                    _vm.state.heightRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Height Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.heightRange) + ")")])])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'Rectangle',
    props: ['animation', 'appState', 'canvas'],
    components: {
        Dev: Dev
    },
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
            polygon = compute$4(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.fill();
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

var compute$5 = function compute$5(state, canvas) {
    if (!state.origin) {
        state.origin = new Space$5.Point.Cartesian(canvas.width / 2, canvas.height / 2);
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

    return new Space$5.Star(segments, outerRadius, innerRadius, state.origin);
};

var Star = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('form', { staticClass: "mui-form" }, [_c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Edit")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
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
                } } }), _c('label', [_vm._v("Inner Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.innerRadiusRange) + ")")])])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'Star',
    props: ['animation', 'appState', 'canvas'],
    components: {
        Dev: Dev
    },
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
            polygon = compute$5(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.fill();
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

var Space$6 = window.Space;

var compute$6 = function compute$6(figure, state, canvas) {

    if (!state.origin) {
        state.origin = new Space$6.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    var fig = void 0;
    var segments = void 0;

    switch (figure) {

        case 'Path':
            {
                var margin = 100;
                segments = state.Path.segments;
                var x = (canvas.width - 2 * margin) / segments;
                var y = canvas.height - 2 * margin;
                fig = new Space$6.Path();
                fig.add(margin, margin);
                while (segments > 0) {
                    fig.progress(x, y);
                    y = -y;
                    segments -= 1;
                }
                break;
            }

        case 'Polygon':
            {
                fig = new Space$6.Polygon(state.Polygon.segments, state.Polygon.radius, state.origin);
                break;
            }

        case 'Rectangle':
            {
                fig = new Space$6.Rectangle(state.Rectangle.width, state.Rectangle.height, state.origin);
                break;
            }

        case 'Star':
            {
                fig = new Space$6.Star(state.Star.segments, state.Star.outerRadius, state.Star.innerRadius, state.origin);
                break;
            }

        default:
            {
                fig = null;
            }

    }

    //Figure or only Path
    var path = typeof fig.path !== 'undefined' ? fig.path : fig;

    // translate
    var hasTranslate = state.tanslate.reduce(function (a, b) {
        return a + b;
    });

    if (hasTranslate) {
        path.translate(state.tanslate[0], state.tanslate[1]);
    }

    // translate
    var hasScale = state.scale.reduce(function (a, b) {
        return a * b;
    });

    // scale
    if (hasScale !== 1) {
        path.scale(state.scale[0], state.scale[1]);
    }

    // rotate 2d
    if (state.rotate2D) {
        path.rotate2D(Utils.radians(state.rotate2D));
    }

    return path;
};

var draw$2 = function draw$2(figure, path, state, canvas) {
    canvas.ctx.save();
    // styles
    canvas.ctx.fillStyle = state.fill.show && figure !== 'Path' ? state.canvas.fillStyle : null;
    canvas.ctx.strokeStyle = state.stroke.show && figure !== 'Path' ? state.canvas.strokeStyle : null;
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

var defaults$1 = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

var Figures = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('div', { staticClass: "mui-dropdown" }, [_c('button', { staticClass: "mui-btn mui-btn-small", attrs: { "data-mui-toggle": "dropdown" } }, [_vm._v(_vm._s(_vm.figure ? _vm.figure : 'Choose') + " "), _c('span', { staticClass: "mui-caret mui--text-accent" })]), _c('ul', { staticClass: "mui-dropdown__menu" }, _vm._l(_vm.figures, function (fig) {
            return fig.name !== _vm.figure ? _c('li', { class: { 'router-link-active': fig.name === _vm.figure } }, [_c('a', { on: { "click": function click($event) {
                        _vm.goTo(fig);
                    } } }, [_vm._v(_vm._s(fig.name))])]) : _vm._e();
        }))]), _c('p'), _c('form', { staticClass: "mui-form--inline" }, [_vm.figure === 'Path' ? _c('section', [_c('div', { staticClass: "app--inline-field mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Path.segments, expression: "state.Path.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Path.segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Path.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.Path.segments) + ")")])])])]) : _vm._e(), _vm.figure === 'Polygon' ? _c('section', [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Polygon.segments, expression: "state.Polygon.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Polygon.segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Polygon.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Polygon.radius, expression: "state.Polygon.radius", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Polygon.radius }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Polygon.radius = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Radius")])])]) : _vm._e(), _vm.figure === 'Star' ? _c('section', [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Star.segments, expression: "state.Star.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Star.segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Star.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Star.outerRadius, expression: "state.Star.outerRadius", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Star.outerRadius }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Star.outerRadius = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("outer Radius")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Star.innerRadius, expression: "state.Star.innerRadius", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Star.innerRadius }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Star.innerRadius = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("inner Radius")])])]) : _vm._e(), _vm.figure === 'Rectangle' ? _c('section', [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Rectangle.width, expression: "state.Rectangle.width", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Rectangle.width }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Rectangle.width = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Rectangle.height, expression: "state.Rectangle.height", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Rectangle.height }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Rectangle.height = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Height")])])]) : _vm._e(), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Background")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.fill.show, expression: "state.fill.show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.fill.show) ? _vm._i(_vm.state.fill.show, null) > -1 : _vm.state.fill.show }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.fill.show,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.fill.show = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.fill.show = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.fill.show = $$c;
                    }
                } } }), _vm._v(" Show")])]), _vm.state.fill.show ? _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.fill.edit, expression: "state.fill.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.fill.edit) ? _vm._i(_vm.state.fill.edit, null) > -1 : _vm.state.fill.edit }, on: { "__c": function __c($event) {
                    var $$a = _vm.state.fill.edit,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.fill.edit = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.fill.edit = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.fill.edit = $$c;
                    }
                } } }), _vm._v(" Edit")])]) : _vm._e()]), _vm.state.fill.edit ? _c('div', { staticClass: "mui-panel" }, [_c('color-picker', { attrs: { "targ": 'fillStyle', "rgba": _vm.state.canvas.fillStyle } })], 1) : _vm._e(), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Stroke")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.stroke.show, expression: "state.stroke.show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.stroke.show) ? _vm._i(_vm.state.stroke.show, null) > -1 : _vm.state.stroke.show }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.stroke.show,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.stroke.show = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.stroke.show = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.stroke.show = $$c;
                    }
                } } }), _vm._v(" Show")])]), _vm.state.stroke.show ? _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.stroke.edit, expression: "state.stroke.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.stroke.edit) ? _vm._i(_vm.state.stroke.edit, null) > -1 : _vm.state.stroke.edit }, on: { "__c": function __c($event) {
                    var $$a = _vm.state.stroke.edit,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.stroke.edit = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.stroke.edit = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.stroke.edit = $$c;
                    }
                } } }), _vm._v(" Edit")])]) : _vm._e()]), _vm.state.stroke.edit ? _c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.canvas.lineWidth, expression: "state.canvas.lineWidth", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.canvas.lineWidth }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.canvas.lineWidth = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width")])]), _c('color-picker', { attrs: { "targ": 'strokeStyle', "rgba": _vm.state.canvas.strokeStyle } })], 1) : _vm._e(), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Translate")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.tanslate[0], expression: "state.tanslate[0]", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.tanslate[0] }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }var $$exp = _vm.state.tanslate,
                        $$idx = 0;if (!Array.isArray($$exp)) {
                        _vm.state.tanslate[0] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("X")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.tanslate[1], expression: "state.tanslate[1]", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.tanslate[1] }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }var $$exp = _vm.state.tanslate,
                        $$idx = 1;if (!Array.isArray($$exp)) {
                        _vm.state.tanslate[1] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Y")])])]), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Scale")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.scale[0], expression: "state.scale[0]", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.scale[0] }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }var $$exp = _vm.state.scale,
                        $$idx = 0;if (!Array.isArray($$exp)) {
                        _vm.state.scale[0] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("X")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.scale[1], expression: "state.scale[1]", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.scale[1] }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }var $$exp = _vm.state.scale,
                        $$idx = 1;if (!Array.isArray($$exp)) {
                        _vm.state.scale[1] = _vm._n($event.target.value);
                    } else {
                        $$exp.splice($$idx, 1, _vm._n($event.target.value));
                    }
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Y")])])]), _c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Rotate")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.rotate2D, expression: "state.rotate2D", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.rotate2D }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.rotate2D = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("rad")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'Figures',
    props: ['animation', 'appState', 'canvas'],
    watch: {
        '$route': function $route(to) {
            this.figure = to.params.figure;
            this.init();
        }
    },
    created: function created() {
        var _this = this;

        this.$on('color-picker:fillStyle', function (val) {
            _this.state.canvas.fillStyle = val;
            _this.state.fill.edit = false;
            _this.init();
        });
        this.$on('color-picker:strokeStyle', function (val) {
            _this.state.canvas.strokeStyle = val;
            _this.state.stroke.edit = false;
            _this.init();
        });
    },
    data: function data() {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', defaults$1),
                // form
                fill: {
                    show: true,
                    edit: false
                },
                stroke: {
                    show: true,
                    edit: false
                },
                tanslate: [0, 0],
                scale: [1, 1],
                rotate2D: 0,
                // form defaults per figure
                Path: {
                    segments: 25
                },
                Polygon: {
                    segments: 6,
                    radius: 200
                },
                Star: {
                    segments: 5,
                    outerRadius: 200,
                    innerRadius: 70
                },
                Rectangle: {
                    width: 300,
                    height: 200
                }
            },
            figures: Routes.figures(),
            figure: typeof this.$route.params.figure !== 'undefined' ? this.$route.params.figure : 'Path'
        };
    },
    components: {
        ColorPicker: ColorPicker,
        Dev: Dev
    },
    mounted: function mounted() {
        //@TODO cancel animation
        this.animation.only(function () {}).cancel(); // !!!!!
        this.init();
    },

    methods: {
        init: function init() {
            var _this2 = this;

            var timeout = null;
            this.canvas.clear();
            //@TODO
            timeout = window.setTimeout(function () {
                var path = compute$6(_this2.figure, _this2.state, _this2.canvas.canvas);
                draw$2(_this2.figure, path, _this2.state, _this2.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },
        goTo: function goTo(figure) {
            this.$router.push({ name: 'Figure', params: { figure: figure.name } });
        }
    }
};

var routes = [{
    name: '',
    path: '/',
    component: Path,
    meta: {
        menu: false,
        figure: false
    }
}, {
    name: 'Home',
    path: '/Home',
    component: Home,
    meta: {
        menu: false,
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
    path: '/Figures/:figure',
    component: Figures,
    meta: {
        menu: false,
        figure: false
    }
}, {
    name: 'test', // 'BezierPath'
    path: '/test', // '/Figures/BezierPath',
    component: BezierPath,
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
    return routes.filter(function (item) {
        return item.meta.menu;
    }).map(function (item) {
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
            css = " ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var Animation$2 = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_vm.animation.id ? _c('form', { staticClass: "mui-form--inline" }, [_c('section', [_c('legend', { staticClass: "mui--text-subhead" }, [_vm._v("Animation "), _c('small', [_vm._v(_vm._s(_vm.animation.count))])]), _c('a', { staticClass: "mui-btn mui-btn--small mui-btn--primary", on: { "click": function click($event) {
                    _vm.animation.toggle();
                } } }, [_vm._v(_vm._s(_vm.animation.running ? 'pause' : 'play') + " ")]), _c('a', { staticClass: "mui-btn mui-btn--small app--btn", on: { "click": function click($event) {
                    _vm.show = !_vm.show;
                } } }, [_vm._v("Throttle")])])]) : _vm._e(), _vm.show ? _c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { attrs: { "type": "range", "min": "0", "max": "100" }, on: { "change": function change($event) {
                    _vm.throttle($event.target.value);
                } } }), _c('label', [_vm._v("fps "), _c('small', [_vm._v("(" + _vm._s(1000 / _vm.animation.interval) + ")")])])])]) : _vm._e()]);
    }, staticRenderFns: [],
    name: 'Animation',
    props: ['animation'],
    data: function data() {
        return {
            show: false
        };
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
        }
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
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('header', { attrs: { "id": "header" } }, [_c('div', { staticClass: "mui-appbar mui--appbar-line-height mui--z1" }, [_c('div', { staticClass: "mui-container-fluid" }, [_c('table', { attrs: { "width": "100%" } }, [_c('tr', { staticClass: "mui--appbar-height" }, [_c('td', [_c('span', { staticClass: "app--brand" }), _c('div', { staticClass: "mui-dropdown" }, [_c('button', { staticClass: "mui-btn mui-btn-small", attrs: { "data-mui-toggle": "dropdown" } }, [_vm._v("Space "), _c('span', { staticClass: "mui--text-accent" }, [_vm._v("/")]), _vm._v(" " + _vm._s(_vm.$route.name) + " "), _c('span', { staticClass: "mui-caret mui--text-accent" })]), _c('ul', { staticClass: "mui-dropdown__menu" }, _vm._l(_vm.routes, function (route) {
            return route.name ? _c('li', { class: { 'router-link-active': _vm.$route.name === route.name } }, [_c('a', { on: { "click": function click($event) {
                        _vm.goTo(route);
                    } } }, [_vm._v(_vm._s(route.name))])]) : _vm._e();
        }))])]), _c('td', [_c('a', { staticClass: "app--sidebar-trigger mui--pull-right mui--text-display1", on: { "click": function click($event) {
                    _vm.toggle();
                } } }, [_c('i', { staticClass: "zmdi zmdi-settings" })])])])])])])]), _vm._m(0), _c('aside', { staticClass: "mui-panel", class: { 'visible': _vm.sidebar }, attrs: { "id": "sidebar" } }, [_vm.$route.name ? _c('div', { staticClass: "mui--appbar-line-height" }, [_c('span', { staticClass: "mui--text-title" }, [_vm._v(_vm._s(_vm.$route.name))])]) : _vm._e(), _c('div', { staticClass: "mui-divider" }), _c('animation', { attrs: { "animation": _vm.animation } }), _c('router-view', { staticClass: "view", attrs: { "app-state": _vm.appState, "animation": _vm.animation, "canvas": _vm.canvas } })], 1), _vm._m(1)]);
    }, staticRenderFns: [function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('footer', { attrs: { "id": "footer" } }, [_c('div', { staticClass: "app--footer-content mui-container-fluid mui--align-middle" }, [_vm._v("Demo made with "), _c('a', { attrs: { "href": "https://vuejs.org/" } }, [_vm._v("Vue")]), _vm._v(" & "), _c('a', { attrs: { "href": "https://www.muicss.com" } }, [_vm._v("MUI")])])]);
    }, function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('main', { staticClass: "mui-container-fluid", attrs: { "id": "content" } }, [_c('div', { staticClass: "mui-row" }, [_c('div', { staticClass: "mui-col-md-12 app--canvas" })])]);
    }],
    name: 'app',
    props: ['animation', 'appState', 'canvas', 'routes'],
    components: {
        Animation: Animation$2
    },
    mounted: function mounted() {
        this.sidebar = document.getElementById('sidebar');

        this.$el.querySelector('.app--canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = document.body.clientWidth;
        this.canvas.canvas.height = document.body.clientHeight;
        this.canvas.ctx.fillStyle = this.appState.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.appState.canvas.lineWidth;
    },

    methods: {
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
            sidebar: null
        };
    }
};

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
