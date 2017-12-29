<template>
    <div>
        morph: {{state.currentTitle}}, segments {{state.segments}}
    </div>
</template>

<script>
import Utils from './Utils';
import Canvas2dHelpers from './Canvas2dHelpers';

let paused; //timeout
const Space = window.Space;

const boundary = function (canvas, margin) {
    margin = margin || 0;
    return (canvas.width > canvas.height) ? canvas.height - margin : canvas.height - margin;
};

const center = function (canvas) {
    return new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
};

const Sequence = [
    {
        name: 'Star',
        create: function (state, canvas) {
            const origin = center(canvas);
            const outerRadius = boundary(canvas, 50) / 2;
            const innerRadius = outerRadius / 3;
            const segments = state.segments / 2 //DEV: FOR COG

            return new Space.Star(segments, outerRadius, innerRadius, origin);
        }
    },
    {
        name: 'Cog',
        create: function (state, canvas) {
            const origin = center(canvas);
            const outerRadius = boundary(canvas, 50) / 2;
            const innerRadius = outerRadius / 3;
            const segments = state.segments / 4; //DEV

            return new Space.Cog(segments, outerRadius, innerRadius, origin);
        }
    },
    {
        name: 'Rectangle',
        create: function (state, canvas) {
            const origin = center(canvas);
            const width = boundary(canvas, 50);
            const height = width / 2;

            return new Space.Rectangle(width, height, origin);
        }
    }
];

const morpher = function (state, canvas) {
    //TODO peogress state.currentIndex
    const currentIndex = state.currentIndex;
    const nextIndex = (currentIndex < Sequence.length) ? currentIndex + 1 : 0;

    const steps = state.steps;
    const current = Sequence[currentIndex];
    const next = Sequence[nextIndex];

    const src = current.create(state, canvas);
    const targ = next.create(state, canvas);

    state.currentTitle = `${current.name} to ${next.name}`;

    return new Space.Morpher(src.path, targ.path, steps);
};

const draw = function (path, state, canvas) {
    canvas.clear();

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
    name: 'Home',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    data: function () {
        return {
            state: {
                currentIndex: 0,
                currentTitle: '',
                steps: 30,
                segments: 12,

                prev: {
                    figures: {}
                },
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(255, 255, 255, 1)',
                })
            },
            morpher: null
        };
    },
    created() {
    },
    mounted() {
        this.canvas.fill();

        this.animation
        .fps(32)
        .only(() => {
            // compute path
            this.updateMe();

            // draw
            draw(this.morpher.src, this.state, this.canvas);
        })
        .play()
        ;
    },
    methods: {
        updateMe: function () {

            if (!this.morpher) {
                this.morpher = morpher(this.state, this.canvas.canvas);
            }

            const finished = this.morpher.finished();

            if (finished) {
                paused = setTimeout(() => {
                    //morpher.reverse();
                    this.state.currentIndex = (this.state.currentIndex < Sequence.length - 1) ? this.state.currentIndex + 1 : 0;
                    this.morpher = morpher(this.state, this.canvas.canvas);
                    clearTimeout(paused);
                }, 1000);

                return;
            }

            this.morpher.progress();
        }
    }
};
</script>

<style>
</style>
