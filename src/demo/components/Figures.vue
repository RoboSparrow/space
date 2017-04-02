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
        <form class="mui-form">
            
            <section v-if="figure === 'Path'">
                <div class="mui-textfield">
                    <input type="range" v-model.number="state.Path.segments" v-on:change="init()" min="1" max="100">
                    <label>Segments <small>({{ state.Path.segments }})</small></label>
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
            fig = new Space.Polygon(6, 200, state.origin);
            break;
        }

        case 'Rectangle': {
            fig = new Space.Rectangle(400, 100, state.origin);
            break;
        }

        case 'Star': {
            fig = new Space.Star(5, 200, 78, state.origin);
            break;
        }

        default: {
            fig = null;
        }

    }

    return (typeof fig.path !== 'undefined') ? fig.path : fig;

};

const draw = function (figure, path, state, canvas) {
    canvas.ctx.save();
    // styles
    canvas.ctx.fillStyle = (figure !== 'Path') ? state.canvas.fillStyle : null;
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
                Path: {
                    segments: 25
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
