const http = require('node:http')
const home = require('./home')

http.createServer((req, res) => {
  var path = req.url
  if ('/' == path) {
    home(req, res)
    return
  } else {
    $m = /^\/[\da-f]{4,}($|\/)/.exec(path)
  }
  res.statusCode = 404
  res.end(`Path <${path}> not found!`)
}).listen(5432, 'localhost')
