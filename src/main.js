import Vue from 'vue';
import VueRouter from 'vue-router';

import '../node_modules/muicss/dist/css/mui.css';

// import sass from 'sass';
// const result = sass.compile('./Components/main.scss');

import Animation from './Components/Animation';
import Canvas2d from './Components/Canvas2d';
import State from './Components/State';
import Routes from './Components/Routes';

import App from './Components/App.vue';

const animation = new Animation();
const canvas = new Canvas2d(); //

// Create the router
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'hash', //'history',
    routes: Routes.routes
});

const data = {
      animation,
      appState: State,
      canvas,
      routes: Routes.menu()
  };

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
    render: h => h(App, { props: data })
    // template: '<App :app-state="appState" :animation="animation" :canvas="canvas" :routes="routes"/>',
}).$mount('#app');
