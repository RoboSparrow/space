<template>
    <div>
        <form class="mui-form">

            <div class="mui-textfield">
                <button class="mui-btn mui-btn--small app--btn" v-on:click="init('circle')" v-bind:class="{active: state.figure == 'circle'}">Circle</button>
                <button class="mui-btn mui-btn--small app--btn" v-on:click="init('free')"   v-bind:class="{active: state.figure == 'free'}">Open Path</button>
                <button class="mui-btn mui-btn--small app--btn" v-on:click="init('random')" v-bind:class="{active: state.figure == 'random'}">Random</button>
                <button class="mui-btn mui-btn--small app--btn" v-on:click="init('star')" v-bind:class="{active: state.figure == 'star'}">Star</button>
            </div>

            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showHelpers" v-on:change="init()"> Handles
                </label>
            </div>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.stroke.edit" > Stroke
                </label>
            </div>

            <div class="mui-textfield">
                <input type="range" v-model.number="state.tension" min="-2" max="2" step="0.1" v-on:change="init()">
                <label>Corner tension <small>({{ state.tension }})</small></label>
            </div>

            <div class="mui-panel" v-if="state.stroke.edit">
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.canvas.lineWidth" v-on:change="init()" >
                    <label>Width</label>
                </div>
                <color-picker :targ="'strokeStyle'" :rgba="state.canvas.strokeStyle"></color-picker>
            </div>

        </form>

        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Canvas2dHelpers from '../Canvas2dHelpers';
import Utils from '../Utils';

import ColorPicker from '../components/form/ColorPicker.vue';
import Dev from '../components/form/Dev.vue';

const Space = window.Space;

const compute = function (path, state) {
    Space.Bezier.smoothPath(path, state.tension);
    return path;
};

const draw = function (path, state, canvas) {
    canvas.ctx.save();
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;

    if (state.showHelpers) {
        Canvas2dHelpers.drawCircle(canvas.ctx, path.origin(), 'origin:' + path.origin().toArray(), 'yellow');
    }

    const length = path.points.length;
    let prev;
    let point;
    let i;

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        //// helpers
        if (state.showHelpers) {
            if (point.members !== undefined && point.members.length > 1) {
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[0], i + ':left', 'red');
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[1], i + ':right', 'blue');
            }
            Canvas2dHelpers.drawPoint(canvas.ctx, point, i + ':point', '#666666');
            Canvas2dHelpers.drawLine(canvas.ctx, prev, point, '#666666');
        }

        //// curve
        canvas.ctx.beginPath();
        Canvas2dHelpers.bezierLine(canvas.ctx, prev, point);
        canvas.ctx.stroke();

    }
};

////
// Figures
////

const Figures = {
    // circle
    circle: function () {
        const path = new Space.Path();
        path.points = [
            new Space.Point.Cartesian(50, 50), //(50, 200),
            new Space.Point.Cartesian(150, 50), //(150, 200),
            new Space.Point.Cartesian(150, 150), //(150, 300),
            new Space.Point.Cartesian(50, 150) //(50, 300)
        ];
        path.close();
        path.scale(1.5, 1.5);
        path.translate(200, 200);
        return path;
    },

    star: function (state, canvas) {
        const dim = (state.origin.x < state.origin.y) ? state.origin.x : state.origin.y;
        const margin = dim * 0.2;
        const outer = dim - margin;
        const inner = margin;
        const figure = new Space.Star(6, outer, inner, state.origin);
        return figure.path;
    },

    free: function () {
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
        path.translate(200, 200);
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
    }
};

const defaults = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'rgba(255, 255, 255, 1)',
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
        this.$on('color-picker:strokeStyle', (val) => {
            this.state.canvas.strokeStyle = val;
            this.state.stroke.edit = false;
            this.init();
        });
    },
    data: function () {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', defaults),
                stroke: {
                    edit: false
                },
                tension: 0.5,
                showHelpers: true,
                figure: 'free'
            }
        };
    },
    components: {
        ColorPicker,
        Dev
    },
    mounted() {
        //@TODO cancel animation
        this.animation.only(() => {}).cancel(); // !!!!!
        this.init();
    },
    methods: {
        init: function (figure) {
            if (figure !== undefined) {
                this.state.figure = figure;
            }

            const path = Figures[this.state.figure](this.state, this.canvas.canvas);
            let timeout = null;
            this.canvas.clear();
            //@TODO
            timeout = window.setTimeout(() => {
                // !in timeout
                if (!this.state.origin) {
                    this.state.origin = new Space.Point.Cartesian(this.canvas.canvas.width / 2, this.canvas.canvas.height / 2);
                }

                compute(path, this.state, this.canvas.canvas);
                draw(path, this.state, this.canvas);
                window.clearTimeout(timeout);
            }, 100);
        }
    }
};
</script>

<style>
</style>
