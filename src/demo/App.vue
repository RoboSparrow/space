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
                            <span>count {{animation.count}}</span>
                        </div>
                        <div class="mui-textfield">
                            <button v-on:click="animation.toggle()" class="mui-btn mui-btn--small mui-btn--primary">{{ (animation.running) ? 'Pause' : 'Run' }}</button>
                        </div>
                        <div class="mui-textfield">
                            <input type="range" v-on:change="setFps" min="0" max="500">
                            <label>fps <small>({{ 1000 / animation.interval }})</small></label>
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
        setFps: function (e) {
            // @TODO: improve this crap algo
            let fps = parseInt(e.target.value, 10);
            if (isNaN(fps)) {
                e.target.classList.add('error');
                return;
            }
            
            e.target.classList.remove('error');
            if(fps >= 100){
                fps = -1;
            }
     
            this.animation.fps(fps);
        }
    }
};
</script>

<style>

</style>
