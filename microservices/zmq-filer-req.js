"use strict";
const zmq = require("zeromq");
const filename = process.argv[2];

async function run() {
  const sock = new zmq.Request();
  
  sock.connect("tcp://127.0.0.1:60401"); // Используем TCP-сокет
  console.log("Producer bound to port 60401");

  for (let i = 1; i <= 500; i++) {
    console.log(`Sending request ${i} for ${filename}`);
    await sock.send(JSON.stringify({ path: filename }));

    const [result] = await sock.receive();
    console.log("Received response:", JSON.parse(result));
  }
}

run();
