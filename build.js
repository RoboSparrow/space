'use strict';

/* eslint-disable import/no-extraneous-dependencies */
const rollup = require('rollup');
const chokidar = require('chokidar');

// https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
const colours = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    clear: '\x1b[0m'
};

let cache;
const opts = process.argv.slice(2);

const globs = {
    project: ['./src/*.js', '!./src/demo/*'],
    demo: ['./src/demo/**/*.(vue|js)']
};

const task = function (name, config) {
    rollup.rollup({
        entry: config.entry,
        plugins: config.plugins,
        external: config.external,
        cache: cache
    })
    .then((bundle) => {
        console.log(`${colours.yellow} -${name}:${colours.clear} bundling..`);
        const writers = [];
        config.targets.forEach((target) => {
            writers.push(bundle.write(target));
        });
        return Promise.all(writers);
    })
    .then((results) => {
        console.log(`${colours.yellow} -${name}:${colours.clear} ${colours.green}Bundling finished!${colours.clear}`);
    })
    .catch((error) => {
        console.log(`${colours.red} Error: ${error} ${colours.clear}`);
    });
};

const watch = function (name, glob, config) {
    const prefix = `${colours.yellow} -${name}:${colours.clear}`;

    const watcher = chokidar.watch(glob, {
        ignored: /[\/\\]\./, //eslint-disable-line no-useless-escape
        ignoreInitial: true // first add events on bootup watcher
    })
    .on('ready', () => {
        console.log(`${colours.green}Watcher${colours.clear} ${name} (${glob.join(', ')}) ${colours.green} ready...${colours.clear}`);
    })
    .on('add', (path) => {
        console.log(`${prefix}${colours.clear} File ${path} has been added`);
        task(name, config);
    })
    .on('change', (path) => {
        console.log(`${prefix}${colours.clear} File ${path} has been changed`);
        task(name, config);
    })
    .on('unlink', (path) => {
        console.log(`${prefix}${colours.clear} File ${path} has been removed`);
        task(name, config);
    })
    ;

    return watcher;
};

let config;
opts.forEach((name) => {
    config = require(`./rollup.config-${name}.js`); //eslint-disable-line global-require, import/no-dynamic-require
    watch(name, globs[name], config);
});
