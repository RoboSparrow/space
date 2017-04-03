<template>
    <div>
        <header id="header">
            <div class="mui-appbar mui--appbar-line-height mui--z1">
                <div class="mui-container-fluid">
                    <table width="100%">
                        <tr class="mui--appbar-height">
                            <td>
                                <span class="app--brand"></span>
                                <div class="mui-dropdown">
                                    <button class="mui-btn mui-btn-small" data-mui-toggle="dropdown">
                                        Space <span class="mui--text-accent">/</span> {{ $route.name }}
                                        <span class="mui-caret mui--text-accent"></span>
                                    </button>
                                    <ul class="mui-dropdown__menu">
                                        <li
                                            v-for="route in routes"
                                            v-if="route.name"
                                            v-bind:class="{'router-link-active': $route.name === route.name}"
                                        >
                                            <a v-on:click="goTo(route)">{{ route.name }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <a class="app--sidebar-trigger mui--pull-right mui--text-display1" v-on:click="toggle()"><i class="zmdi zmdi-settings"></i></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </header>

        <footer id="footer">
            <div class="app--footer-content mui-container-fluid mui--align-middle">
                Demo made with <a href="https://vuejs.org/">Vue</a> & <a href="https://www.muicss.com">MUI</a>
            </div>
        </footer>

        <aside id="sidebar" class="mui-panel" v-bind:class="{'visible': sidebar}">

            <div v-if="$route.name" class="mui--appbar-line-height">
                <span class="mui--text-title">{{ $route.name }}</span>
            </div>
            <div class="mui-divider"></div>

            <form v-if="animation.id" class="mui-form">
               <div class="mui-textfield">
                   <pre>count {{animation.count}}</pre>
               </div>
               <div class="mui-textfield">
                   <button v-on:click="animation.toggle()" class="mui-btn mui-btn--small mui-btn--primary">{{ (animation.running) ? 'Pause' : 'Run' }}</button>
               </div>
               <div class="mui-checkbox">
                   <label><input type="checkbox" v-model="throttlePanel" v-on:click="throttle(animation.interval < 0 ? 3 : -1)"> Throttle animation</label>
               </div>
               <div class="mui-panel" v-if="throttlePanel">
                   <div class="mui-textfield" style="">
                       <input type="range" v-on:change="throttle($event.target.value)" min="0" max="100">
                       <label>fps <small>({{ 1000 / animation.interval }})</small></label>
                   </div>
               </div>
           </form>

           <router-view class="view"
               :app-state="appState"
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
export default {
    name: 'app',
    props: ['animation', 'appState', 'canvas', 'routes'],
    mounted() {
        this.sidebar = document.getElementById('sidebar');

        this.$el.querySelector('.app--canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = document.body.clientWidth;
        this.canvas.canvas.height = document.body.clientHeight;
        this.canvas.ctx.fillStyle = this.appState.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.appState.canvas.lineWidth;
    },
    methods: {
        throttle: function (value) {
            if (value === null) {
                return;
            }
            value = parseInt(value, 10);
            if (!isNaN(value)) {
                this.animation.fps(value);
            }
        },
        goTo: function (route) {
            const to = (route.path.indexOf('/:') > -1) ? { name: route.name, params: {} } : route.path;
            this.$router.push(to);
        },
        toggle: function () {
            if (!this.sidebar) {
                return;
            }
            let right = (this.sidebar.style.right) ? this.sidebar.style.right : window.getComputedStyle(this.sidebar).getPropertyValue('right');
            right = parseInt(right, 10);
            this.sidebar.style.right = ((right < 0) ? 0 : -this.sidebar.clientWidth) + 'px';
        }
    },
    data() {
        return {
            sidebar: null,
            throttlePanel: 0
        };
    }
};
</script>

<style>
</style>
