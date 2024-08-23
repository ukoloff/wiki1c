require('dotenv/config')
const fs = require('node:fs')
const home = require('./view/home')
const oops = require('./view/404')
const getpage = require('./model/getpage')
const renderpage = require('./rpage')
const attachment = require('./view/attachment')
const assets = require('./view/assets')
const api = require('./api')

module.exports = route

async function route(req, res) {
  res.$base = `/${req.headers['x-forwarded-base'] || ''}/`.replace(/\/{2,}/g, '/')

  var path = req.url

  if (process.env.LOG) log(`${new Date().toISOString()}\t${req.method}\t${path}`)

  if (/^\/($|\?)/.test(path)) {
    home(res)
    return
  }

  if (path == '/api/' && req.method == 'POST')
    return api(res)

  if (/^\/assets\/.*/.test(path)) {
    return assets(res)
  }

  var $m = /^\/([\da-f]{4,})($|\/)(.*)/.exec(path)
  if ($m) {
    if (!$m[2]) {
      res.writeHead(301, { Location: $m[1] + '/' })
        .end()
      return
    }
    var page = await getpage($m[1])
    if (!page) return oops(res)
    return $m[3] ?
      attachment(res, page, decodeURIComponent($m[3])) :
      renderpage(res, page)
  }
  oops(res)
}

function log(s) {
  let log = fs.createWriteStream(process.env.LOG, { flags: 'a' })
  log.write(s + '\n')
  log.close()
}
