'use strict';

/* eslint-disable import/no-extraneous-dependencies */
const rollup = require('rollup');
const chokidar = require('chokidar');
const fse = require('fs-extra');

// https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
const colours = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    clear: '\x1b[0m'
};

let cache;
const opts = process.argv.slice(2);

const copy = function (src, dest) {
    return new Promise((resolve, reject) => {
        fse.copy(src, dest, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dest.replace(/^.*[\\\/]/, ''));
        });
    });
};

const CONFIG = {
    project: {
        require: './rollup.config-project.js',
        glob: ['./src/*.js', '!./src/demo/*'],
        extraTasks: []
    },
    // make sure thewatched files exclude each other in every task
    demo: {
        require: './rollup.config-demo.js',
        glob: ['./src/demo/**/*.(vue|js)'],
        extraTasks: [
            () => {
                return copy('./node_modules/vue/dist/vue.min.js', './build/demo/vue.min.js');
            },
            () => {
                return copy('./node_modules/vue-router/dist/vue-router.min.js', './build/demo/vue-router.min.js');
            }
        ]
    }
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
        CONFIG[name].extraTasks.forEach((task) => {
            writers.push(task());
        });
        return Promise.all(writers);
    })
    .then(() => {
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
    config = require(CONFIG[name].require); //eslint-disable-line global-require, import/no-dynamic-require
    watch(name, CONFIG[name].glob, config);
});
