<template>
    <div>
        <header id="header">
            <div class="mui-appbar mui--appbar-line-height mui--z1">
                <div class="mui-container-fluid">
                    <table width="100%">
                        <tr class="mui--appbar-height">
                            <td>
                                <span class="app--brand mui--text-title">Brand.io</span>
                                <router-link to="/Path" class="mui-btn mui-btn--raised">Path</router-link>
                                <router-link to="/Polygon" class="mui-btn mui-btn--raised">Polygon</router-link>
                            </td>
                            <td class="mui--text-title">
                                <a class="mui--pull-right" v-on:click="sidebar = !sidebar"><i class="material-icons mui--text-display1">settings</i></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </header>

        <footer id="footer">
            <div class="app--footer-content mui-container-fluid mui--align-middle">
                Made with <a href="https://vuejs.org/">Vue</a> & <a href="https://www.muicss.com">MUI</a>
            </div>
        </footer>

        <aside id="sidebar" class="mui-panel" v-bind:class="{'visible': sidebar}">

            <div class="mui--appbar-line-height">
                <span class="mui--text-title">Brand.io</span>
            </div>
            <div class="mui-divider"></div>

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

       </aside>

        <main id="content" class="mui-container-fluid">
            <div class="mui-row">
                <div class="mui-col-md-12 app--canvas"></div>
            </div>
        </main>
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
        this.canvas.canvas.width = document.body.clientWidth;
        this.canvas.canvas.height = document.body.clientHeight;
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
    },
    data() {
        return {
            sidebar: true
        }
    }
};
</script>

<style>
body{
    background-color: black;
}
</style>
