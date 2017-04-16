import Home from './components/Home.vue';
import Path from './components/Path.vue';
import BezierPath from './Figures/BezierPath.vue';
import Polygon from './components/Polygon.vue';
import Rectangle from './components/Rectangle.vue';
import Star from './components/Star.vue';
import Figures from './components/Figures.vue';

const routes = [
    {
        name: '',
        path: '/',
        component: Path,
        meta: {
            menu: false,
            figure: false
        }
    },
    {
        name: 'Home',
        path: '/Home',
        component: Home,
        meta: {
            menu: false,
            figure: false
        }
    },
    {
        name: 'Path',
        path: '/Path',
        component: Path,
        meta: {
            menu: true,
            figure: true
        }
    },
    {
        name: 'Polygon',
        path: '/Polygon',
        component: Polygon,
        meta: {
            menu: true,
            figure: true
        }
    },
    {
        name: 'Rectangle',
        path: '/Rectangle',
        component: Rectangle,
        meta: {
            menu: true,
            figure: true
        }
    },
    {
        name: 'Star',
        path: '/Star',
        component: Star,
        meta: {
            menu: true,
            figure: true
        }
    },
    {
        name: 'Figures',
        path: '/Figures',
        component: Figures,
        meta: {
            menu: true,
            figure: false
        }
    },
    {
        name: 'Bezier', // 'BezierPath'
        path: '/BezierPath', // '/Figures/BezierPath',
        component: BezierPath,
        meta: {
            menu: true,
            figure: false
        }
    },
    {
        name: 'Figure',
        path: '/Figures/:figure',
        component: Figures,
        meta: {
            menu: false,
            figure: false
        }
    },
    // catch all redirect
    {
        name: '',
        path: '*',
        redirect: '/',
        meta: {
            menu: false,
            figure: false
        }
    }
];

const figures = function () {
    return routes.filter((item) => {
        return item.meta.figure;
    });
};

const menu = function () {
    return routes
    .filter((item) => {
        return item.meta.menu;
    })
    .map((item) => {
        return {
            name: item.name,
            path: item.path,
            meta: item.meta || {}
        };
    });
};

const byName = function (name) {
    let i;
    for (i = 1; i < routes.length; i += 1) {
        if (routes[i].name === name) {
            return routes[i];
        }
    }
    return null;
};

export default {
    routes: routes,
    figures: figures,
    menu: menu,
    byName: byName
};
