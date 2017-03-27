<template>
    <div>
        <div class="pure-control-group">
            <label for="name">Segment Range</label>
            <input type="range" v-model.number="state.segmentsRange" min="1" max="50">
            <span class="pure-form-message-inline">gre {{state}}</span>
        </div>
    </div>
</template>

<script>
import Utils from '../Utils';

const Space = window.Space;
let prev;

const state = {
    prev: null,
    segments: 100,
    segmentsRange: 5
};

const compute = function(state, canvas) {
    if (!state.prev) {
        state.prev = new Space.Point.Cartesian(canvas.width/2, canvas.height/2);
    }
    const path = new Space.Path(state.prev.x, state.prev.y);
    const range = state.segmentsRange;
    let count = 0;
    while(count < state.segments){
        let x = Utils.randIntRange(path.last().x, [-range, range], [0, canvas.width]);
        let y = Utils.randIntRange(path.last().y, [-range, range], [0, canvas.height]);
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
        })
        .play()
        //.stop()
        ;
        console.log(this.animation);
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
