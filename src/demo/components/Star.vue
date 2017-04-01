<template>
    <div>
        <form class="mui-form">
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segmentsRange" min="1" max="50">
                <label>Segment Range <small>({{ state.segmentsRange }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.outerRadiusRange" min="5" max="500">
                <label>Outer Radius Range <small>({{ state.outerRadiusRange }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.innerRadiusRange" min="5" max="500">
                <label>Inner Radius Range <small>({{ state.innerRadiusRange }})</small></label>
            </div>
            <pre>{{state}}</pre>
        </form>
    </div>
</template>

<script>
import Utils from '../Utils';

const Space = window.Space;

const compute = function (state, canvas) {
    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    let outerRadius = Math.floor(Utils.randInt(5, state.outerRadiusRange));
    let innerRadius = Math.floor(Utils.randInt(5, state.innerRadiusRange));
    let segments = Math.floor(Utils.randInt(3, state.segmentsRange));
    segments = Utils.bounds(segments, false, 25);
    outerRadius = Utils.bounds(outerRadius, false, canvas.width / 2);
    innerRadius = Utils.bounds(innerRadius, false, canvas.width / 2);

    state.prev.segments = segments;
    state.prev.outerRadius = outerRadius;
    state.prev.innerRadius = innerRadius;

    return new Space.Star(segments, outerRadius, innerRadius, state.origin);
};

export default {
    name: 'Star',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    data: function () {
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
    mounted() {
        let polygon;

        this.animation
        // .fps(1)
        .only(() => {
            // compute path
            polygon = compute(this.state, this.canvas.canvas);

            // init
            this.canvas.clear();
            this.canvas.ctx.save();

            // styles
            this.canvas.ctx.fillStyle = this.state.canvas.fillStyle;
            this.canvas.ctx.strokeStyle = this.state.canvas.strokeStyle;
            this.canvas.ctx.lineWidth = this.state.canvas.lineWidth;

            // path
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(polygon.path.first().x, polygon.path.first().y);
            polygon.path.points.forEach((point, index) => {
                if (index === 0) {
                    return;
                }
                this.canvas.ctx.lineTo(point.x, point.y);
            });

            // draw
            if (this.state.canvas.fillStyle) {
                this.canvas.ctx.fill();
            }
            this.canvas.ctx.stroke();

            // finish
            this.canvas.ctx.closePath();
            this.canvas.ctx.restore();
        })
        .play()
        ;
    }
};
</script>

<style>
</style>
