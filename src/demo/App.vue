<template>
    <div>
        <header class="mui-appbar mui--z1">
            <div class="mui-container">
                <table width="100%">
                    <tr class="mui--appbar-height">
                        <td class="mui--text-title">Brand.io</td>
                        <td align="right">
                            <ul class="mui-list--inline mui--text-body2">
                                <li><router-link to="/Path">Path</router-link></li>
                                <li><router-link to="/Polygon">Polygon</router-link></li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
        </header>

        <div id="content" class="mui-container-fluid">
            <div class="mui-row">

                <div class="mui-col-md-8 app--canvas">
                </div>

                <div class="mui-col-md-4">

                     <form class="mui-form">
                        <div class="mui-textfield">
                            <pre>count {{animation.count}}</pre>
                        </div>
                        <div class="mui-textfield">
                            <button v-on:click="animation.toggle()" class="mui-btn mui-btn--small mui-btn--primary">{{ (animation.running) ? 'Pause' : 'Run' }}</button>
                        </div>
                        <div class="mui-checkbox">
                            <label><input type="checkbox" v-on:click="throttle(animation.interval < 0 ? 3 : -1)"> Throttle animation</label>
                        </div>
                        <div class="mui-panel" v-if="animation.interval > 1">
                            <div class="mui-textfield" style="">
                                <input type="range" v-on:change="throttle($event.target.value)" min="0" max="100">
                                <label>fps <small>({{ 1000 / animation.interval }})</small></label>
                            </div>
                        </div>
                    </form>

                    <router-view class="view"
                        :states="states"
                        :animation="animation"
                        :canvas="canvas"
                    ></router-view>

                <div>

            </div>
        </div>
    </div>
</template>

<script>
import Path from './components/Path.vue';

export default {
    name: 'app',
    props: ['animation', 'states', 'canvas'],
    components: {
        Path
    },
    mounted() {
        this.$el.querySelector('.app--canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = this.states.canvas.width;
        this.canvas.canvas.height = this.states.canvas.height;
        this.canvas.ctx.fillStyle = this.states.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.states.canvas.lineWidth;
    },
    methods: {
        throttle: function (value) {
            if(value === null){
                return;
            }
            value = parseInt(value, 10);
            console.log(value);
            if(!isNaN(value)){
                this.animation.fps(value);
            }
        }
    }
};
</script>

<style>

</style>
