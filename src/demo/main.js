import Vue from 'vue';
import VueRouter from 'vue-router';
// import Space from '../Space';

// rollup-plugin-scss
import './main.scss';

import Animation from './Animation';
import Canvas2d from './Canvas2d';

import Path from './components/Path.vue';
import Polygon from './components/Polygon.vue';
import Rectangle from './components/Rectangle.vue';
import Star from './components/Star.vue';
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

const routes = [
    {
        name: 'Home',
        path: '/',
        component: Path
    },
    {
        name: 'Path',
        path: '/Path',
        component: Path
    },
    {
        name: 'Polygon',
        path: '/Polygon',
        component: Polygon
    },
    {
        name: 'Rectangle',
        path: '/Rectangle',
        component: Rectangle
    },
    {
        name: 'Star',
        path: '/Star',
        component: Star
    },
    // catch all redirect
    {
        name: '',
        path: '*',
        redirect: '/'
    }
];

// Create the router
const router = new VueRouter({
    mode: 'hash', //'history',
    routes: routes
});

// 4. Create and mount root instance.
// Make sure to inject the router.
new Vue({
    router,
    data: {
        animation,
        states,
        canvas,
        routes: routes
    },
    components: {
        App
    },
    //render: h => h(App)
    template: '<App :states="states" :animation="animation" :canvas="canvas" :routes="routes"/>',
}).$mount('#app');
