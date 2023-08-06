'use strict';
const zmq = require('zeromq');

async function run() {
  const sock = new zmq.Subscriber

  sock.connect("tcp://localhost:60400");
    sock.subscribe()

  for await (const [topic, msg] of sock) {
    const message = JSON.parse(msg);
    const date = new Date(message.timestamp);
    console.log(`File "${message.file}" changed at ${date}`);
}

}

run()