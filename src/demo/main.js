import Vue from 'vue';
import VueRouter from 'vue-router';
// import Space from '../Space';

// rollup-plugin-scss
import './main.scss';

import Animation from './Animation';
import Canvas2d from './Canvas2d';
import State from './State';
import Routes from './Routes';

import App from './App.vue';

const animation = new Animation();
const canvas = new Canvas2d();

// Create the router
const router = new VueRouter({
    mode: 'hash', //'history',
    routes: Routes
});

// 4. Create and mount root instance.
// Make sure to inject the router.
new Vue({
    router,
    data: {
        animation,
        appState: State,
        canvas,
        routes: Routes.map((item) => {
            return {
                name: item.name,
                path: item.path
            };
        })
    },
    components: {
        App
    },
    //render: h => h(App)
    template: '<App :app-state="appState" :animation="animation" :canvas="canvas" :routes="routes"/>',
}).$mount('#app');
