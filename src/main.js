import Vue from 'vue';
import VueRouter from 'vue-router';

import '../node_modules/muicss/dist/js/mui';//TODO, commonjs or write custom componenet?

// rollup-plugin-scss
//import './main.scss';

import Animation from './Page/Animation';
import Canvas2d from './Page/Canvas2d';
import State from './Page/State';
import Routes from './Page/Routes';

import App from './Page/App';

const animation = new Animation();
const canvas = new Canvas2d();

// Create the router
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'hash', //'history',
    routes: Routes.routes
});

// 4. Create and mount root instance.
// Make sure to inject the router.
new Vue({
    router,
    data: {
        animation,
        appState: State,
        canvas,
        routes: Routes.menu()
    },
    components: {
        App
    },
    //render: h => h(App)
    template: '<App :app-state="appState" :animation="animation" :canvas="canvas" :routes="routes"/>',
}).$mount('#app');
