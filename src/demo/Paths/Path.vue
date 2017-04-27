<template>
    <div>
        <section class="mui-form">
            <legend>Edit Params</legend>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segments" min="10" max="800" step="10">
                <label>Segments <small>({{ state.segments }})</small></label>
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
import Utils from '../Utils';
import Dev from '../Form/Dev.vue';

const Space = window.Space;

const compute = function (state, canvas) {
    if (!state.prev) {
        state.prev = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    const path = new Space.Path();
    const range = state.segmentsRange;
    let count = 0;
    let rand;
    path.add(state.prev);
    while (count < state.segments) {
        rand = new Space.Point.Cartesian(
            Utils.randInt(-range, range) * Utils.randInt(),
            Utils.randInt(-range, range) * Utils.randInt()
        );
        rand.add(path.last());
        rand.x = Utils.bounds(rand.x, 0, canvas.width);
        rand.y = Utils.bounds(rand.y, 0, canvas.height);
        path.add(rand);
        count += 1;
    }

    state.prev = path.last();
    return path;
};

export default {
    name: 'Path',
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
                prev: null,
                segments: 200,
                segmentsRange: 10,
                canvas: this.appState.factor('canvas')
            }
        };
    },
    mounted() {
        let path;

        this.animation
        // .fps(1)
        .only(() => {
            // compute path
            path = compute(this.state, this.canvas.canvas);

            // init
            this.canvas.fill();
            this.canvas.ctx.save();

            // styles
            this.canvas.ctx.strokeStyle = this.state.canvas.strokeStyle;
            this.canvas.ctx.lineWidth = this.state.canvas.lineWidth;

            // path
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(path.first().x, path.first().y);
            path.points.forEach((point, index) => {
                if (index === 0) {
                    return;
                }
                this.canvas.ctx.lineTo(point.x, point.y);
                // draw
                this.canvas.ctx.stroke();
            });

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
