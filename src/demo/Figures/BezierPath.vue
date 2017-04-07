<template>
    <div>
        <form class="mui-form--inline">

            <section v-if="figure === 'Path'">
                <div class="app--inline-field mui-textfield">
                    <input type="text" v-model.number="state.Path.segments" v-on:change="init()" >
                    <label>Segments <small>({{ state.Path.segments }})</small></label>
                </div>
            </section>

            <section>
                <legend class="mui--text-subhead">Background</legend>
                <div class="mui-checkbox">
                    <label>
                        <input type="checkbox" v-model="state.fill.show" v-on:change="init()"> Show
                    </label>
                </div>
                <div class="mui-checkbox" v-if="state.fill.show">
                    <label>
                        <input type="checkbox" v-model="state.fill.edit" > Edit
                    </label>
                </div>
            </section>

            <div class="mui-panel" v-if="state.fill.edit">
                <color-picker :targ="'fillStyle'" :rgba="state.canvas.fillStyle"></color-picker>
            </div>

            <section>
                <legend class="mui--text-subhead">Stroke</legend>
                <div class="mui-checkbox">
                    <label>
                        <input type="checkbox" v-model="state.stroke.show" v-on:change="init()"> Show
                    </label>
                </div>
                <div class="mui-checkbox" v-if="state.stroke.show">
                    <label>
                        <input type="checkbox" v-model="state.stroke.edit" > Edit
                    </label>
                </div>
            </section>

            <div class="mui-panel" v-if="state.stroke.edit">
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.canvas.lineWidth" v-on:change="init()" >
                    <label>Width</label>
                </div>
                <color-picker :targ="'strokeStyle'" :rgba="state.canvas.strokeStyle"></color-picker>
            </div>
            
        </form>

        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Utils from '../Utils';
import ColorPicker from '../components/form/ColorPicker.vue';
import Dev from '../components/form/Dev.vue';

const Space = window.Space;

const compute = function (state, canvas) {

    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    const bezier = new Space.BezierPath(new Space.Point.Cartesian());
    let i;
    for (i = 1; i < state.segments; i += 1) {
        //const point = new Space.Point.Cartesian(
        //    Utils.randInt(0, state.origin.x),
        //    Utils.randInt(0, state.origin.y)
        //);
        const point = new Space.Point.Cartesian(i * 50, i * 50);

        const cp1 = point.clone();
        cp1.translate(Utils.randInt(-state.origin.x, state.origin.x), Utils.randInt(-state.origin.y, state.origin.y));

        const cp2 = point.clone();
        cp2.translate(Utils.randInt(-state.origin.x, state.origin.x), Utils.randInt(-state.origin.y, state.origin.y));

        bezier.add(point, cp1, cp2);
    }
    console.log(JSON.stringify(bezier.points));
    console.log(bezier.points);
    return bezier;

};

const Helpers = {
    drawPoint: function (ctx, point, name, theme) {
        ctx.save();
        
        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;

        ctx.fillText(`${name}`, point.x + 20, point.y + 20);
        ctx.strokeRect(point.x - 5, point.y - 5, 10, 10);

        ctx.restore();
    },
    
    drawHandle: function (ctx, point, handle, name, theme) {
        ctx.save();
        
        ctx.beginPath();
        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        ctx.lineWidth = .5;
        ctx.fillText(`${name}`, handle.x + 20, handle.y + 20);
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(handle.x, handle.y);
        ctx.stroke();
    
        ctx.restore();
    }
};

const draw = function (path, state, canvas) {
    canvas.ctx.save();
    // styles
    canvas.ctx.fillStyle = (state.fill.show) ? state.canvas.fillStyle : null;
    canvas.ctx.strokeStyle = (state.stroke.show) ? state.canvas.strokeStyle : null;
    canvas.ctx.lineWidth = state.canvas.lineWidth;

    // path
    
    canvas.ctx.moveTo(0, 0);
    canvas.ctx.beginPath();
    path.points.forEach((point, index) => {
        if (index === 0) {
            return;
        }
        canvas.ctx.moveTo(path.points[index -1].point.x, path.points[index -1].point.y);
        canvas.ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.point.x, point.point.y);
    });

    // draw
    if (state.canvas.fillStyle) {
        canvas.ctx.fill();
    }
    canvas.ctx.stroke();

    // finish
    canvas.ctx.closePath();
    canvas.ctx.restore();
    
    if (state.drawHelpers) {
        path.points.forEach((point, index) => {
            Helpers.drawHandle(canvas.ctx, point.point, point.cp1, index + ':cp1', 'red');
            Helpers.drawHandle(canvas.ctx, point.point, point.cp2, index + ':cp2', 'blue');
            Helpers.drawPoint(canvas.ctx, point.point, index + ':point', 'yellow');
        });
    }
};

const defaults = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

export default {
    name: 'BezierPath',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    created: function () {
        this.$on('color-picker:fillStyle', (val) => {
            this.state.canvas.fillStyle = val;
            this.state.fill.edit = false;
            this.init();
        });
        this.$on('color-picker:strokeStyle', (val) => {
            this.state.canvas.strokeStyle = val;
            this.state.stroke.edit = false;
            this.init();
        });
    },
    data: function () {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', defaults),
                // form
                fill: {
                    show: false,
                    edit: false
                },
                stroke: {
                    show: true,
                    edit: false
                },
                segments: 15,
                drawHelpers: true
            }
        };
    },
    components: {
        ColorPicker,
        Dev
    },
    mounted() {
        //@TODO cancel animation
        this.animation.only(() => {}).cancel(); // !!!!!
        this.init();
    },
    methods: {
        init: function () {
            let timeout = null;
            this.canvas.clear();
            //@TODO
            timeout = window.setTimeout(() => {
                const path = compute(this.state, this.canvas.canvas);
                draw(path, this.state, this.canvas);
                window.clearTimeout(timeout);
            }, 100);
        }
    }
};
</script>

<style>
</style>
