"use strict";
const cluster = require("cluster");
const fs = require("fs").promises;
const zmq = require("zeromq");

const numWorkers = require("os").cpus().length;
async function run() {
  if (cluster.isMaster) {
    // Master process creates ROUTER and DEALER sockets and binds endpoints.
    const router = new zmq.Router();
    await router.bind("tcp://127.0.0.1:60401"); // Используем TCP-сокет

    // Forward messages between the router and dealer.
    for await (const [identity, ...frames] of router) {
      router.send([identity, ...frames]);
    }

    // Listen for workers to come online.
    cluster.on("online", (worker) =>
      console.log(`Worker ${worker.process.pid} is online.`)
    );

    // Fork a worker process for each CPU.
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }
  } else {
    // Worker processes create a REP socket and connect to the ROUTER.
    const responder = new zmq.Reply();
    responder.connect("tcp://127.0.0.1:60401"); // Используем TCP-сокет

    for await (const [request] of responder) {
      const requestData = JSON.parse(request);
      console.log(`${process.pid} received request for: ${requestData.path}`);

      try {
        // Read the file and reply with content.
        const content = await fs.readFile(requestData.path, "utf-8");
        console.log(`${process.pid} sending response`);
        responder.send(
          JSON.stringify({
            content: content,
            timestamp: Date.now(),
            pid: process.pid,
          })
        );
      } catch (err) {
        console.error(`${process.pid} error reading file:`, err);
        responder.send(JSON.stringify({ error: "File not found." }));
      }
    }
  }
}
run();
