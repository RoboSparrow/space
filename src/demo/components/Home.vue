<template>
    <div>
        nothing
    </div>
</template>

<script>
import Utils from '../Utils';

const Space = window.Space;

const compute = function (state, canvas) {
    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    let i;
    let origin;
    const figures = {};

    // Path
    const path = new Space.Path(state.origin);
    const segments = Utils.randInt(10, 100);
    path.add(origin);
    for (i = 1; i < segments; i += 1) {
        const prev = path.points[i - 1];
        path.add(prev.x + Utils.randInt(-100, 100), prev.y + Utils.randInt(-100, 100));
    }

    figures.Path = {
        path: path,
        fillStyle: [255, 255, 255, 0.05]
    };

    //
    // origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    origin = new Space.Point.Cartesian(Utils.randInt(canvas.width / 2, canvas.width), Utils.randInt(canvas.height / 2, canvas.height));
    const star = new Space.Star(Utils.randInt(3, 15), Utils.randInt(100, 300), Utils.randInt(10, 100), origin);

    figures.star = {
        path: star.path,
        fillStyle: [-1, -1, -1, 0.25]
    };

    // Square
    origin = new Space.Point.Cartesian(Utils.randInt(50, canvas.width / 2), Utils.randInt(50, canvas.height / 2));
    const dim = Utils.randInt(50, 75);
    const square = new Space.Rectangle(dim, dim, origin);

    figures.Square = {
        path: square.path,
        fillStyle: [-1, -1, -1, 0.25]
    };

    state.prev.figures = figures;
    return figures;
};

const randRgba = function (rgba) {
    const r = (rgba[0] > 0) ? rgba[0] : Math.round(Utils.randInt(0, 255));
    const g = (rgba[1] > 0) ? rgba[1] : Math.round(Utils.randInt(0, 255));
    const b = (rgba[2] > 0) ? rgba[2] : Math.round(Utils.randInt(0, 255));
    const a = (rgba[3] > 0) ? rgba[3] : Math.round(Utils.randInt(0, 1));
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

const draw = function (figure, ctx) {
    //init
    ctx.save();

    // styles
    ctx.fillStyle = randRgba(figure.fillStyle);
    ctx.strokeStyle = randRgba(figure.fillStyle);
    ctx.lineWidth = 1;

    // path
    const path = figure.path;
    ctx.beginPath();
    ctx.moveTo(path.first().x, path.first().y);
    path.points.forEach((point, index) => {
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
                prev: {
                    figures: {}
                },
                origin: null,
                canvas: this.appState.factor('canvas')
            }
        };
    },
    created() {
        // temp redirect
        // this.$router.push('/Path');
    },
    mounted() {
        this.canvas.fill();

        this.animation
        .fps(32)
        .only(() => {
            // compute path
            const figures = compute(this.state, this.canvas.canvas);
            const tasks = Object.keys(figures);
            // init
            this.canvas.fill();

            // draw
            tasks.forEach((id) => {
                draw(figures[id], this.canvas.ctx);
            });
        })
        .play()
        ;
    }
};
</script>

<style>
</style>
