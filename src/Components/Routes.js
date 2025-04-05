// landing views
import Home from './Home.vue';
import BezierPath from './Figures/BezierPath.vue';
import Figures from './Figures/Figures.vue';
// single views
import Path from './Paths/Path.vue';
import Polygon from './Paths/Polygon.vue';
import Rectangle from './Paths/Rectangle.vue';
import Star from './Paths/Star.vue';
import Cog from './Paths/Cog.vue';
import Bezier from './BezierPaths/Bezier.vue';
import Morpher from './Morphing/Morpher.vue';

const routes = [
    {
        name: '',
        path: '/',
        component: Path,
    },
    {
        name: 'Home',
        path: '/Home',
        component: Home,
    },
    {
        name: 'Polygon',
        path: '/Shapes/Polygon',
        component: Polygon,
    },
    {
        name: 'Rectangle',
        path: '/Shapes/Rectangle',
        component: Rectangle,
    },
    {
        name: 'Star',
        path: '/Shapes/Star',
        component: Star,
    },
    {
        name: 'Cog',
        path: '/Shapes/Cog',
        component: Cog,
    },
    {
        name: 'Path',
        path: '/Paths/Path',
        component: Path,
    },
    {
        name: 'Bezier',
        path: '/Paths/Bezier',
        component: Bezier,
    },
    {
        name: 'BezierPaths',
        path: '/Paths/:figure?',
        component: BezierPath,
    },
    {
        name: 'Figures',
        path: '/Figures/:figure?',
        component: Figures,
    },
    {
        name: 'Morph',
        path: '/Morph/:src?/:targ?',
        component: Morpher,
    },
    // catch all redirect
    {
        name: '',
        path: '*',
        redirect: '/',
    }
];

const named = function () {
    return routes
    .filter((item) => {
        // exclude all paths without a name
        return !!item.name;
    });;
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

const menu = function (parent) {
    return routes
    .filter((item) => {
        return item.path.startsWith(parent);
    });
};

const menus = function () {
    const ms = {};

    named().forEach((item) => {
        const parts = item.path.split('/');

        if (parts.length < 2) {
            return;
        }

        if (typeof ms[parts[1]] !== 'undefined') {
            return;
        }

        ms[parts[1]] = menu('/' + parts[1]);
    });

    return ms;
};

export default {
    routes,
    named,
    byName,
    menus,
    menu,
};
