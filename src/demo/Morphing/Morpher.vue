<template>
    <div>

        <section>
            <!-- figures.src -->
            <div class="mui-dropdown">
                <button class="mui-btn mui-btn-small" data-mui-toggle="dropdown">
                    {{ (figures.src) ? figures.src : 'Choose' }}
                    <span class="mui-caret mui--text-accent"></span>
                </button>
                <ul class="mui-dropdown__menu">
                    <li
                        v-for="fig in figures.available"
                        v-bind:class="{'router-link-active': fig === figures.src}"
                    >
                        <a v-on:click="goTo(fig, figures.targ)">{{ fig }}</a>
                    </li>
                </ul>
            </div>
            <span>&nbsp;to&nbsp;</span>
            <!-- figures.targ -->
            <div class="mui-dropdown">
                <button class="mui-btn mui-btn-small" data-mui-toggle="dropdown">
                    {{ (figures.targ) ? figures.targ : 'Choose' }}
                    <span class="mui-caret mui--text-accent"></span>
                </button>
                <ul class="mui-dropdown__menu">
                    <li
                        v-for="fig in figures.available"
                        v-bind:class="{'router-link-active': fig === figures.targ}"
                    >
                        <a v-on:click="goTo(figures.src, fig)">{{ fig }}</a>
                    </li>
                </ul>
            </div>
        </section>

        <!-- morphing -->
        <section class="mui-form">
            <legend>Morphing</legend>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.continuous">
                    Continuous
                </label>
            </div>
        </section>

        <!-- params -->
        <section class="mui-form">
            <legend>Edit Params</legend>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.steps" min="10" max="300" step="10">
                <label>Steps <small>( {{(morpher) ? morpher.count : 0}} of {{ state.steps }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segments" min="3" max="150">
                <label>Segment Range <small>({{ state.segments }})</small></label>
            </div>
            <div class="mui-textfield">
                <button class="mui-btn mui-btn--small mui-btn--primary" v-on:click="create()">Create Morpher</button>
            </div>
        </section>

        <!-- helpers -->
        <section class="mui-form">
            <legend>Helpers</legend>
            <div class="mui-checkbox">
                <label>
                    <input type="checkbox" v-model="state.showHandles" v-on:change="init()"> Handles
                </label>
            </div>
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

        <!-- devel -->
        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Canvas2dHelpers from '../Canvas2dHelpers';
import Dev from '../Form/Dev.vue';
import Utils from '../Utils';

const Space = window.Space;

let paused; //holds timeout

const radius = function (canvas, margin) {
    margin = margin || 50;
    return (canvas.width < canvas.height) ? (canvas.width / 2) - margin : (canvas.height / 2) - 50;
};

const Figures = {

    available: ['Line', 'Polygon', 'Star', 'Cog', 'Flower', 'Random'],

    create: function (type, state, canvas) {

        //TODO
        let figure;
        let segments;

        switch (type) {
            case 'Line': {
                segments = state.segments;
                const from = new Space.Point.Cartesian(0, canvas.height / 2);
                const to = new Space.Point.Cartesian(canvas.width, canvas.height / 2);
                figure = new Space.Line(from, to, segments); //TODO solve -1 inside morpher or line.segmentize
                break;
            }
            case 'Polygon': {
                segments = state.segments;
                figure = new Space.Polygon(segments, radius(canvas), state.origin);
                break;
            }
            case 'Star': {
                segments = state.segments / 2;
                figure = new Space.Star(segments, radius(canvas), 50, state.origin);
                break;
            }
            case 'Cog': {
                segments = state.segments / 4;
                figure = new Space.Cog(segments, radius(canvas), 50, state.origin);
                break;
            }
            case 'Flower': {
                segments = state.segments / 2;
                figure = new Space.Star(segments, radius(canvas), 50, state.origin);
                figure.flower(0.5);
                break;
            }
            case 'Random': {
                segments = state.segments;
                const path = new Space.Path();
                const range = 200;
                let rand;

                path.add(new Space.Group(canvas.width / 2, canvas.height / 2));
                for (let i = 0; i < segments; i += 1) {
                    rand = new Space.Point.Cartesian(
                        Utils.randInt(-range, range) * Utils.randInt(),
                        Utils.randInt(-range, range) * Utils.randInt()
                    );
                    rand.add(path.last());
                    rand.x = Utils.bounds(rand.x, 0, canvas.width);
                    rand.y = Utils.bounds(rand.y, 0, canvas.height);
                    path.add(rand);
                }
                path.close();
                Space.Bezier.smoothPath(path, 0.5);
                figure = { path: path }; //TODO
                break;
            }
            default:
                // nothing
        }
        return figure;
    }

};

const compute = function (morpher, state) {

    const finished = morpher.finished();

    if (finished && !state.continuous) {
        return;
    }

    if (finished) {
        state.continuous = false;

        paused = setTimeout(() => {
            morpher.reverse();
            state.continuous = true;

            clearTimeout(paused);
        }, 1000);

        return;
    }

    morpher.progress();
};

const draw = function (path, state, canvas) {
    //canvas.clear();

    canvas.ctx.save();
    canvas.ctx.strokeStyle = state.canvas.strokeStyle;
    canvas.ctx.lineWidth = state.canvas.lineWidth;
    canvas.ctx.fillStyle = state.canvas.fillStyle;

    const length = path.points.length;
    let prev;
    let point;
    let i;

    //// curve
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(path.first().x, path.first().y);
    for (i = 1; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);
        Canvas2dHelpers.bezierLine(canvas.ctx, prev, point);
    }
    canvas.ctx.fill();
    canvas.ctx.stroke();
    canvas.ctx.restore();
    //// helpers

    for (i = 0; i < length; i += 1) {
        prev = path.prev(i);
        point = path.get(i);

        if (state.showHandles) {
            if (point.members !== undefined && point.members.length > 1) {
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[0], i + ':left', 'red');
                Canvas2dHelpers.drawHandle(canvas.ctx, point, point.members[1], i + ':right', 'blue');
            }
        }

        if (state.showPoints) {
            Canvas2dHelpers.drawPoint(canvas.ctx, point, i + ':point', '#666666');
        }
        if (state.showPath) {
            Canvas2dHelpers.drawLine(canvas.ctx, prev, point, '#666666');
        }
        if (state.showBounds) {
            Canvas2dHelpers.drawBoundingBox(canvas.ctx, path, 'yellow');
        }
    }
    canvas.ctx.restore();
};

export default {
    name: 'Home',
    props: [
        'animation',
        'appState',
        'canvas'
    ],
    data: function () {
        return {
            state: {
                prev: {
                    figures: {}
                },
                origin: null,
                canvas: this.appState.factor('canvas', {
                    strokeStyle: 'white',
                    lineWidth: 1
                }),
                segments: 12,
                steps: 100,
                //behaviour
                continuous: true
            },
            path: null,
            figures: {
                src: (typeof this.$route.params.src !== 'undefined') ? this.$route.params.src : 'Polygon',
                targ: (typeof this.$route.params.targ !== 'undefined') ? this.$route.params.targ : 'Star',
                available: Figures.available
            },
            morpher: null,

        };
    },
    methods: {
        init: function () {
            this.state.origin = new Space.Point.Cartesian(this.canvas.canvas.width / 2, this.canvas.canvas.height / 2);
        },
        create: function () {
            if (Figures.available.indexOf(this.figures.src) === -1) {
                throw new Error('Morpher component: Source figure of type "' + this.figures.src + '" not recognized.');
            }
            if (Figures.available.indexOf(this.figures.targ) === -1) {
                throw new Error('Morpher component: Target figure of type "' + this.figures.targ + '" not recognized.');
            }

            const targFigure = Figures.create(this.figures.targ, this.state, this.canvas.canvas);
            const srcFigure = Figures.create(this.figures.src, this.state, this.canvas.canvas);
            this.path = srcFigure.path;
            this.morpher = new Space.Morpher(srcFigure.path, targFigure.path, this.state.steps);
        },
        goTo(src, targ) {
            this.$router.push({
                name: this.$route.name,
                params: {
                    src: src,
                    targ: targ
                }
            });
        }
    },
    components: {
        Dev
    },
    watch: {
        '$route'(to) {
            this.figures.src = to.params.src;
            this.figures.targ = to.params.targ;
            this.create();
        }
    },
    mounted() {
        this.canvas.fill();
        this.animation
        //.fps(32)
        .only(() => {
            if (!this.state.origin) {
                this.init();
                this.create();
                return;
            }

            compute(this.morpher, this.state);
            draw(this.morpher.src, this.state, this.canvas);
            // init
            this.canvas.fill();

        })
        .play()
        ;
    }
};
</script>

<style>
</style>
