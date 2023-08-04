const fs = require('fs');
const filename = process.argv[2];
if (!filename) {
throw Error('A file to watch must be specified!');
}
const watcher = fs.watch(filename, () => console.log(`File ${filename} changed!`));
console.log(`Now watching ${filename} for changes...`);
watcher.on('error', (error) => {
    // Handle errors
    console.error(`Watcher error: ${error.message}`);
  });