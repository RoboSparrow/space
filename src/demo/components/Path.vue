<template>
    <div>
        <form class="mui-form">
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segments" min="1" max="500" step="10">
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
let prev;

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
        rand = Utils.randInt(-state.segmentsRange, state.segmentsRange);
        let x = Utils.bounds(path.last().x + rand, 0, canvas.width);
        rand = Utils.randInt(-state.segmentsRange, state.segmentsRange);
        let y = Utils.bounds(path.last().y + rand, 0, canvas.height);
        // console.log('here', x, y);
        path.add(x, y);
        count++;
    }

    return path;
};

export default {
    name: 'Path',
    props: [
        'animation',
        'states',
        'canvas'
    ],
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
                this.canvas.ctx.strokeStyle = this.states.canvas.strokeStyle;
                this.canvas.ctx.lineWidth = this.states.canvas.lineWidth;
                this.canvas.ctx.stroke();
            });
            this.canvas.ctx.closePath();

            state.prev = path.last();
        })
        .play()
        ;
    },
    components: {
    },
    data() {
        return {
            state
        };
    }
};

</script>

<style>
</style>
