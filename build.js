const rollup = require('rollup');
const fs = require( 'fs' );
var chokidar = require('chokidar');

// https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
const colours = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    clear: '\x1b[0m'
    
}
// used to track the cache for subsequent bundles
let cache;
let config;

const DEMO = require('./rollup.config-demo.js');

const  taskDemo = function () {
    rollup.rollup({
    
        entry: DEMO.entry,
        plugins: DEMO.plugins,
        external: DEMO.external,
    
        cache: cache
    }).then( function ( bundle ) {
        let result;
        
        DEMO.targets.forEach((target) => {
            bundle.write(target);
        });
    
    });
};

const watcherDemo = chokidar.watch('./src/demo/**/*.(vue|js)', {
    ignored: /[\/\\]\./,
    ignoreInitial: true //first add events on bootup watcher
})

watcherDemo
    .on('ready', path => {
        console.log(`${colours.green}Watcher ready...${colours.clear}`);
    })
    .on('add', path => {
        console.log(`${colours.yellow} --${colours.clear} File ${path} has been added`);
        taskDemo();
    })
    .on('change', path => {
        console.log(`${colours.yellow} --${colours.clear} File ${path} has been changed`);
        taskDemo();
    })
    .on('unlink', path => {
        console.log(`${colours.yellow} --${colours.clear} File ${path} has been removed`);
        taskDemo();
    })
;
