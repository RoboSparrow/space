<template>
    <div>
        <form class="mui-form">

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

    const length = path.points.length;
    let prev;
    let point;
    let i;
    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        //// helpers
        if (state.showHelpers) {
            if (point.members.length > 1) {
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

// *****************************
// * Circle (closed)
// *****************************

const path1 = new Space.Path();
path1.points = [
    new Space.Point.Cartesian(50, 50), //(50, 200),
    new Space.Point.Cartesian(150, 50), //(150, 200),
    new Space.Point.Cartesian(150, 150), //(150, 300),
    new Space.Point.Cartesian(50, 150) //(50, 300)
];
path1.close();
path1.scale(1.5, 1.5);
path1.translate(200, 200);

// *****************************
// * Open
// *****************************

const path2 = new Space.Path();
path2.points = [
    new Space.Point.Cartesian(20, 50),
    new Space.Point.Cartesian(100, 100),
    new Space.Point.Cartesian(150, 50),
    new Space.Point.Cartesian(200, 150),
    new Space.Point.Cartesian(250, 50),
    new Space.Point.Cartesian(300, 70),
    new Space.Point.Cartesian(310, 130),
    new Space.Point.Cartesian(380, 30)
];
path2.translate(350, 200);

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
                showHelpers: true
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
        init: function () {
            let timeout = null;
            this.canvas.clear();
            //@TODO
            timeout = window.setTimeout(() => {
                compute(path1, this.state, this.canvas.canvas);
                draw(path1, this.state, this.canvas);

                compute(path2, this.state, this.canvas.canvas);
                draw(path2, this.state, this.canvas);

                window.clearTimeout(timeout);
            }, 100);
        }
    }
};
</script>

<style>
</style>
