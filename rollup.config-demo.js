import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import eslint from 'rollup-plugin-eslint';
import vue from 'rollup-plugin-vue';
import scss from 'rollup-plugin-scss';

const pkg = require('./package.json');
const externals = [/* add your deps */].concat(Object.keys(pkg.dependencies));

const SRC = {
    path: 'src/demo/'
};

const DEST = {
    path: 'build/demo/'
};

export default {

    entry: SRC.path + 'main.js',

    plugins: [
        vue({
            css: true //<head>
            // css: DEST.path + 'components.css'
        }),
        scss(),
        eslint(),
        babel(babelrc()) //last!
    ],

    external: externals,

    globals: {
        Vue: 'vue',
        VueRouter: 'vue-router'
    },

    targets: [
        {
            dest: DEST.path + 'main.js',
            format: 'iife', //You must specify an output type - valid options are amd, cjs, es, iife, umd
            moduleName: 'Space',
            sourceMap: true
        }
    ]
};
