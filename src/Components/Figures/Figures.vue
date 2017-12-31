<template>
    <div>
        <section>
            <div class="mui-dropdown">
                <button class="mui-btn mui-btn-small" data-mui-toggle="dropdown">
                    {{ (figure) ? figure : 'Choose' }}
                    <span class="mui-caret mui--text-accent"></span>
                </button>
                <ul class="mui-dropdown__menu">
                    <li
                        v-for="fig in figures"
                        v-if="fig.name !== figure"
                        v-bind:class="{'router-link-active': fig.name === figure}"
                    >
                        <a v-on:click="goTo(fig)">{{ fig.name }}</a>
                    </li>
                </ul>
            </div>
        </section>

        <!-- helpers -->
        <section class="mui-form">
            <legend>Helpers</legend>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showPoints" v-on:change="init()"> Points
                </label>
            </div>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showPath" v-on:change="init()"> Path
                </label>
            </div>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showBounds" v-on:change="init()"> Bounding Box
                </label>
            </div>
        </section>

        <!-- figure:path -->
        <section class="mui-form--inline" v-if="figure === 'Path'">
            <div class="app--inline-field mui-textfield">
                <input type="text" v-model.number="state.Path.segments" v-on:change="init()" >
                <label>Segments <small>({{ state.Path.segments }})</small></label>
            </div>
        </section>

        <!-- figure:polygon -->
        <section class="mui-form--inline" v-if="figure === 'Polygon'">
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Polygon.segments" v-on:change="init()" >
                <label>Segments</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Polygon.radius" v-on:change="init()" >
                <label>Radius</label>
            </div>
        </section>

        <!-- figure:star -->
        <section class="mui-form--inline" v-if="figure === 'Star'">
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Star.segments" v-on:change="init()" >
                <label>Segments</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Star.outerRadius" v-on:change="init()" >
                <label>outer Radius</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Star.innerRadius" v-on:change="init()" >
                <label>inner Radius</label>
            </div>
        </section>

        <!-- figure:cog -->
        <section class="mui-form--inline" v-if="figure === 'Cog'">
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Cog.segments" v-on:change="init()" >
                <label>Segments</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Cog.outerRadius" v-on:change="init()" >
                <label>outer Radius</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Cog.innerRadius" v-on:change="init()" >
                <label>inner Radius</label>
            </div>
        </section>

        <!-- figure:rectangle -->
        <section class="mui-form--inline"  v-if="figure === 'Rectangle'">
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Rectangle.width" v-on:change="init()" >
                <label>Width</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.Rectangle.height" v-on:change="init()" >
                <label>Height</label>
            </div>
        </section>

        <!-- colors, stroke -->
        <section class="mui-form--inline" v-if="state.fill.form">
            <legend>Background</legend>
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
            <div v-if="state.fill.edit">
                <color-picker :targ="'fillStyle'" :rgba="state.canvas.fillStyle"></color-picker>
            </div>
        </section>

        <!-- colors, stroke -->
        <section class="mui-form--inline">
            <legend>Stroke</legend>
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

            <div v-if="state.stroke.edit">
                <div  class="mui-panel">
                    <div class="mui-textfield">
                        <input type="text" v-model.number="state.canvas.lineWidth" v-on:change="init()" >
                        <label>Width</label>
                    </div>
                </div>
                <color-picker :targ="'strokeStyle'" :rgba="state.canvas.strokeStyle"></color-picker>
            </div>
        </section>

        <!-- translate -->
        <section class="mui-form--inline">
            <legend>Translate</legend>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.tanslate[0]" v-on:change="init()" >
                <label>X</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.tanslate[1]" v-on:change="init()" >
                <label>Y</label>
            </div>
        </section>

        <!-- scale-->
        <section class="mui-form--inline">
            <legend>Scale</legend>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.scale[0]" v-on:change="init()" >
                <label>X</label>
            </div>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.scale[1]" v-on:change="init()" >
                <label>Y</label>
            </div>
        </section>

        <!-- rotate-->
        <section class="mui-form--inline">
            <legend>Rotate</legend>
            <div class="mui-textfield">
                <input type="text" v-model.number="state.rotate2D" v-on:change="init()" >
                <label>rad</label>
            </div>
        </section>

        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Canvas2dHelpers from '../Canvas2dHelpers';
import Utils from '../Utils';
import Routes from '../Routes';
import ColorPicker from '../Form/ColorPicker';
import Dev from '../Form/Dev';

import Space from '../../Space';

const compute = function (figure, state, canvas) {

    if (!state.origin) {
        state.origin = new Space.Point.Cartesian(canvas.width / 2, canvas.height / 2);
    }

    let fig;
    let segments;

    switch (figure) {

        case 'Path': {
            const margin = 100;
            segments = state.Path.segments;
            const x = (canvas.width - (2 * margin)) / segments;
            let y = canvas.height - (2 * margin);
            fig = new Space.Path();
            fig.add(margin, margin);
            while (segments > 0) {
                fig.progress(x, y);
                y = -y;
                segments -= 1;
            }
            break;
        }

        case 'Polygon': {
            fig = new Space.Polygon(state.Polygon.segments, state.Polygon.radius, state.origin);
            break;
        }

        case 'Rectangle': {
            fig = new Space.Rectangle(state.Rectangle.width, state.Rectangle.height, state.origin);
            break;
        }

        case 'Star': {
            fig = new Space.Star(state.Star.segments, state.Star.outerRadius, state.Star.innerRadius, state.origin);
            break;
        }

        case 'Cog': {
            fig = new Space.Cog(state.Cog.segments, state.Cog.outerRadius, state.Cog.innerRadius, state.origin);
            break;
        }

        default: {
            fig = null;
        }

    }

    //Figure or only Path
    const path = (typeof fig.path !== 'undefined') ? fig.path : fig;

    // translate
    const hasTranslate = state.tanslate.reduce((a, b) => {
        return a + b;
    });

    if (hasTranslate) {
        path.translate(state.tanslate[0], state.tanslate[1]);
    }

    // translate
    const hasScale = state.scale.reduce((a, b) => {
        return a * b;
    });

    // scale
    if (hasScale !== 1) {
        path.scale(state.scale[0], state.scale[1]);
    }

    // rotate 2d
    if (state.rotate2D) {
        path.rotate2D(Utils.radians(state.rotate2D));
    }

    return path;

};

const draw = function (figure, path, state, canvas) {
    canvas.ctx.save();
    // styles
    canvas.ctx.fillStyle = (state.fill.show && figure !== 'Path') ? state.canvas.fillStyle : 'transparent';
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;

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
    if (state.canvas.fillStyle) {
        canvas.ctx.fill();
    }
    canvas.ctx.stroke();

    // finish
    canvas.ctx.closePath();
    canvas.ctx.restore();

    //// helpers
    const length = path.points.length;
    let prev;
    let point;
    let i;

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showPoints) {
            Canvas2dHelpers.drawPoint(canvas.ctx, point, i + ':point', 'orange');
        }
        if (state.showPath) {
            Canvas2dHelpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Canvas2dHelpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
};

const defaults = {
    strokeStyle: 'rgba(255, 255, 255, 1)',
    fillStyle: 'rgba(255, 255, 255, 1)',
    lineWidth: 2
};

export default {
    name: 'Figures',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    watch: {
        '$route'(to) {
            this.figure = to.params.figure;
            this.state.canvas = this.appState.factor('canvas', defaults);
            this.init();
        }
    },
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
                    form: true,
                    show: true,
                    edit: false
                },
                stroke: {
                    show: true,
                    edit: false
                },
                // transform
                tanslate: [0, 0],
                scale: [1, 1],
                rotate2D: 0,
                // helpers
                showPoints: false,
                showPath: false,
                showBounds: false,
                // form defaults per figure
                Path: {
                    segments: 25
                },
                Polygon: {
                    segments: 6,
                    radius: 200
                },
                Star: {
                    segments: 5,
                    outerRadius: 200,
                    innerRadius: 70
                },
                Cog: {
                    segments: 5,
                    outerRadius: 200,
                    innerRadius: 125
                },
                Rectangle: {
                    width: 300,
                    height: 200
                }
            },
            figures: Routes.figures(),
            figure: (typeof this.$route.params.figure !== 'undefined') ? this.$route.params.figure : 'Path'
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
            this.initForms();
            //@TODO
            timeout = window.setTimeout(() => {
                const path = compute(this.figure, this.state, this.canvas.canvas);
                draw(this.figure, path, this.state, this.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },
        initForms: function () {
            this.state.fill.form = (this.figure !== 'Path');
        },
        goTo(figure) {
            this.$router.push({ name: this.$route.name, params: { figure: figure.name } });
        }
    }
};
</script>

<style>
</style>
