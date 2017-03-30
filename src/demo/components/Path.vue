<template>
    <div>
        <form class="mui-form">
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segments" min="10" max="800" step="10">
                <label>Segments <small>({{ state.segments }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segmentsRange" min="1" max="50">
                <label>Segment Range <small>({{ state.segmentsRange }})</small></label>
            </div>
            <pre>{{state}}</pre>
        </form>
    </div>
</template>

<script>
import Utils from '../Utils';

const Space = window.Space;

const state = {
    prev: null,
    segments: 100,
    segmentsRange: 10
};

const compute = function(state, canvas) {
    if (!state.prev) {
        state.prev = new Space.Point.Cartesian(canvas.width/2, canvas.height/2);
    }
    const path = new Space.Path(state.prev.x, state.prev.y);
    const range = state.segmentsRange;
    let count = 0;
    let rand;

    while(count < state.segments){
        const segX = Utils.randInt(-range, range) * Utils.randInt();
        const segY = Utils.randInt(-range, range) * Utils.randInt();
        let x = path.last().x + segX;
        let y = path.last().y + segY;
        x = Utils.bounds(x, 0, canvas.width);
        y = Utils.bounds(y, 0, canvas.height);
        path.add(x, y);
        count++;
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
    data: function () {
        return {
            state
        };
    },
    mounted() {
        let path;
        this.canvas.clear();

        this.animation
        // .fps(1)
        .only(() => {
            // compute path
            path = compute(this.state, this.canvas.canvas);

            // draw
            this.canvas.clear();
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(path.first().x, path.first().y);

            path.points.forEach((point, index)=> {
                if(index === 0){
                    return;
                }
                this.canvas.ctx.lineTo(point.x, point.y);
                this.canvas.ctx.strokeStyle = this.appState.strokeStyle;
                this.canvas.ctx.lineWidth = this.appState.lineWidth;
                this.canvas.ctx.stroke();
            });
            this.canvas.ctx.closePath();
        })
        .play()
        ;
    }
};

</script>

<style>
</style>
