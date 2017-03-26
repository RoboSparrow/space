import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import eslint from 'rollup-plugin-eslint';

const pkg = require('./package.json');
const externals = Object.keys(pkg.dependencies);

const SRC = {
    path: 'src/'
};

const DEST = {
    path: 'build/'
};

export default {

    entry: SRC.path + 'index.js',

    plugins: [
        eslint(),
        babel(babelrc())
    ],
    external: externals,
    targets: [
        {
            dest: DEST.path + 'test.js',
            format: 'iife', //You must specify an output type - valid options are amd, cjs, es, iife, umd
            moduleName: 'Space',
            sourceMap: true
        },
        {
            dest: DEST.path + 'test.module.js',
            format: 'es',
            sourceMap: true
        }
    ]
};
