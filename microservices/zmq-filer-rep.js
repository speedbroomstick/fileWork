"use strict";
const fs = require("fs");
const zmq = require("zeromq");

async function run() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://127.0.0.1:60401").then(() => {
    console.log("Listening for zmq requesters...");
  });

  for await (const [msg] of sock) {
    // Parse the incoming message.
    const request = JSON.parse(msg);
    console.log(`Received request to get: ${request.path}`);

    // Read the file and reply with content.
    await fs.readFile(request.path, (err, content) => {
      console.log("Sending response content.");
      sock.send(
        JSON.stringify({
          content: content.toString(),
          timestamp: Date.now(),
          pid: process.pid,
        })
      );
    });
  }
  // Close the responder when the Node process ends.
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    responder.close();
  });
}

run();
