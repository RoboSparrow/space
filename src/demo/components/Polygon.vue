<template>
    <div>
        <form class="mui-form">
            <section>
                <legend class="mui--text-subhead">Edit</legend>
                <form class="mui-form">
                    <div class="mui-textfield">
                        <input type="range" v-model.number="state.segmentsRange" min="1" max="50">
                        <label>Segment Range <small>({{ state.segmentsRange }})</small></label>
                    </div>
                    <div class="mui-textfield">
                        <input type="range" v-model.number="state.radiusRange" min="5" max="500">
                        <label>Radius Range <small>({{ state.radiusRange }})</small></label>
                    </div>
                </form>
                <dev :label="'State'" :data="state"></dev>
            </section>
        </form>
    </div>
</template>

<script>
import Utils from '../Utils';
import Dev from './form/Dev.vue';

const Space = window.Space;

const compute = function (state, canvas) {
    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    let radius = Math.floor(Utils.randInt(5, state.radiusRange));
    let segments = Math.floor(Utils.randInt(3, state.segmentsRange));
    segments = Utils.bounds(segments, false, 25);
    radius = Utils.bounds(radius, false, canvas.width / 2);

    state.prev.segments = segments;
    state.prev.radius = radius;

    return new Space.Polygon(segments, radius, state.origin);
};

export default {
    name: 'Polygon',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    components: {
        Dev
    },
    data: function () {
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
    mounted() {
        let polygon;

        this.animation
        // .fps(1)
        .only(() => {
            // compute path
            polygon = compute(this.state, this.canvas.canvas);

            // init
            this.canvas.fill();
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
