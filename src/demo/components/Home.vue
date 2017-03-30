<template>
    <div>
        nothing
    </div>
</template>

<script>
import Utils from '../Utils';

const Space = window.Space;

const compute = function(state, canvas) {
    if(!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width/2, canvas.height/2);
    }

    let i;
    const figures  = {};

    // Path
    const path = new Space.Path(canvas.width / 2, canvas.height / 2);
    const segments = Utils.randInt(10, 100);
    for(i = 1; i < segments; i++) {
        const prev = path.points[i - 1];
        path.add(prev.x + Utils.randInt(-100, 100), prev.y + Utils.randInt(-100, 100));
    }

    figures.Path = {
        path: path,
        opacity: 0.25
    };

    // star (segments, outerRadius, innerRadius, center)
    const star = new Space.Star(Utils.randInt(3, 50), Utils.randInt(200, 500), Utils.randInt(10, 200), new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2));

    figures.star = {
        path: star.path,
        opacity: .6
    };

    state.prev.figures = figures;
    return figures;
};

const randRgba = function (opacity) {
    opacity = opacity || Utils.randInt(0, 1);
    return 'rgba(' + Math.floor(Utils.randInt(0, 255)) +  ', ' + Math.floor(Utils.randInt(0, 255)) + ', ' + Math.floor(Utils.randInt(0, 255)) + ', ' + opacity + ')';
};

const draw = function(path, ctx, opacity) {
    //init
    ctx.save();

    // styles
    ctx.fillStyle = randRgba(opacity);
    ctx.strokeStyle = randRgba(opacity);
    ctx.lineWidth = 1;

    // path
    ctx.beginPath();
    ctx.moveTo(path.first().x, path.first().y);
    path.points.forEach((point, index) => {
        if(index === 0){
            return;
        }
        ctx.lineTo(point.x, point.y);
    });

    // draw
    if(ctx.fillStyle){
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
            state:  {
                prev: {
                    figures: {}
                },
                origin: null,
                canvas: this.appState.factor('canvas')
            }
        };
    },
    mounted() {
        let polygon;
        this.canvas.clear();

        this.animation
        .fps(32)
        .only(() => {
            // compute path
            const figures = compute(this.state, this.canvas.canvas);
            const tasks = Object.keys(figures);
            // init
            this.canvas.clear();

            // draw
            tasks.forEach((id) => {
                draw(figures[id].path, this.canvas.ctx, figures[id].opacity);
            });
        })
        .play()
        ;
    }
};
</script>

<style>
</style>
