// 'use strict';
// require('fs').createReadStream(process.argv[2])
// .on('data', chunk => process.stdout.write(chunk))
// .on('error', err => process.stderr.write(`ERROR: ${err.message}\n`));
const fs = require('fs');

const readableStream = fs.createReadStream('target.txt');  // Readable stream from 'input.txt'
const writableStream = fs.createWriteStream('output.txt');  // Writable stream to 'output.txt'

// Use pipe() to transfer data from readableStream to writableStream
readableStream.pipe(writableStream);

// Optional: Handle 'end' event when the data transfer is complete
writableStream.on('finish', () => {
  console.log('Data transfer complete.');
});
