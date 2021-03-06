// landing views
import Home from './Home';
import BezierPath from './Figures/BezierPath';
import Figures from './Figures/Figures';
// single views
import Path from './Paths/Path';
import Polygon from './Paths/Polygon';
import Rectangle from './Paths/Rectangle';
import Star from './Paths/Star';
import Cog from './Paths/Cog';
import Bezier from './BezierPaths/Bezier';
import Morpher from './Morphing/Morpher';

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
        name: 'Cog',
        path: '/Cog',
        component: Cog,
        meta: {
            menu: true,
            figure: true
        }
    },
    {
        name: 'Bezier',
        path: '/Bezier',
        component: Bezier,
        meta: {
            menu: true,
            figure: false
        }
    },
    {
        name: 'Figures',
        path: '/Figures/:figure?',
        component: Figures,
        meta: {
            menu: true,
            figure: false
        }
    },
    {
        name: 'BezierPaths',
        path: '/BezierPath/:figure?',
        component: BezierPath,
        meta: {
            menu: true,
            figure: false
        }
    },
    {
        name: 'Morph',
        path: '/Morph/:src?/:targ?',
        component: Morpher,
        meta: {
            menu: true,
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
