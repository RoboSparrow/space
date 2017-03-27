import Vue from 'vue';
import VueRouter from 'vue-router';
// import Space from '../Space';

// rollup-plugin-scss
import './main.scss';

import Animation from './Animation';
import Canvas2d from './Canvas2d';

import Path from './components/Path.vue';
import App from './App.vue';

const animation = new Animation();
const canvas = new Canvas2d();

const states = {
    canvas: {
        width: 500,
        height: 500,
        strokeStyle: 'hsla(300, 100%, 75%, 1)',
        fillStyle: 'rgba(0, 0, 0, .08)',
        lineWidth: 0.1
    }
};

// Create the router
const router = new VueRouter({
    mode: 'hash', //'history',
    routes: [
        {
            path: '/Path',
            component: Path
        }
    ]
});

// 4. Create and mount root instance.
// Make sure to inject the router.
new Vue({
    router,
    data: {
        animation,
        states,
        canvas
    },
    components: {
        App
    },
    //render: h => h(App)
    template: '<App :states="states" :animation="animation" :canvas="canvas" />',
}).$mount('#app');
