const http = require('node:http')
const route = require('./route')

http.createServer(route)
  .listen(5678)
