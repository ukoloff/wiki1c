const cluster = require('node:cluster')
const os = require('node:os')
const process = require('node:process')
require('dotenv/config')

if (cluster.isPrimary) {
  const numCPUs = parseInt(process.env.NUM) || os.availableParallelism()
  console.log(`MAIN<${numCPUs}>: ${process.pid}`)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log("RIP:", worker.process.pid)
    cluster.fork()
  });

  if (process.argv.includes("-debug")) {
    require('./util/watch')
  }

} else {
  console.log("WORKER:", process.pid)
  require("./util/worker")
}
