import Home from './components/Home.vue';
import Path from './components/Path.vue';
import Polygon from './components/Polygon.vue';
import Rectangle from './components/Rectangle.vue';
import Star from './components/Star.vue';

const Routes = [
    {
        name: 'Home',
        path: '/',
        component: Home
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

export default Routes;
