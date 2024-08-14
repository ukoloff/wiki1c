const http = require('node:http')
const home = require('./home')
const oops = require('./404')

http.createServer(process)
  .listen(5432, 'localhost')

function process(req, res) {
  var path = req.url
  if ('/' == path) {
    home(req, res)
    return
  }
  $m = /^\/([\da-f]{4,})($|\/)/.exec(path)
  oops(req, res)
}
