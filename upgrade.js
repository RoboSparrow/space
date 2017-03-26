'use strict';
const fs = require('fs');
const exec = require('child_process').exec;

const pkg = require('./package.json');
const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);

const tasks = [];
if (fs.existsSync('./node_modules')) {
    tasks.push('rm -r ./node_modules');
}
tasks.push('npm --save-dev install ' + devDeps.join(' '));

//console.log(tasks.join(' && '));process.exit();
const child = exec(tasks.join(' && '), function(err, stdout, stderr) {
  if (err) {
    console.log(stderr);
  }
  console.log(stdout);
});

child.on('exit', function (code) {
  console.log("\n" + 'script eited with: ' + code);
});
