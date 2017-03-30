<template>
    <div>
        <form class="mui-form">
            <div class="mui-textfield">
                <input type="range" v-model.number="state.widthRange" min="5" max="1000">
                <label>Width Range <small>({{ state.widthRange }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.heightRange" min="5" max="1000">
                <label>Height Range <small>({{ state.heightRange }})</small></label>
            </div>
            <pre>{{state}}</pre>
        </form>
    </div>
</template>

<script>
import Utils from '../Utils';

const Space = window.Space;

const state = {
    prev: {
        width: 25,
        height: 50
    },
    widthRange: 500,
    heightRange: 500,
    origin: null
};

const compute = function(state, canvas) {
    if(!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width/2, canvas.height/2);
    }
    let width = Math.floor(Utils.randInt(5, state.widthRange));
    let height = Math.floor(Utils.randInt(3, state.heightRange));

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
    data: function () {
        return {
            state
        };
    },
    mounted() {
        let polygon;
        this.canvas.clear();

        this.animation
        // .fps(1)
        .only(() => {
            // compute path
            polygon = compute(this.state, this.canvas.canvas);

            // draw
            this.canvas.clear();
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(polygon.path.first().x, polygon.path.first().y);

            polygon.path.points.forEach((point, index)=> {
                if(index === 0){
                    return;
                }
                this.canvas.ctx.lineTo(point.x, point.y);
                this.canvas.ctx.strokeStyle = this.appState.canvas.strokeStyle;
                this.canvas.ctx.lineWidth = this.appState.canvas.lineWidth;
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
