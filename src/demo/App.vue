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
                <div class="mui-col-sm-10 mui-col-sm-offset-1">
                    <span>{{animation.count}}</span>
                    <router-view
                        class="view"
                        :states="states"
                        :animation="animation"
                        :canvas="canvas"
                    ></router-view>
                    <div class="canvas">
                    </div>
                </div>
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
        this.$el.querySelector('.canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = this.states.canvas.width;
        this.canvas.canvas.height = this.states.canvas.height;
        this.canvas.ctx.fillStyle = this.states.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.states.canvas.lineWidth;
    }
};

</script>

<style>
</style>
