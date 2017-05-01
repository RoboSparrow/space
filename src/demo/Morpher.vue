<template>
    <div>
        <section class="mui-form">
            <legend>Edit Params</legend>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.steps" min="10" max="1000" step="10">
                <label>Steps <small>( {{(morpher) ? morpher.count : 0}} of {{ state.steps }})</small></label>
            </div>
            <div class="mui-textfield">
                <button class="mui-btn mui-btn--small app--btn" v-on:click="create()">Go</button>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segmentsRange" min="1" max="50">
                <label>Segment Range <small>({{ state.segmentsRange }})</small></label>
            </div>
        </section>

        <!-- devel -->
        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Canvas2dHelpers from './Canvas2dHelpers';

const Space = window.Space;

const createTarget = function (state) {
    return new Space.Star(state.Star.segments, state.Star.outerRadius, state.Star.innerRadius, state.origin);
};

const createMorpher = function (path, state) {
    const from = new Space.Point.Cartesian(0, state.canvas.height / 2);
    const to = new Space.Point.Cartesian(state.canvas.width, state.canvas.height / 2);

    const src = new Space.Line(from, to, path.length());
    return new Space.Morpher(path, src.path, state.steps);
};

const compute = function (morpher) {
    if (morpher.finished()) {
        morpher.reverse();
    }
    morpher.progress();
};

const draw = function (path, state, canvas) {
    canvas.ctx.save();
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;
    canvas.ctx.fillStyle = state.canvas.fillStyle;

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
    canvas.ctx.restore();
    //// helpers

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showHandles) {
            if (point.members !== undefined && point.members.length > 1) {
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[0], i + ':left', 'red');
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[1], i + ':right', 'blue');
            }
        }
        if (state.showPoints) {
            Canvas2dHelpers.drawPoint(canvas.ctx, point, i + ':point', '#666666');
        }
        if (state.showPath) {
            Canvas2dHelpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Canvas2dHelpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
    canvas.ctx.restore();
};

export default {
    name: 'Morpher',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    data: function () {
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
                Star: {
                    segments: 5,
                    outerRadius: 200,
                    innerRadius: 70
                },
                steps: 100
            },
            figure: null,
            morpher: null
        };
    },
    created() {
        // temp redirect
        // this.$router.push('/Path');
    },
    methods: {
        init: function () {
            this.state.origin = new Space.Point.Cartesian(this.state.canvas.width / 2, this.state.canvas.height / 2);
        },
        create: function () {
            this.figure = createTarget(this.state);
            this.morpher = createMorpher(this.figure.path, this.state);
        }
    },
    mounted() {
        this.canvas.fill();

        this.animation
        .fps(32)
        .only(() => {
            // @TODO
            if (!this.state.origin) {
                this.init();
                this.create();
                return;
            }

            compute(this.morpher);
            draw(this.figure.path, this.state, this.canvas);
            // init
            this.canvas.fill();

        })
        .play()
        ;
    }
};
</script>

<style>
</style>
