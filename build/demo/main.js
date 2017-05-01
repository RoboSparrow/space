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

var Helpers = {

    ////
    // Controls
    ////

    drawLine: function drawLine(ctx, from, to, theme) {
        if (!from) {
            return;
        }
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        //ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    },

    drawPoint: function drawPoint(ctx, point, name, theme) {
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;

        ctx.fillText('' + name, point.x + 10, point.y + 10);
        ctx.fillRect(point.x - 5, point.y - 5, 10, 10);

        ctx.restore();
    },

    drawCircle: function drawCircle(ctx, point, name, theme) {
        ctx.save();

        ctx.fillStyle = theme;

        ctx.fillText('' + name, point.x + 10, point.y + 10);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    },

    drawHandle: function drawHandle(ctx, point, handle, name, theme) {
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        ctx.lineWidth = 0.5;
        ctx.fillText('' + name, handle.x + 10, handle.y);
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(handle.x, handle.y);
        ctx.stroke();

        ctx.closePath();
        ctx.restore();
    },

    drawBoundingBox: function drawBoundingBox(ctx, path, theme) {
        var bounds = path.bounds();
        if (!path.bounds()) {
            return;
        }
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        ctx.lineWidth = 0.2;

        ctx.setLineDash([2, 2]);
        ctx.strokeRect(bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);

        ctx.beginPath();
        ctx.moveTo(bounds.center.x, bounds.min.y);
        ctx.lineTo(bounds.center.x, bounds.max.y);
        ctx.moveTo(bounds.min.x, bounds.center.y);
        ctx.lineTo(bounds.max.x, bounds.center.y);
        ctx.stroke();

        ctx.closePath();
        ctx.restore();
    },

    ////
    // lines
    ////

    line: function line(ctx, prev, point) {
        if (!prev) {
            return;
        }
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
    },

    bezierLine: function bezierLine(ctx, prev, point) {
        if (!prev) {
            return;
        }
        //ctx.moveTo(prev.x, prev.y);//Dev
        var prevM = prev && typeof prev.members !== 'undefined' ? prev.members.length : 0;
        var pointM = typeof point.members !== 'undefined' ? point.members.length : 0;

        // line
        if (!prevM && !pointM) {
            ctx.lineTo(point.x, point.y);
            return;
        }
        // middle
        if (prevM > 1 && pointM > 1) {
            ctx.bezierCurveTo(prev.members[1].x, prev.members[1].y, point.members[0].x, point.members[0].y, point.x, point.y);
            return;
        }
        // start
        if (!prevM && pointM) {
            ctx.quadraticCurveTo(point.members[0].x, point.members[0].y, point.x, point.y);
            return;
        }
        // end
        if (prevM && !pointM) {
            ctx.quadraticCurveTo(prev.members[1].x, prev.members[1].y, point.x, point.y);
        }
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
    if (!str || str === 'transparent') {
        return [0, 0, 0, 1];
    }
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
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "app--color-picker mui-panel" }, [_c('table', { staticClass: "mui-table" }, [_c('tbody', [_c('tr', [_c('td', [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.RGBA[0], expression: "RGBA[0]", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "255" }, domProps: { "value": _vm.RGBA[0] }, on: { "__r": function __r($event) {
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

var EditPathPoints = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_vm.path && _vm.path.points !== 'undefined' ? _c('div', { staticClass: "app--micro-form" }, _vm._l(_vm.path.points, function (point, index) {
            return _c('section', [_c('strong', [_vm._v("Point " + _vm._s(index))]), _c('div', [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: point.x, expression: "point.x", modifiers: { "number": true } }], attrs: { "type": "text", "size": "3" }, domProps: { "value": point.x }, on: { "change": function change($event) {
                        _vm.update();
                    }, "input": function input($event) {
                        if ($event.target.composing) {
                            return;
                        }point.x = _vm._n($event.target.value);
                    }, "blur": function blur($event) {
                        _vm.$forceUpdate();
                    } } }), _c('label', [_vm._v("x")]), _c('input', { directives: [{ name: "model", rawName: "v-model.number", value: point.y, expression: "point.y", modifiers: { "number": true } }], attrs: { "type": "text", "size": "3" }, domProps: { "value": point.y }, on: { "change": function change($event) {
                        _vm.update();
                    }, "input": function input($event) {
                        if ($event.target.composing) {
                            return;
                        }point.y = _vm._n($event.target.value);
                    }, "blur": function blur($event) {
                        _vm.$forceUpdate();
                    } } }), _c('label', [_vm._v("y")])]), _vm._l(point.members, function (member, i) {
                return typeof point.members !== 'undefined' && point.members.length ? _c('div', [_c('strong', [_vm._v("cp[" + _vm._s(i) + "]")]), _c('br'), _c('input', { directives: [{ name: "model", rawName: "v-model.number", value: member.x, expression: "member.x", modifiers: { "number": true } }], attrs: { "type": "text", "size": "3" }, domProps: { "value": member.x }, on: { "change": function change($event) {
                            _vm.update();
                        }, "input": function input($event) {
                            if ($event.target.composing) {
                                return;
                            }member.x = _vm._n($event.target.value);
                        }, "blur": function blur($event) {
                            _vm.$forceUpdate();
                        } } }), _c('label', [_vm._v("x")]), _c('input', { directives: [{ name: "model", rawName: "v-model.number", value: member.y, expression: "member.y", modifiers: { "number": true } }], attrs: { "type": "text", "size": "3" }, domProps: { "value": member.y }, on: { "change": function change($event) {
                            _vm.update();
                        }, "input": function input($event) {
                            if ($event.target.composing) {
                                return;
                            }member.y = _vm._n($event.target.value);
                        }, "blur": function blur($event) {
                            _vm.$forceUpdate();
                        } } }), _c('label', [_vm._v(".y")])]) : _vm._e();
            }), _c('br')], 2);
        })) : _vm._e()]);
    }, staticRenderFns: [],
    name: 'EditPathPoints',
    props: ['path'],
    methods: {
        update: function update() {
            this.$parent.$emit('edit-path-points:updated');
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

var Dev = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('section', { staticClass: "mui-form" }, [_c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.show, expression: "show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.show) ? _vm._i(_vm.show, null) > -1 : _vm.show }, on: { "__c": function __c($event) {
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
                } } }), _vm._v(" Show " + _vm._s(_vm.label))])]), _vm.show ? _c('pre', [_vm._v(_vm._s(_vm.data))]) : _vm._e()]);
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

//TODO this can be moved into figure paths
var compute$1 = function compute$1(path, state) {
    var figure = state.figure;
    switch (figure) {
        case 'flower':
        case 'seaStar':
            break;
        default:
            Space$1.Bezier.smoothPath(path, state[figure].tension);
    }
    return path;
};

var draw$1 = function draw$1(path, state, canvas) {
    canvas.ctx.save();
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;
    canvas.ctx.fillStyle = state.canvas.fillStyle;

    var length = path.points.length;
    var prev = void 0;
    var point = void 0;
    var i = void 0;

    //// curve
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(path.first().x, path.first().y);
    for (i = 1; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);
        Helpers.bezierLine(canvas.ctx, prev, point);
    }
    canvas.ctx.fill();
    canvas.ctx.stroke();
    canvas.ctx.restore();
    //// helpers

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showHandles) {
            if (point.members !== undefined && point.members.length > 1) {
                Helpers.drawHandle(canvas.ctx, point, point.members[0], i + ':left', 'red');
                Helpers.drawHandle(canvas.ctx, point, point.members[1], i + ':right', 'blue');
            }
        }
        if (state.showPoints) {
            Helpers.drawPoint(canvas.ctx, point, i + ':point', '#666666');
        }
        if (state.showPath) {
            Helpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Helpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
    canvas.ctx.restore();
};

////
// Figures
////

var Figures = {
    // circle
    circle: function circle(state) {
        var path = new Space$1.Path(state.origin.x, state.origin.y);
        path.add(50, 50);
        path.add(150, 50);
        path.add(150, 150);
        path.add(50, 150);
        path.close();
        path.scale(1.5, 1.5);
        return path;
    },

    star: function star(state) {
        var dim = state.origin.x < state.origin.y ? state.origin.x : state.origin.y;
        var margin = dim * 0.2;
        var outer = dim - margin;
        var inner = margin;
        var figure = new Space$1.Star(state.star.segments, outer, inner, state.origin);
        return figure.path;
    },

    flower: function flower(state) {
        var dim = state.origin.x < state.origin.y ? state.origin.x : state.origin.y;
        var margin = dim * 0.2;
        var outer = dim - margin;
        var inner = 10;
        var figure = new Space$1.Star(state.flower.segments, outer, inner, state.origin);
        figure.flower(state.flower.outerTension);
        return figure.path;
    },

    seaStar: function seaStar(state) {
        var dim = state.origin.x < state.origin.y ? state.origin.x : state.origin.y;
        var margin = dim * 0.2;
        var outer = dim - margin;
        var inner = margin;
        var figure = new Space$1.Star(state.seaStar.segments, outer, inner, state.origin);
        figure.seaStar(state.seaStar.innerTension);
        return figure.path;
    },

    free: function free(state) {
        var path = new Space$1.Path();
        path.points = [new Space$1.Point.Cartesian(20, 50), new Space$1.Point.Cartesian(100, 100), new Space$1.Point.Cartesian(150, 50), new Space$1.Point.Cartesian(200, 150), new Space$1.Point.Cartesian(250, 50), new Space$1.Point.Cartesian(300, 70), new Space$1.Point.Cartesian(310, 130), new Space$1.Point.Cartesian(380, 30)];
        path.scale(2, 2);
        path.translate(50, state.origin.y / 2);
        return path;
    },

    random: function random(state, canvas) {
        var path = new Space$1.Path();
        var segments = Utils.randInt(10, 100);
        var range = 200;
        var rand = void 0;
        path.add(new Space$1.Group(canvas.width / 2, canvas.height / 2));
        for (var i = 0; i < segments; i += 1) {
            rand = new Space$1.Point.Cartesian(Utils.randInt(-range, range) * Utils.randInt(), Utils.randInt(-range, range) * Utils.randInt());
            rand.add(path.last());
            rand.x = Utils.bounds(rand.x, 0, canvas.width);
            rand.y = Utils.bounds(rand.y, 0, canvas.height);
            path.add(rand);
        }
        return path;
    },

    triplet: function triplet(state) {
        var path = new Space$1.Path(state.origin.x, state.origin.y);
        path.add(-200, -200);
        path.progress(100, 200);
        path.progress(100, -200);
        return path;
    }
};

var defaults = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'transparent', //'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

var BezierPath = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', [_c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'circle' }, on: { "click": function click($event) {
                    _vm.goTo('circle');
                } } }, [_vm._v("Circle")]), _vm._v(" "), _c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'free' }, on: { "click": function click($event) {
                    _vm.goTo('free');
                } } }, [_vm._v("Open Path")]), _vm._v(" "), _c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'random' }, on: { "click": function click($event) {
                    _vm.state.figure == 'random' ? _vm.init('random') : _vm.goTo('random');
                } } }, [_vm._v("Random")]), _vm._v(" "), _c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'star' }, on: { "click": function click($event) {
                    _vm.goTo('star');
                } } }, [_vm._v("Star")]), _vm._v(" "), _c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'flower' }, on: { "click": function click($event) {
                    _vm.goTo('flower');
                } } }, [_vm._v("Flower")]), _vm._v(" "), _c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'seaStar' }, on: { "click": function click($event) {
                    _vm.goTo('seaStar');
                } } }, [_vm._v("Sea Star")]), _vm._v(" "), _c('button', { staticClass: "mui-btn mui-btn--small app--btn", class: { active: _vm.state.figure == 'triplet' }, on: { "click": function click($event) {
                    _vm.goTo('triplet');
                } } }, [_vm._v("Triplet")])]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Helpers")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showHandles, expression: "state.showHandles" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showHandles) ? _vm._i(_vm.state.showHandles, null) > -1 : _vm.state.showHandles }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showHandles,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showHandles = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showHandles = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showHandles = $$c;
                    }
                } } }), _vm._v(" Handles")])]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showPoints, expression: "state.showPoints" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showPoints) ? _vm._i(_vm.state.showPoints, null) > -1 : _vm.state.showPoints }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showPoints,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showPoints = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showPoints = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showPoints = $$c;
                    }
                } } }), _vm._v(" Points")])]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showPath, expression: "state.showPath" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showPath) ? _vm._i(_vm.state.showPath, null) > -1 : _vm.state.showPath }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showPath,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showPath = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showPath = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showPath = $$c;
                    }
                } } }), _vm._v(" Path")])]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showBounds, expression: "state.showBounds" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showBounds) ? _vm._i(_vm.state.showBounds, null) > -1 : _vm.state.showBounds }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showBounds,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showBounds = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showBounds = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showBounds = $$c;
                    }
                } } }), _vm._v(" Bounding Box")])])]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("States")]), typeof _vm.state[_vm.state.figure].tension !== 'undefined' ? _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state[_vm.state.figure].tension, expression: "state[state.figure].tension", modifiers: { "number": true } }], attrs: { "type": "range", "min": "-2", "max": "2", "step": "0.1" }, domProps: { "value": _vm.state[_vm.state.figure].tension }, on: { "change": function change($event) {
                    _vm.init();
                }, "__r": function __r($event) {
                    _vm.state[_vm.state.figure].tension = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Corner tension "), _c('small', [_vm._v("(" + _vm._s(_vm.state[_vm.state.figure].tension) + ")")])])]) : _vm._e(), typeof _vm.state[_vm.state.figure].segments !== 'undefined' ? _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state[_vm.state.figure].segments, expression: "state[state.figure].segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "3", "max": "20" }, domProps: { "value": _vm.state[_vm.state.figure].segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "__r": function __r($event) {
                    _vm.state[_vm.state.figure].segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state[_vm.state.figure].segments) + ")")])])]) : _vm._e(), typeof _vm.state[_vm.state.figure].outerTension !== 'undefined' ? _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state[_vm.state.figure].outerTension, expression: "state[state.figure].outerTension", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "25", "step": "1" }, domProps: { "value": _vm.state[_vm.state.figure].outerTension }, on: { "change": function change($event) {
                    _vm.init();
                }, "__r": function __r($event) {
                    _vm.state[_vm.state.figure].outerTension = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Outer corner tension "), _c('small', [_vm._v("(" + _vm._s(_vm.state[_vm.state.figure].outerTension) + ")")])])]) : _vm._e(), typeof _vm.state[_vm.state.figure].innerTension !== 'undefined' ? _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state[_vm.state.figure].innerTension, expression: "state[state.figure].innerTension", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "5", "step": "0.1" }, domProps: { "value": _vm.state[_vm.state.figure].innerTension }, on: { "change": function change($event) {
                    _vm.init();
                }, "__r": function __r($event) {
                    _vm.state[_vm.state.figure].innerTension = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Inner corner tension "), _c('small', [_vm._v("(" + _vm._s(_vm.state[_vm.state.figure].innerTension) + ")")])])]) : _vm._e()]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Appearance")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.stroke.edit, expression: "state.stroke.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.stroke.edit) ? _vm._i(_vm.state.stroke.edit, null) > -1 : _vm.state.stroke.edit }, on: { "__c": function __c($event) {
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
                } } }), _vm._v(" Edit Stroke")])]), _vm.state.stroke.edit ? _c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.canvas.lineWidth, expression: "state.canvas.lineWidth", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.canvas.lineWidth }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.canvas.lineWidth = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width")])]), _c('color-picker', { attrs: { "targ": 'strokeStyle', "rgba": _vm.state.canvas.strokeStyle } })], 1) : _vm._e(), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.fill.edit, expression: "state.fill.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.fill.edit) ? _vm._i(_vm.state.fill.edit, null) > -1 : _vm.state.fill.edit }, on: { "__c": function __c($event) {
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
                } } }), _vm._v(" Edit Fill")])]), _vm.state.fill.edit ? _c('div', { staticClass: "mui-panel" }, [_c('color-picker', { attrs: { "targ": 'fillStyle', "rgba": _vm.state.canvas.fillStyle } })], 1) : _vm._e()]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Path")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.path.edit, expression: "state.path.edit" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.path.edit) ? _vm._i(_vm.state.path.edit, null) > -1 : _vm.state.path.edit }, on: { "__c": function __c($event) {
                    var $$a = _vm.state.path.edit,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.path.edit = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.path.edit = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.path.edit = $$c;
                    }
                } } }), _vm._v(" Edit Path")])])]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Devel")]), _vm.state.path.edit ? _c('div', { staticClass: "mui-panel" }, [_c('edit-path-points', { attrs: { "path": _vm.path } })], 1) : _vm._e(), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1)]);
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
        this.$on('edit-path-points:updated', function () {
            _this.update();
        });
    },
    watch: {
        '$route': function $route(to) {
            this.state.figure = to.params.figure;
            this.init();
        }
    },
    data: function data() {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', defaults),
                stroke: {
                    edit: false
                },
                fill: {
                    edit: false
                },
                path: {
                    edit: false
                },
                // helpers
                showHandles: true,
                showPoints: true,
                showPath: false,
                showBounds: false,
                figure: typeof this.$route.params.figure !== 'undefined' ? this.$route.params.figure : 'free',
                // special states
                circle: {
                    tension: 0.5
                },
                star: {
                    segments: 6,
                    tension: 0.5
                },
                flower: {
                    segments: 6,
                    outerTension: 15
                },
                seaStar: {
                    segments: 6,
                    innerTension: 0.5
                },
                free: {
                    tension: 0.5
                },
                random: {
                    tension: 0.5
                },
                triplet: {
                    tension: 0.5
                }
            },
            path: null
        };
    },
    components: {
        ColorPicker: ColorPicker,
        Dev: Dev,
        EditPathPoints: EditPathPoints
    },
    mounted: function mounted() {
        //@TODO cancel animation
        this.animation.only(function () {}).cancel(); // !!!!!
        this.init();
    },

    methods: {

        // compute path and draw
        init: function init(figure) {
            var _this2 = this;

            if (figure !== undefined) {
                this.state.figure = figure;
            }
            var timeout = null;
            this.canvas.clear();

            //@TODO
            timeout = window.setTimeout(function () {
                // !in timeout
                if (!_this2.state.origin) {
                    _this2.state.origin = new Space$1.Point.Cartesian(_this2.canvas.canvas.width / 2, _this2.canvas.canvas.height / 2);
                }
                _this2.path = Figures[_this2.state.figure](_this2.state, _this2.canvas.canvas);

                compute$1(_this2.path, _this2.state, _this2.canvas.canvas);
                draw$1(_this2.path, _this2.state, _this2.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },

        // draws from state path
        update: function update() {
            var _this3 = this;

            var timeout = null;
            this.canvas.clear();

            //@TODO
            timeout = window.setTimeout(function () {
                draw$1(_this3.path, _this3.state, _this3.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },

        goTo: function goTo(figure) {
            this.$router.push({ name: this.$route.name, params: { figure: figure } });
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

var compute$2 = function compute$2(figure, state, canvas) {

    if (!state.origin) {
        state.origin = new Space$2.Point.Cartesian(canvas.width / 2, canvas.height / 2);
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
                fig = new Space$2.Path();
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
                fig = new Space$2.Polygon(state.Polygon.segments, state.Polygon.radius, state.origin);
                break;
            }

        case 'Rectangle':
            {
                fig = new Space$2.Rectangle(state.Rectangle.width, state.Rectangle.height, state.origin);
                break;
            }

        case 'Star':
            {
                fig = new Space$2.Star(state.Star.segments, state.Star.outerRadius, state.Star.innerRadius, state.origin);
                break;
            }

        case 'Cog':
            {
                fig = new Space$2.Cog(state.Cog.segments, state.Cog.outerRadius, state.Cog.innerRadius, state.origin);
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
    canvas.ctx.fillStyle = state.fill.show && figure !== 'Path' ? state.canvas.fillStyle : 'transparent';
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

    //// helpers
    var length = path.points.length;
    var prev = void 0;
    var point = void 0;
    var i = void 0;

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showPoints) {
            Helpers.drawPoint(canvas.ctx, point, i + ':point', 'orange');
        }
        if (state.showPath) {
            Helpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Helpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
};

var defaults$1 = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

var Figures$1 = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', [_c('div', { staticClass: "mui-dropdown" }, [_c('button', { staticClass: "mui-btn mui-btn-small", attrs: { "data-mui-toggle": "dropdown" } }, [_vm._v(_vm._s(_vm.figure ? _vm.figure : 'Choose') + " "), _c('span', { staticClass: "mui-caret mui--text-accent" })]), _c('ul', { staticClass: "mui-dropdown__menu" }, _vm._l(_vm.figures, function (fig) {
            return fig.name !== _vm.figure ? _c('li', { class: { 'router-link-active': fig.name === _vm.figure } }, [_c('a', { on: { "click": function click($event) {
                        _vm.goTo(fig);
                    } } }, [_vm._v(_vm._s(fig.name))])]) : _vm._e();
        }))])]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Helpers")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showPoints, expression: "state.showPoints" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showPoints) ? _vm._i(_vm.state.showPoints, null) > -1 : _vm.state.showPoints }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showPoints,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showPoints = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showPoints = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showPoints = $$c;
                    }
                } } }), _vm._v(" Points")])]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showPath, expression: "state.showPath" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showPath) ? _vm._i(_vm.state.showPath, null) > -1 : _vm.state.showPath }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showPath,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showPath = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showPath = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showPath = $$c;
                    }
                } } }), _vm._v(" Path")])]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.showBounds, expression: "state.showBounds" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.showBounds) ? _vm._i(_vm.state.showBounds, null) > -1 : _vm.state.showBounds }, on: { "change": function change($event) {
                    _vm.init();
                }, "__c": function __c($event) {
                    var $$a = _vm.state.showBounds,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
                        var $$v = null,
                            $$i = _vm._i($$a, $$v);if ($$c) {
                            $$i < 0 && (_vm.state.showBounds = $$a.concat($$v));
                        } else {
                            $$i > -1 && (_vm.state.showBounds = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                        }
                    } else {
                        _vm.state.showBounds = $$c;
                    }
                } } }), _vm._v(" Bounding Box")])])]), _vm.figure === 'Path' ? _c('section', { staticClass: "mui-form--inline" }, [_c('div', { staticClass: "app--inline-field mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Path.segments, expression: "state.Path.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Path.segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Path.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.Path.segments) + ")")])])])]) : _vm._e(), _vm.figure === 'Polygon' ? _c('section', { staticClass: "mui-form--inline" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Polygon.segments, expression: "state.Polygon.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Polygon.segments }, on: { "change": function change($event) {
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
                } } }), _c('label', [_vm._v("Radius")])])]) : _vm._e(), _vm.figure === 'Star' ? _c('section', { staticClass: "mui-form--inline" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Star.segments, expression: "state.Star.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Star.segments }, on: { "change": function change($event) {
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
                } } }), _c('label', [_vm._v("inner Radius")])])]) : _vm._e(), _vm.figure === 'Cog' ? _c('section', { staticClass: "mui-form--inline" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Cog.segments, expression: "state.Cog.segments", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Cog.segments }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Cog.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Cog.outerRadius, expression: "state.Cog.outerRadius", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Cog.outerRadius }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Cog.outerRadius = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("outer Radius")])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Cog.innerRadius, expression: "state.Cog.innerRadius", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Cog.innerRadius }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.Cog.innerRadius = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("inner Radius")])])]) : _vm._e(), _vm.figure === 'Rectangle' ? _c('section', { staticClass: "mui-form--inline" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.Rectangle.width, expression: "state.Rectangle.width", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.Rectangle.width }, on: { "change": function change($event) {
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
                } } }), _c('label', [_vm._v("Height")])])]) : _vm._e(), _vm.state.fill.form ? _c('section', { staticClass: "mui-form--inline" }, [_c('legend', [_vm._v("Background")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.fill.show, expression: "state.fill.show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.fill.show) ? _vm._i(_vm.state.fill.show, null) > -1 : _vm.state.fill.show }, on: { "change": function change($event) {
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
                } } }), _vm._v(" Edit")])]) : _vm._e(), _vm.state.fill.edit ? _c('div', [_c('color-picker', { attrs: { "targ": 'fillStyle', "rgba": _vm.state.canvas.fillStyle } })], 1) : _vm._e()]) : _vm._e(), _c('section', { staticClass: "mui-form--inline" }, [_c('legend', [_vm._v("Stroke")]), _c('div', { staticClass: "mui-checkbox" }, [_c('label', [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.state.stroke.show, expression: "state.stroke.show" }], attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.state.stroke.show) ? _vm._i(_vm.state.stroke.show, null) > -1 : _vm.state.stroke.show }, on: { "change": function change($event) {
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
                } } }), _vm._v(" Edit")])]) : _vm._e(), _vm.state.stroke.edit ? _c('div', [_c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.canvas.lineWidth, expression: "state.canvas.lineWidth", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.canvas.lineWidth }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.canvas.lineWidth = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width")])])]), _c('color-picker', { attrs: { "targ": 'strokeStyle', "rgba": _vm.state.canvas.strokeStyle } })], 1) : _vm._e()]), _c('section', { staticClass: "mui-form--inline" }, [_c('legend', [_vm._v("Translate")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.tanslate[0], expression: "state.tanslate[0]", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.tanslate[0] }, on: { "change": function change($event) {
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
                } } }), _c('label', [_vm._v("Y")])])]), _c('section', { staticClass: "mui-form--inline" }, [_c('legend', [_vm._v("Scale")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.scale[0], expression: "state.scale[0]", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.scale[0] }, on: { "change": function change($event) {
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
                } } }), _c('label', [_vm._v("Y")])])]), _c('section', { staticClass: "mui-form--inline" }, [_c('legend', [_vm._v("Rotate")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.rotate2D, expression: "state.rotate2D", modifiers: { "number": true } }], attrs: { "type": "text" }, domProps: { "value": _vm.state.rotate2D }, on: { "change": function change($event) {
                    _vm.init();
                }, "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.state.rotate2D = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("rad")])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'Figures',
    props: ['animation', 'appState', 'canvas'],
    watch: {
        '$route': function $route(to) {
            this.figure = to.params.figure;
            this.state.canvas = this.appState.factor('canvas', defaults$1);
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
                    form: true,
                    show: true,
                    edit: false
                },
                stroke: {
                    show: true,
                    edit: false
                },
                // transform
                tanslate: [0, 0],
                scale: [1, 1],
                rotate2D: 0,
                // helpers
                showPoints: false,
                showPath: false,
                showBounds: false,
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
                Cog: {
                    segments: 5,
                    outerRadius: 200,
                    innerRadius: 125
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
            this.initForms();
            //@TODO
            timeout = window.setTimeout(function () {
                var path = compute$2(_this2.figure, _this2.state, _this2.canvas.canvas);
                draw$2(_this2.figure, path, _this2.state, _this2.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },
        initForms: function initForms() {
            this.state.fill.form = this.figure !== 'Path';
        },
        goTo: function goTo(figure) {
            this.$router.push({ name: this.$route.name, params: { figure: figure.name } });
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
    if (!state.prev) {
        state.prev = new Space$3.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    var path = new Space$3.Path();
    var range = state.segmentsRange;
    var count = 0;
    var rand = void 0;
    path.add(state.prev);
    while (count < state.segments) {
        rand = new Space$3.Point.Cartesian(Utils.randInt(-range, range) * Utils.randInt(), Utils.randInt(-range, range) * Utils.randInt());
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
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segments, expression: "state.segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "10", "max": "800", "step": "10" }, domProps: { "value": _vm.state.segments }, on: { "__r": function __r($event) {
                    _vm.state.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segments) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
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
            path = compute$3(_this.state, _this.canvas.canvas);

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
    var radius = Math.floor(Utils.randInt(5, state.radiusRange));
    var segments = Math.floor(Utils.randInt(3, state.segmentsRange));
    segments = Utils.bounds(segments, false, 25);
    radius = Utils.bounds(radius, false, canvas.width / 2);

    state.prev.segments = segments;
    state.prev.radius = radius;

    return new Space$4.Polygon(segments, radius, state.origin);
};

var Polygon = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.radiusRange, expression: "state.radiusRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "500" }, domProps: { "value": _vm.state.radiusRange }, on: { "__r": function __r($event) {
                    _vm.state.radiusRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.radiusRange) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
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
    var width = Math.floor(Utils.randInt(5, state.widthRange));
    var height = Math.floor(Utils.randInt(3, state.heightRange));

    state.prev.width = width;
    state.prev.height = height;

    return new Space$5.Rectangle(width, height, state.origin);
};

var Rectangle = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.widthRange, expression: "state.widthRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "1000" }, domProps: { "value": _vm.state.widthRange }, on: { "__r": function __r($event) {
                    _vm.state.widthRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Width Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.widthRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.heightRange, expression: "state.heightRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "5", "max": "1000" }, domProps: { "value": _vm.state.heightRange }, on: { "__r": function __r($event) {
                    _vm.state.heightRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Height Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.heightRange) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
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

var compute$6 = function compute$6(state, canvas) {
    if (!state.origin) {
        state.origin = new Space$6.Point.Cartesian(canvas.width / 2, canvas.height / 2);
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

    return new Space$6.Star(segments, outerRadius, innerRadius, state.origin);
};

var Star = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
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
                } } }), _c('label', [_vm._v("Inner Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.innerRadiusRange) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
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
            polygon = compute$6(_this.state, _this.canvas.canvas);

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

var Space$7 = window.Space;

var compute$7 = function compute$7(state, canvas) {
    if (!state.origin) {
        state.origin = new Space$7.Point.Cartesian(canvas.width / 2, canvas.height / 2);
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

    return new Space$7.Cog(segments, outerRadius, innerRadius, state.origin);
};

var Cog = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "1", "max": "50" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
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
                } } }), _c('label', [_vm._v("Inner Radius Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.innerRadiusRange) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
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
            polygon = compute$7(_this.state, _this.canvas.canvas);

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

var Space$8 = window.Space;

var compute$8 = function compute$8(state, canvas) {
    var path = new Space$8.Path();
    var phi = Math.PI * 2 / state.segments;
    var maxR = canvas.width < canvas.height ? canvas.width / 3 : canvas.height / 3;
    var minR = maxR * state.segmentsRange;
    var r = void 0;
    var p = void 0;
    for (var i = 0; i < state.segments; i += 1) {
        r = Utils.randInt(minR, maxR);
        p = new Space$8.Point.Polar(r, i * phi);
        path.add(new Space$8.Group(p.x(), p.y()));
    }
    path.close();
    path.translate(canvas.width / 2, canvas.height / 2);
    Space$8.Bezier.smoothPath(path, state.tension);
    return path;
};

var Bezier = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segments, expression: "state.segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "3", "max": "60", "step": "1" }, domProps: { "value": _vm.state.segments }, on: { "__r": function __r($event) {
                    _vm.state.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segments) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segmentsRange, expression: "state.segmentsRange", modifiers: { "number": true } }], attrs: { "type": "range", "min": "0", "max": "1", "step": "0.1" }, domProps: { "value": _vm.state.segmentsRange }, on: { "__r": function __r($event) {
                    _vm.state.segmentsRange = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segments range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segmentsRange) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.tension, expression: "state.tension", modifiers: { "number": true } }], attrs: { "type": "range", "min": "-2", "max": "2", "step": "0.1" }, domProps: { "value": _vm.state.tension }, on: { "__r": function __r($event) {
                    _vm.state.tension = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Corner tension "), _c('small', [_vm._v("(" + _vm._s(_vm.state.tension) + ")")])])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
    }, staticRenderFns: [],
    name: 'Path',
    props: ['animation', 'appState', 'canvas'],
    components: {
        Dev: Dev
    },
    data: function data() {
        return {
            state: {
                segments: 10,
                segmentsRange: 0.3,
                canvas: this.appState.factor('canvas', {
                    lineWidth: 0.5
                }),
                tension: 0.5
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
            path = compute$8(_this.state, _this.canvas.canvas);

            // init
            _this.canvas.fill();
            _this.canvas.ctx.save();

            // styles
            _this.canvas.ctx.strokeStyle = _this.state.canvas.strokeStyle;
            _this.canvas.ctx.lineWidth = _this.state.canvas.lineWidth;

            //// curve
            var length = path.points.length;
            var prev = void 0;
            var point = void 0;
            var i = void 0;

            _this.canvas.ctx.beginPath();
            _this.canvas.ctx.moveTo(path.first().x, path.first().y);
            for (i = 1; i < length; i += 1) {
                prev = path.prev(i);
                point = path.get(i);
                Helpers.bezierLine(_this.canvas.ctx, prev, point);
            }
            _this.canvas.ctx.fill();
            _this.canvas.ctx.stroke();
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

var Space$9 = window.Space;

var radius = function radius(state, margin) {
    margin = margin || 50;
    return state.canvas.width < state.canvas.height ? state.canvas.width / 2 - margin : state.canvas.height / 2 - 50;
};

var Figures$2 = {

    available: ['Line', 'Polygon', 'Star', 'Cog'],

    create: function create(type, state, reference) {

        var segments = reference !== undefined ? reference.path.length() : state.segments;
        var figure = void 0;

        switch (type) {
            case 'Line':
                {
                    var from = new Space$9.Point.Cartesian(0, state.canvas.height / 2);
                    var to = new Space$9.Point.Cartesian(state.canvas.width, state.canvas.height / 2);
                    figure = new Space$9.Line(from, to, segments);
                    break;
                }
            case 'Polygon':
                {
                    figure = new Space$9.Polygon(segments, radius(state), state.origin);
                    break;
                }
            case 'Star':
                {
                    figure = new Space$9.Star(segments, radius(state), 50, state.origin);
                    break;
                }
            case 'Cog':
                {
                    figure = new Space$9.Cog(segments, radius(state), 50, state.origin);
                    break;
                }
            default:
            // nothing
        }
        return figure;
    }

};

var compute$9 = function compute$9(morpher) {
    if (morpher.finished()) {
        morpher.reverse();
    }
    morpher.progress();
};

var draw$3 = function draw$3(path, state, canvas) {

    canvas.ctx.save();
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;
    canvas.ctx.fillStyle = state.canvas.fillStyle;

    var length = path.points.length;
    var prev = void 0;
    var point = void 0;
    var i = void 0;

    //// curve
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(path.first().x, path.first().y);
    for (i = 1; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);
        Helpers.bezierLine(canvas.ctx, prev, point);
    }
    canvas.ctx.fill();
    canvas.ctx.stroke();
    canvas.ctx.restore();
    //// helpers

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showHandles) {
            if (point.members !== undefined && point.members.length > 1) {
                Helpers.drawHandle(canvas.ctx, point, point.members[0], i + ':left', 'red');
                Helpers.drawHandle(canvas.ctx, point, point.members[1], i + ':right', 'blue');
            }
        }
        if (state.showPoints) {
            Helpers.drawPoint(canvas.ctx, point, i + ':point', '#666666');
        }
        if (state.showPath) {
            Helpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Helpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
    canvas.ctx.restore();
};

var Morpher = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_c('section', [_c('div', { staticClass: "mui-dropdown" }, [_c('button', { staticClass: "mui-btn mui-btn-small", attrs: { "data-mui-toggle": "dropdown" } }, [_vm._v(_vm._s(_vm.figures.src ? _vm.figures.src : 'Choose') + " "), _c('span', { staticClass: "mui-caret mui--text-accent" })]), _c('ul', { staticClass: "mui-dropdown__menu" }, _vm._l(_vm.figures.available, function (fig) {
            return _c('li', { class: { 'router-link-active': fig === _vm.figures.src } }, [_c('a', { on: { "click": function click() {
                        _vm.figures.src = fig;
                    } } }, [_vm._v(_vm._s(fig))])]);
        }))]), _c('span', [_vm._v(" to ")]), _c('div', { staticClass: "mui-dropdown" }, [_c('button', { staticClass: "mui-btn mui-btn-small", attrs: { "data-mui-toggle": "dropdown" } }, [_vm._v(_vm._s(_vm.figures.targ ? _vm.figures.targ : 'Choose') + " "), _c('span', { staticClass: "mui-caret mui--text-accent" })]), _c('ul', { staticClass: "mui-dropdown__menu" }, _vm._l(_vm.figures.available, function (fig) {
            return _c('li', { class: { 'router-link-active': fig === _vm.figures.targ } }, [_c('a', { on: { "click": function click() {
                        _vm.figures.targ = fig;
                    } } }, [_vm._v(_vm._s(fig))])]);
        }))])]), _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Edit Params")]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.steps, expression: "state.steps", modifiers: { "number": true } }], attrs: { "type": "range", "min": "10", "max": "1000", "step": "10" }, domProps: { "value": _vm.state.steps }, on: { "__r": function __r($event) {
                    _vm.state.steps = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Steps "), _c('small', [_vm._v("( " + _vm._s(_vm.morpher ? _vm.morpher.count : 0) + " of " + _vm._s(_vm.state.steps) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.number", value: _vm.state.segments, expression: "state.segments", modifiers: { "number": true } }], attrs: { "type": "range", "min": "3", "max": "50" }, domProps: { "value": _vm.state.segments }, on: { "__r": function __r($event) {
                    _vm.state.segments = _vm._n($event.target.value);
                }, "blur": function blur($event) {
                    _vm.$forceUpdate();
                } } }), _c('label', [_vm._v("Segment Range "), _c('small', [_vm._v("(" + _vm._s(_vm.state.segments) + ")")])])]), _c('div', { staticClass: "mui-textfield" }, [_c('button', { staticClass: "mui-btn mui-btn--small mui-btn--primary", on: { "click": function click($event) {
                    _vm.create();
                } } }, [_vm._v("Create Morpher")])])]), _c('dev', { attrs: { "label": 'State', "data": _vm.state } })], 1);
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
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'white',
                    lineWidth: 1
                }),
                segments: 6,
                steps: 100
            },
            path: null,
            figures: {
                src: typeof this.$route.params.srcFigure !== 'undefined' ? this.$route.params.srcFigure : 'Polygon',
                targ: typeof this.$route.params.targFigure !== 'undefined' ? this.$route.params.targFigure : 'Star',
                available: Figures$2.available
            },
            morpher: null
        };
    },
    methods: {
        init: function init() {
            this.state.origin = new Space$9.Point.Cartesian(this.state.canvas.width / 2, this.state.canvas.height / 2);
        },
        create: function create() {
            if (Figures$2.available.indexOf(this.figures.src) === -1) {
                throw new Error('Morpher component: Source figure of type "' + this.figures.src + '" not recognized.');
            }
            if (Figures$2.available.indexOf(this.figures.targ) === -1) {
                throw new Error('Morpher component: Target figure of type "' + this.figures.targ + '" not recognized.');
            }

            var targFigure = Figures$2.create(this.figures.targ, this.state);
            var srcFigure = Figures$2.create(this.figures.src, this.state, targFigure);
            this.path = srcFigure.path;
            this.morpher = new Space$9.Morpher(srcFigure.path, targFigure.path, this.state.steps);
        }
    },
    mounted: function mounted() {
        var _this = this;

        this.canvas.fill();

        this.animation.fps(32).only(function () {
            // @TODO
            if (!_this.state.origin) {
                _this.init();
                _this.create();
                return;
            }

            compute$9(_this.morpher);
            draw$3(_this.path, _this.state, _this.canvas);
            // init
            _this.canvas.fill();
        }).play();
    }
};

// landing views
// single views
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
    name: 'Cog',
    path: '/Cog',
    component: Cog,
    meta: {
        menu: true,
        figure: true
    }
}, {
    name: 'Bezier',
    path: '/Bezier',
    component: Bezier,
    meta: {
        menu: true,
        figure: false
    }
}, {
    name: 'Figures',
    path: '/Figures/:figure?',
    component: Figures$1,
    meta: {
        menu: true,
        figure: false
    }
}, {
    name: 'BezierPaths',
    path: '/BezierPath/:figure?',
    component: BezierPath,
    meta: {
        menu: true,
        figure: false
    }
}, {
    name: 'Morph',
    path: '/Morph/:srcFigure?/:targFigure?',
    component: Morpher,
    meta: {
        menu: true,
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
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', [_vm.animation.id ? _c('section', { staticClass: "mui-form" }, [_c('legend', [_vm._v("Animation "), _c('small', [_vm._v(_vm._s(_vm.animation.count))])]), _c('a', { staticClass: "mui-btn mui-btn--small mui-btn--primary", on: { "click": function click($event) {
                    _vm.animation.toggle();
                } } }, [_vm._v(_vm._s(_vm.animation.running ? 'pause' : 'play') + " ")]), _c('a', { staticClass: "mui-btn mui-btn--small app--btn", on: { "click": function click($event) {
                    _vm.show = !_vm.show;
                } } }, [_vm._v("Throttle")]), _vm.show ? _c('div', { staticClass: "mui-panel" }, [_c('div', { staticClass: "mui-textfield" }, [_c('input', { attrs: { "type": "range", "min": "0", "max": "100" }, on: { "change": function change($event) {
                    _vm.throttle($event.target.value);
                } } }), _c('label', [_vm._v("fps "), _c('small', [_vm._v("(" + _vm._s(1000 / _vm.animation.interval) + ")")])])])]) : _vm._e()]) : _vm._e()]);
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
