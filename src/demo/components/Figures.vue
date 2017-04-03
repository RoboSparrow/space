<template>
    <div>
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
        <p></p>
        <form class="mui-form--inline">

            <section v-if="figure === 'Path'">
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.Path.segments" v-on:change="init()" >
                    <label>Segments <small>({{ state.Path.segments }})</small></label>
                </div>
            </section>

            <section v-if="figure === 'Polygon'">
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.Polygon.segments" v-on:change="init()" >
                    <label>Segments</label>
                </div>
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.Polygon.radius" v-on:change="init()" >
                    <label>Radius</label>
                </div>
            </section>

            <section v-if="figure === 'Star'">
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

            <section v-if="figure === 'Rectangle'">
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.Rectangle.width" v-on:change="init()" >
                    <label>Width</label>
                </div>
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.Rectangle.height" v-on:change="init()" >
                    <label>Height</label>
                </div>
            </section>

            <section>
                <div class="mui-checkbox">
                    <label>
                        <input type="checkbox" v-model="state.fill" v-on:change="init()" > Fill
                    </label>
                </div>
                <div class="mui-checkbox">
                    <label>
                        <input type="checkbox" v-model="state.stroke" v-on:change="init()" > Stroke
                    </label>
                </div>
            </section>

            <section>
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.tanslate[0]" v-on:change="init()" >
                    <label>X</label>
                </div>
                <div class="mui-textfield">
                    <input type="text" v-model.number="state.tanslate[1]" v-on:change="init()" >
                    <label>Y</label>
                </div>
            </section>

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
    let segments;

    switch (figure) {

        case 'Path': {
            const margin = 100;
            segments = state.Path.segments;
            const x = (canvas.width - (2 * margin)) / segments;
            let y = canvas.height - (2 * margin);
            fig = new Space.Path(margin, margin);
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

        default: {
            fig = null;
        }

    }
    // translate
    const hasTranslate = state.tanslate.reduce((a, b) => {
        return a + b;
    });
    console.log(fig.path);
    if (hasTranslate) {
        fig.path.translate(state.tanslate[0], state.tanslate[1]);
    }

    return (typeof fig.path !== 'undefined') ? fig.path : fig;

};

const draw = function (figure, path, state, canvas) {
    canvas.ctx.save();
    // styles
    canvas.ctx.fillStyle = (state.fill && figure !== 'Path') ? state.canvas.fillStyle : null;
    canvas.ctx.strokeStyle = (state.stroke) ? state.canvas.strokeStyle : null;
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
            this.init();
        }
    },
    data: function () {
        return {
            state: {
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'rgba(255, 255, 255, 1)',
                    fillStyle: 'rgba(255, 255, 255, 1)',
                    lineWidth: 2
                }),
                fill: true,
                stroke: true,
                tanslate: [0, 0],
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
                Rectangle: {
                    width: 300,
                    height: 200
                }
            },
            figures: Routes.figures(),
            figure: (typeof this.$route.params.figure !== 'undefined') ? this.$route.params.figure : 'Path'
        };
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
            timeout = window.setTimeout(() => {
                const path = compute(this.figure, this.state, this.canvas.canvas);
                draw(this.figure, path, this.state, this.canvas);
                window.clearTimeout(timeout);
            }, 100);
        },
        goTo(figure) {
            this.$router.push({ name: 'Figure', params: { figure: figure.name } });
        }
    }
};
</script>

<style>
</style>
