/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies, no-console */
//eslint 'strict' warning can't be disabled inline, wait for https://github.com/eslint/eslint/issues/4936

'use strict';

const rollup = require('rollup');
const chokidar = require('chokidar');
const fse = require('fs-extra');

const ConfigProject = require('./rollup.config-project');
const ConfigDemo = require('./rollup.config-demo');

// https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
const colours = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    clear: '\x1b[0m'
};

// handle options
const argv = process.argv.slice(2);
const opts = argv.filter((opt) => {
    return opt.indexOf('-w') === -1 && opt.indexOf('--watch') === -1;
});
const mode = (argv.length > opts.length) ? 'watch' : 'build';

if (opts.length < 1) {
    console.log(`${colours.red}Abort!${colours.clear} No task for ${colours.yellow}${mode}${colours.clear} found.`);
    console.log(`${colours.yellow}Command: ${colours.clear} ./node build --<option> <task>`);
    process.exit();
}

////
// utils
////

const copy = function (src, dest) {
    return new Promise((resolve, reject) => {
        fse.copy(src, dest, (err) => {
            if (err) {
                reject(err);
                return;
            }
            // eslint-disable-next-line no-useless-escape
            resolve(dest.replace(/^.*[\\\/]/, ''));
        });
    });
};


////
// Mode Config
////

let cache;

// make sure the watched files exclude each other in every task
    
const CONFIG = {
    project: {
        rollup: ConfigProject,
        glob: ['./src/*.js', '!./src/demo/*'],
        extraTasks: []
    },

    demo: {
        rollup: ConfigDemo,
        glob: ['./src/demo/**/*.(vue|js)', './src/demo/*.scss'],
        extraTasks: [
            () => {
                return copy('./node_modules/vue/dist/vue.min.js', './build/demo/vue.min.js');
            },
            () => {
                return copy('./node_modules/vue-router/dist/vue-router.min.js', './build/demo/vue-router.min.js');
            },
            () => {
                return copy('./node_modules/muicss/dist/js/mui.min.js', './build/demo/mui.min.js');
            }
        ]
    }
};

////
// tasks
////

const task = function (name, config) {
    return rollup.rollup({
        entry: config.rollup.entry,
        plugins: config.rollup.plugins,
        external: config.rollup.external,
        cache: cache
    })
    .then((bundle) => {
        console.log(`${colours.yellow} -${name}:${colours.clear} bundling..`);
        const writers = [];
        config.rollup.targets.forEach((target) => {
            writers.push(bundle.write(target));
        });
        config.extraTasks.forEach((taskFn) => {
            writers.push(taskFn());
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

////
// watch
////

const watch = function (name, config) {
    const prefix = `${colours.yellow} -${name}:${colours.clear}`;

    const watcher = chokidar.watch(config.glob, {
        ignored: /[\/\\]\./, //eslint-disable-line no-useless-escape
        ignoreInitial: true // first add events on bootup watcher
    })
    .on('ready', () => {
        console.log(`${colours.green}Watcher${colours.clear} ${name} (${config.glob.join(', ')}) ${colours.green} ready...${colours.clear}`);
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

////
// build
////

opts.forEach((name) => {
    if (mode === 'watch') {
        watch(name, CONFIG[name]);
        return;
    }
    if (mode === 'build') {
        task(name, CONFIG[name]);
        return;
    }
    console.log(`${colours.red}Abort!${colours.clear} No task for mode ${colours.yellow}${mode}${colours.clear} found.`);
    process.exit();
});
