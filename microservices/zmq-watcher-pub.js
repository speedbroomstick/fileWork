'use strict';
const fs = require('fs');
const zmq = require('zeromq');
const filename = process.argv[2];

// Create the publisher endpoint.
const publisher = new zmq.Publisher;

fs.watch(filename, () => {
  
  // Send a message to any and all subscribers.
  publisher.send(["kitty cats",JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  })]);
  
});

// Listen on TCP port 60400.
publisher.bind('tcp://*:60400').then(()=>{
    console.log('Listening for zmq subscribers...');
});