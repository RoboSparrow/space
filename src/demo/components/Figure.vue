<template>
    <div>
        <form class="mui-form">
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segmentsRange" min="1" max="50">
                <label>Segment Range <small>({{ state.segmentsRange }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.radiusRange" min="5" max="500">
                <label>Radius Range <small>({{ state.radiusRange }})</small></label>
            </div>
            <pre>{{state}}</pre>
        </form>
    </div>
</template>

<script>
import Routes from '../Routes';

const Space = window.Space;

const compute = function (figure, state, canvas) {

    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    let fig;
    let width;
    let segments;

    switch (figure) {

        case 'Path': {
            let margin = 50;
            width = canvas.width - (2 * margin);
            segments = 5;
            const delta = width / segments;
            fig = new Space.Path(margin, margin);
            while (segments > 0) {
                margin = -margin;
                fig.progress(delta, (margin > 0) ? margin : canvas.height - margin);
                segments -= 1;
            }
            break;
        }

        default: {
            fig = null;
        }

    }

    return (typeof fig.path !== 'undefined') ? fig.path : fig;

};

const draw = function (path, state, canvas) {
    canvas.ctx.save();

    // styles
    canvas.ctx.fillStyle = this.state.canvas.fillStyle;
    canvas.ctx.strokeStyle = this.state.canvas.strokeStyle;
    canvas.ctx.lineWidth = this.state.canvas.lineWidth;

    // path
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(path.first().x, path.first().y);
    path.points.forEach((point, index) => {
        if (index === 0) {
            return;
        }
        canvas.ctx.lineTo(point.x, point.y);
    });

    // draw
    if (this.state.canvas.fillStyle) {
        canvas.ctx.fill();
    }
    canvas.ctx.stroke();

    // finish
    canvas.ctx.closePath();
    canvas.ctx.restore();
};

export default {
    name: 'Figure',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    watch: {
        '$route'(to, from) {
            console.log(this.$route);
            this.title = this.$route;
        }
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
                    fillStyle: 'rgba(0, 255, 255, 1)'
                })
            },
            routes: Routes.figures(),
            title: this.$route
        };
    },
    mounted() {
        this.canvas.clear();
        const figure = (typeof this.$route.params.figure !== 'undefined') ? this.$route.params.figure : 'Path';
        const path = compute(figure, this.state, this.canvas.canvas);
        draw(path, this.state, this.canvas.canvas);
    }
};
</script>

<style>
</style>
