'use strict';
const fs = require('fs');
const spawn = require('child_process').spawn;
const filename = process.argv[2];
console.log(parametrs);
fs.watch(filename, () => {
    const ls = spawn(process.argv[3], [...process.argv].splice(4));
    ls.stdout.pipe(process.stdout);
});
