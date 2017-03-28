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

const task = function (config) {
    rollup.rollup({
        entry: config.entry,
        plugins: config.plugins,
        external: config.external,
        cache: cache
    }).then((bundle) => {
        config.targets.forEach((target) => {
            bundle.write(target);
        });
    });
};

const watch = function (name, glob, config) {

    const watcher = chokidar.watch(glob, {
        ignored: /[\/\\]\./, //eslint-disable-line no-useless-escape
        ignoreInitial: true // first add events on bootup watcher
    })
    .on('ready', () => {
        console.log(`${colours.green}Watcher${colours.clear} ${name} (${glob.join(', ')}) ${colours.green} ready...${colours.clear}`);
    })
    .on('add', (path) => {
        console.log(`${colours.yellow} --${name}:${colours.clear} File ${path} has been added`);
        task(config);
    })
    .on('change', (path) => {
        console.log(`${colours.yellow} --${name}:${colours.clear} File ${path} has been changed`);
        task(config);
    })
    .on('unlink', (path) => {
        console.log(`${colours.yellow} --${name}:${colours.clear} File ${path} has been removed`);
        task(config);
    })
    ;

    return watcher;
};

let config;
opts.forEach((name) => {
    config = require(`./rollup.config-${name}.js`); //eslint-disable-line global-require, import/no-dynamic-require
    watch(name, globs[name], config);
});
