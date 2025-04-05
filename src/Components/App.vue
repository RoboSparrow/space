<style src="./main.scss" lang="scss"></style>

<template>
    <div>
        <header id="header">
            <div class="mui-appbar mui--appbar-line-height mui--z1">
                <div class="mui-container-fluid">
                    <table width="100%">
                        <tr class="mui--appbar-height">
                            <td class="mui--text-title">

                                <ul class="mui-list--inline mui--text-body2">
                                    <!-- brand -->
                                    <li class="mui--align-middle">
                                        <a class="app--icon mui--text-display1" href="/#/Home">
                                            <home-icon />
                                        </a>
                                    </li>
                                    <!-- menus -->
                                    <li
                                        v-for="(menu, name) in menus"
                                        v-if="name !== 'Home'"
                                    >
                                        <div v-if="menu.length === 1" class="mui-dropdown">
                                            <button
                                                class="mui-btn mui-btn--small"
                                                v-on:click="goTo(menu[0])">
                                                {{ menu[0].name }}
                                            </button>
                                        </div>

                                        <div v-if="menu.length > 1" class="mui-dropdown">
                                            <button class="mui-btn mui-btn--small" data-mui-toggle="dropdown">
                                                {{ name }} <span class="mui-caret mui--text-accent"></span>
                                            </button>

                                            <ul class="mui-dropdown__menu">
                                                <li
                                                    v-for="route in menu"
                                                    v-if="route.name"
                                                    v-bind:class="{'router-link-active': $route.name === route.name}"
                                                >
                                                    <a v-on:click="goTo(route)">{{ route.name }}</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>

                            </td>
                            <td class="mui--text-right">
                                <ul class="mui-list--inline mui--text-body2">
                                    <!-- settings sidebar -->
                                    <li class="mui--align-middle app--sidebar-trigger">
                                        <a class="app--icon mui--text-display1" v-on:click="toggle()">
                                            <cog-icon />
                                        </a>
                                    </li>
                                </ul>
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

            <animation :animation="animation"></animation>

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
import Animation from './Form/Animation.vue';

// @see https://pictogrammers.com/library/mdi/
import HomeIcon from 'vue-material-design-icons/Home.vue';
import CogIcon from 'vue-material-design-icons/Cog.vue';

export default {
    name: 'app',
    props: ['animation', 'appState', 'canvas', 'routes', 'menus'],
    components: {
        Animation,
        HomeIcon,
        CogIcon,
    },
    mounted() {
        this.sidebar = document.getElementById('sidebar');

        this.$el.querySelector('.app--canvas').appendChild(this.canvas.canvas);
        this.canvas.canvas.width = document.body.clientWidth;
        this.canvas.canvas.height = document.body.clientHeight;
        this.canvas.ctx.fillStyle = this.appState.canvas.fillStyle;
        this.canvas.ctx.lineWidth = this.appState.canvas.lineWidth;
    },
    methods: {
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
    data: function () {
        return {
            sidebar: null,
        };
    }
};
</script>

<style>
</style>
