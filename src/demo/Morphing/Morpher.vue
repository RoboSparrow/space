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
                                        <a v-on:click="function () { figures.src = fig; }">{{ fig }}</a>
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
                                        <a v-on:click="function () { figures.targ = fig; }">{{ fig }}</a>
                                    </li>
                                </ul>
                            </div>
        </section>

        <section class="mui-form">
            <legend>Edit Params</legend>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.steps" min="10" max="1000" step="10">
                <label>Steps <small>( {{(morpher) ? morpher.count : 0}} of {{ state.steps }})</small></label>
            </div>
            <div class="mui-textfield">
                <input type="range" v-model.number="state.segments" min="3" max="50">
                <label>Segment Range <small>({{ state.segments }})</small></label>
            </div>
            <div class="mui-textfield">
                <button class="mui-btn mui-btn--small mui-btn--primary" v-on:click="create()">Create Morpher</button>
            </div>
        </section>

        <!-- devel -->
        <dev :label="'State'" :data="state"></dev>
    </div>
</template>

<script>
import Canvas2dHelpers from '../Canvas2dHelpers';

const Space = window.Space;

const radius = function (state, margin) {
    margin = margin || 50;
    return (state.canvas.width < state.canvas.height) ? (state.canvas.width / 2) - margin : (state.canvas.height / 2) - 50;
};

const Figures = {

    available: ['Line', 'Polygon', 'Star', 'Cog'],

    create: function (type, state, reference) {

        const segments = (reference !== undefined) ? reference.path.length() : state.segments;
        let figure;

        switch (type) {
            case 'Line': {
                const from = new Space.Point.Cartesian(0, state.canvas.height / 2);
                const to = new Space.Point.Cartesian(state.canvas.width, state.canvas.height / 2);
                figure = new Space.Line(from, to, segments);
                break;
            }
            case 'Polygon': {
                figure = new Space.Polygon(segments, radius(state), state.origin);
                break;
            }
            case 'Star': {
                figure = new Space.Star(segments, radius(state), 50, state.origin);
                break;
            }
            case 'Cog': {
                figure = new Space.Cog(segments, radius(state), 50, state.origin);
                break;
            }
            default:
                // nothing
        }
        return figure;
    }

};

const compute = function (morpher) {
    if (morpher.finished()) {
        morpher.reverse();
    }
    morpher.progress();
};

const draw = function (path, state, canvas) {

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
                segments: 6,
                steps: 100
            },
            path: null,
            figures: {
                src: (typeof this.$route.params.srcFigure !== 'undefined') ? this.$route.params.srcFigure : 'Polygon',
                targ: (typeof this.$route.params.targFigure !== 'undefined') ? this.$route.params.targFigure : 'Star',
                available: Figures.available
            },
            morpher: null
        };
    },
    methods: {
        init: function () {
            this.state.origin = new Space.Point.Cartesian(this.state.canvas.width / 2, this.state.canvas.height / 2);
        },
        create: function () {
            if (Figures.available.indexOf(this.figures.src) === -1) {
                throw new Error('Morpher component: Source figure of type "' + this.figures.src + '" not recognized.');
            }
            if (Figures.available.indexOf(this.figures.targ) === -1) {
                throw new Error('Morpher component: Target figure of type "' + this.figures.targ + '" not recognized.');
            }

            const targFigure = Figures.create(this.figures.targ, this.state);
            const srcFigure = Figures.create(this.figures.src, this.state, targFigure);
            this.path = srcFigure.path;
            this.morpher = new Space.Morpher(srcFigure.path, targFigure.path, this.state.steps);
        }
    },
    mounted() {
        this.canvas.fill();

        this.animation
        .fps(32)
        .only(() => {
            // @TODO
            if (!this.state.origin) {
                this.init();
                this.create();
                return;
            }

            compute(this.morpher);
            draw(this.path, this.state, this.canvas);
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
