<template>
    <div>
        <section class="mui-form">
            <legend>Edit Params</legend>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segments" min="3" max="60" step="1">
                <label>Segments <small>({{ state.segments }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segmentsRange" min="0" max="1" step="0.1">
                <label>Segments range <small>({{ state.segmentsRange }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.tension" min="-2" max="2" step="0.1">
                <label>Corner tension <small>({{ state.tension }})</small></label>
            </div>
        </section>

        <!-- devel -->
        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Utils from '../Utils';
import Dev from '../Form/Dev';
import Canvas2dHelpers from '../Canvas2dHelpers';

import Space from '../../Space';

const compute = function (state, canvas) {
    const path = new Space.Path();
    const phi = (Math.PI * 2) / state.segments;
    const maxR = (canvas.width < canvas.height) ? (canvas.width / 3) : (canvas.height / 3);
    const minR = maxR * state.segmentsRange;
    let r;
    let p;
    for (let i = 0; i < state.segments; i += 1) {
        r = Utils.randInt(minR, maxR);
        p = new Space.Point.Polar(r, i * phi);
        path.add(new Space.Group(p.x(), p.y()));
    }
    path.close();
    path.translate(canvas.width / 2, canvas.height / 2);
    Space.Bezier.smoothPath(path, state.tension);
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
                segments: 10,
                segmentsRange: 0.3,
                canvas: this.appState.factor('canvas', {
                    lineWidth: 0.5
                }),
                tension: 0.5
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

            //// curve
            const length = path.points.length;
            let prev;
            let point;
            let i;

            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(path.first().x, path.first().y);
            for (i = 1; i < length; i += 1) {
                prev = path.prev(i);
                point = path.get(i);
                Canvas2dHelpers.bezierLine(this.canvas.ctx, prev, point);
            }
            this.canvas.ctx.fill();
            this.canvas.ctx.stroke();
        })
        .play()
        ;
    }
};

</script>

<style>
</style>
