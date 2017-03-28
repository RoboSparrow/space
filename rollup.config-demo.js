const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const eslint = require('rollup-plugin-eslint');
const vue = require('rollup-plugin-vue');
const scss = require('rollup-plugin-scss');

const pkg = require('./package.json');
const externals = [/* add your deps */].concat(Object.keys(pkg.dependencies));

const SRC = {
    path: 'src/demo/'
};

const DEST = {
    path: 'build/demo/'
};

module.exports = {

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
