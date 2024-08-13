const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log("MAIN:", process.pid)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log("RIP:", worker.process.pid)
    cluster.fork()
  });

  if (process.argv.includes("-debug")) {
    require('./watch')
  }

} else {
  console.log("WORKER:", process.pid)
  require("./worker")
}
