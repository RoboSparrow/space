<template>
    <div>
        <section class="mui-form">
            <legend>Edit Params</legend>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.widthRange" min="5" max="1000">
                <label>Width Range <small>({{ state.widthRange }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.heightRange" min="5" max="1000">
                <label>Height Range <small>({{ state.heightRange }})</small></label>
            </div>
        </section>

        <!-- devel -->
        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Utils from '../Utils';
import Dev from '../Form/Dev.vue';

import Space from '../../Space';

const compute = function (state, canvas) {
    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }
    const width = Math.floor(Utils.randInt(5, state.widthRange));
    const height = Math.floor(Utils.randInt(3, state.heightRange));

    state.prev.width = width;
    state.prev.height = height;

    return new Space.Rectangle(width, height, state.origin);
};

export default {
    name: 'Rectangle',
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
                    width: 25,
                    height: 50
                },
                widthRange: 500,
                heightRange: 500,
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(255, 255, 255, .2)'
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
