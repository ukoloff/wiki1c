const http = require('node:http')

http.createServer((req, res) => {
  res.end('Hello, world!')
}).listen(5432, 'localhost')
