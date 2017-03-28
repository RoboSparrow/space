const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const eslint = require('rollup-plugin-eslint');

const pkg = require('./package.json');
const externals = Object.keys(pkg.dependencies);

const SRC = {
    path: 'src/'
};

const DEST = {
    path: 'build/'
};

module.exports = {

    entry: SRC.path + 'Space.js',

    plugins: [
        eslint(),
        babel(babelrc())
    ],
    external: externals,
    targets: [
        {
            dest: DEST.path + 'Space.js',
            format: 'iife', //You must specify an output type - valid options are amd, cjs, es, iife, umd
            moduleName: 'Space',
            sourceMap: true
        },
        {
            dest: DEST.path + 'Space.module.js',
            format: 'es',
            sourceMap: true
        }
    ]
};
