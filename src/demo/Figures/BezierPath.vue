<template>
    <div>
        <!-- nav -->
        <section>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="goTo('circle')" v-bind:class="{active: state.figure == 'circle'}">Circle</button>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="goTo('free')"   v-bind:class="{active: state.figure == 'free'}">Open Path</button>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="(state.figure == 'random') ? init('random') : goTo('random')" v-bind:class="{active: state.figure == 'random'}">Random</button>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="goTo('star')" v-bind:class="{active: state.figure == 'star'}">Star</button>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="goTo('flower')" v-bind:class="{active: state.figure == 'flower'}">Flower</button>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="goTo('seaStar')" v-bind:class="{active: state.figure == 'seaStar'}">Sea Star</button>
            <button class="mui-btn mui-btn--small app--btn" v-on:click="goTo('triplet')" v-bind:class="{active: state.figure == 'triplet'}">Triplet</button>
        </section>
        <!-- helpers -->
        <section class="mui-form">
            <legend>Helpers</legend>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showHandles" v-on:change="init()"> Handles
                </label>
            </div>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showPath" v-on:change="init()"> Path
                </label>
            </div>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showBounds" v-on:change="init()"> Bounding Box
                </label>
            </div>
        </section>
        <!-- states for figure -->
        <section class="mui-form">
            <legend>States</legend>

            <div class="mui-textfield" v-if="typeof state[state.figure].tension !== 'undefined'">
                <input type="range" v-model.number="state[state.figure].tension" min="-2" max="2" step="0.1" v-on:change="init()">
                <label>Corner tension <small>({{ state[state.figure].tension }})</small></label>
            </div>

            <div class="mui-textfield" v-if="typeof state[state.figure].segments !== 'undefined'">
                <input type="range" v-model.number="state[state.figure].segments" min="3" max="20" v-on:change="init()">
                <label>Segments <small>({{ state[state.figure].segments }})</small></label>
            </div>

            <div class="mui-textfield" v-if="typeof state[state.figure].outerTension !== 'undefined'">
                <input type="range" v-model.number="state[state.figure].outerTension" min="0" max="25" step="1" v-on:change="init()">
                <label>Outer corner tension <small>({{ state[state.figure].outerTension }})</small></label>
            </div>

            <div class="mui-textfield" v-if="typeof state[state.figure].innerTension !== 'undefined'">
                <input type="range" v-model.number="state[state.figure].innerTension" min="0" max="5" step="0.1" v-on:change="init()">
                <label>Inner corner tension <small>({{ state[state.figure].innerTension }})</small></label>
            </div>
        </section>
        <!-- colors, stroke -->
        <section class="mui-form">
            <legend>Appearance</legend>

            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.stroke.edit" > Edit Stroke
                </label>
            </div>

            <div class="mui-panel" v-if="state.stroke.edit">
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.canvas.lineWidth" v-on:change="init()" >
                    <label>Width</label>
                </div>
                <color-picker :targ="'strokeStyle'" :rgba="state.canvas.strokeStyle"></color-picker>
            </div>

            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.fill.edit" > Edit Fill
                </label>
            </div>

            <div class="mui-panel" v-if="state.fill.edit">
                <color-picker :targ="'fillStyle'" :rgba="state.canvas.fillStyle"></color-picker>
            </div>
        </section>
        <!-- edit path points -->
        <section class="mui-form">
            <legend>Path</legend>

            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.path.edit" > Edit Path
                </label>
            </div>
        </section>
        <!-- devel -->
        <section class="mui-form">
            <legend>Devel</legend>
            <div class="mui-panel" v-if="state.path.edit">
                <edit-path-points :path="path"></edit-path-points>
            </div>
            <dev :label="'State'" :data="state"></dev>
        </section>
    </div>
</template>

<script>
import Canvas2dHelpers from '../Canvas2dHelpers';
import Utils from '../Utils';

import ColorPicker from '../components/form/ColorPicker.vue';
import EditPathPoints from '../components/form/EditPathPoints.vue';
import Dev from '../components/form/Dev.vue';

const Space = window.Space;

//TODO this can be moved into figure paths
const compute = function (path, state) {
    const figure = state.figure;
    switch (figure) {
        case 'flower':
        case 'seaStar':
            break;
        default:
            Space.Bezier.smoothPath(path, state[figure].tension);
    }
    return path;
};

const draw = function (path, state, canvas) {
    canvas.ctx.save();
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;
    canvas.ctx.fillStyle = state.canvas.fillStyle;

    if (state.showHelpers) {
        Canvas2dHelpers.drawCircle(canvas.ctx, path.origin(), 'origin:' + path.origin().toArray(), 'yellow');
    }

    const length = path.points.length;
    let prev;
    let point;
    let i;

    //// curve
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(path.first().x, path.first().y);
    for (i = 1; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);
        Canvas2dHelpers.bezierLine(canvas.ctx, prev, point);
    }
    canvas.ctx.fill();
    canvas.ctx.stroke();

    //// helpers

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showHandles) {
            if (point.members !== undefined && point.members.length > 1) {
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[0], i + ':left', 'red');
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[1], i + ':right', 'blue');
            }
            Canvas2dHelpers.drawPoint(canvas.ctx, point, i + ':point', '#666666');
        }
        if (state.showPath) {
            Canvas2dHelpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Canvas2dHelpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
};

////
// Figures
////

const Figures = {
    // circle
    circle: function (state) {
        const path = new Space.Path(state.origin.x, state.origin.y);
        path.add(50, 50);
        path.add(150, 50);
        path.add(150, 150);
        path.add(50, 150);
        path.close();
        path.scale(1.5, 1.5);
        return path;
    },

    star: function (state) {
        const dim = (state.origin.x < state.origin.y) ? state.origin.x : state.origin.y;
        const margin = dim * 0.2;
        const outer = dim - margin;
        const inner = margin;
        const figure = new Space.Star(state.star.segments, outer, inner, state.origin);
        return figure.path;
    },

    flower: function (state) {
        const dim = (state.origin.x < state.origin.y) ? state.origin.x : state.origin.y;
        const margin = dim * 0.2;
        const outer = dim - margin;
        const inner = 10;
        const figure = new Space.Star(state.flower.segments, outer, inner, state.origin);
        figure.flower(state.flower.outerTension);
        return figure.path;
    },

    seaStar: function (state) {
        const dim = (state.origin.x < state.origin.y) ? state.origin.x : state.origin.y;
        const margin = dim * 0.2;
        const outer = dim - margin;
        const inner = margin;
        console.log(state.seaStar);
        const figure = new Space.Star(state.seaStar.segments, outer, inner, state.origin);
        figure.seaStar(state.seaStar.innerTension);
        return figure.path;
    },

    free: function (state) {
        const path = new Space.Path();
        path.points = [
            new Space.Point.Cartesian(20, 50),
            new Space.Point.Cartesian(100, 100),
            new Space.Point.Cartesian(150, 50),
            new Space.Point.Cartesian(200, 150),
            new Space.Point.Cartesian(250, 50),
            new Space.Point.Cartesian(300, 70),
            new Space.Point.Cartesian(310, 130),
            new Space.Point.Cartesian(380, 30)
        ];
        path.scale(2, 2);
        path.translate(50, state.origin.y / 2);
        return path;
    },

    random: function (state, canvas) {
        const path = new Space.Path();
        const segments = Utils.randInt(10, 100);
        const range = 200;
        let rand;
        path.add(new Space.Group(canvas.width / 2, canvas.height / 2));
        for (let i = 0; i < segments; i += 1) {
            rand = new Space.Point.Cartesian(
                Utils.randInt(-range, range) * Utils.randInt(),
                Utils.randInt(-range, range) * Utils.randInt()
            );
            rand.add(path.last());
            rand.x = Utils.bounds(rand.x, 0, canvas.width);
            rand.y = Utils.bounds(rand.y, 0, canvas.height);
            path.add(rand);
        }
        return path;
    },

    triplet: function (state) {
        const path = new Space.Path(state.origin.x, state.origin.y);
        path.add(-200, -200);
        path.progress(100, 200);
        path.progress(100, -200);
        return path;
    }
};

const defaults = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'transparent', //'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

export default {
    name: 'BezierPath',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    created: function () {
        this.$on('color-picker:fillStyle', (val) => {
            this.state.canvas.fillStyle = val;
            this.state.fill.edit = false;
            this.init();
        });
        this.$on('color-picker:strokeStyle', (val) => {
            this.state.canvas.strokeStyle = val;
            this.state.stroke.edit = false;
            this.init();
        });
        this.$on('edit-path-points:updated', () => {
            this.update();
        });
    },
    watch: {
        '$route'(to) {
            this.state.figure = to.params.figure;
            this.init();
        }
    },
    data: function () {
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
                showHandles: true,
                showPath: false,
                showBounds: false,
                figure: (typeof this.$route.params.figure !== 'undefined') ? this.$route.params.figure : 'free',
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
        ColorPicker,
        Dev,
        EditPathPoints
    },
    mounted() {
        //@TODO cancel animation
        this.animation.only(() => {}).cancel(); // !!!!!
        this.init();
    },
    methods: {

        // compute path and draw
        init: function (figure) {
            if (figure !== undefined) {
                this.state.figure = figure;
            }
            let timeout = null;
            this.canvas.clear();

            //@TODO
            timeout = window.setTimeout(() => {
                // !in timeout
                if (!this.state.origin) {
                    this.state.origin = new Space.Point.Cartesian(this.canvas.canvas.width / 2, this.canvas.canvas.height / 2);
                }
                this.path = Figures[this.state.figure](this.state, this.canvas.canvas);

                compute(this.path, this.state, this.canvas.canvas);
                draw(this.path, this.state, this.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },

        // draws from state path
        update: function () {
            let timeout = null;
            this.canvas.clear();

            //@TODO
            timeout = window.setTimeout(() => {
                draw(this.path, this.state, this.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },

        goTo(figure) {
            this.$router.push({ name: this.$route.name, params: { figure: figure } });
        }
    }
};
</script>

<style>
</style>
